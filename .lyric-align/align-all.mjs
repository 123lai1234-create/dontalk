import { GoogleGenAI } from "@google/genai";
import fs from "fs";
import path from "path";
import { execSync } from "child_process";

const MUSIC_DIR = "artifacts/portfolio/public/music";
const WORK = ".lyric-align";
const BACKUP = path.join(WORK, "backup");
const DONE = path.join(WORK, "done");
const TMP = path.join(WORK, "tmp");
const LOG = path.join(WORK, "progress.log");
const CONCURRENCY = Number(process.env.CONC || 2);
const MAX_RETRY = Number(process.env.RETRIES || 4);
const MAX_RUNTIME_MS = 900000;
const START_TS = Date.now();

for (const d of [BACKUP, DONE, TMP]) fs.mkdirSync(d, { recursive: true });

const ai = new GoogleGenAI({
  apiKey: process.env.AI_INTEGRATIONS_GEMINI_API_KEY,
  httpOptions: { apiVersion: "", baseUrl: process.env.AI_INTEGRATIONS_GEMINI_BASE_URL },
});

function log(msg) {
  const line = `[${new Date().toISOString()}] ${msg}\n`;
  fs.appendFileSync(LOG, line);
  process.stderr.write(line);
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Parse a lyric file into the lines the player actually displays.
// Returns array of { text } in order. Strips [mm:ss] prefixes and drops
// pure bracket section markers like [Verse 1].
function extractLines(raw) {
  const out = [];
  for (const lineRaw of raw.split("\n")) {
    const line = lineRaw.trim();
    if (!line) continue;
    const m = line.match(/^\[(\d{1,2}):(\d{2})(?:\.(\d{1,3}))?\](.*)$/);
    if (m) {
      const t = m[4].trim();
      if (t) out.push(t);
    } else if (line.startsWith("[")) {
      // section marker like [Verse 1] / [Chorus] -> not displayed, skip
      continue;
    } else {
      out.push(line);
    }
  }
  return out;
}

function fmtTime(sec) {
  if (sec < 0) sec = 0;
  const m = Math.floor(sec / 60);
  const s = sec - m * 60;
  return `[${String(m).padStart(2, "0")}:${s.toFixed(2).padStart(5, "0")}]`;
}

async function getDuration(file) {
  try {
    const out = execSync(
      `ffprobe -v error -show_entries format=duration -of csv=p=0 "${file}"`
    ).toString().trim();
    const d = parseFloat(out);
    return isFinite(d) ? d : 0;
  } catch {
    return 0;
  }
}

async function alignTrack(track, idx) {
  const lyricsName = track.lyrics.split("/").pop();
  const lyricsPath = path.join(MUSIC_DIR, lyricsName);
  const tag = lyricsName.replace("lyrics_", "").replace(".txt", "");
  const doneMarker = path.join(DONE, tag);

  if (fs.existsSync(doneMarker)) {
    return "skip";
  }
  if (!fs.existsSync(lyricsPath)) {
    log(`SKIP ${tag} (no lyrics file)`);
    return;
  }

  // backup original once
  const bak = path.join(BACKUP, lyricsName);
  if (!fs.existsSync(bak)) fs.copyFileSync(lyricsPath, bak);

  const raw = fs.readFileSync(bak, "utf8"); // always align from original backup
  const lines = extractLines(raw);
  if (lines.length === 0) {
    log(`SKIP ${tag} (no displayable lines)`);
    fs.writeFileSync(doneMarker, "empty");
    return;
  }

  // download + compress audio
  const rawMp3 = path.join(TMP, `t${tag}.mp3`);
  const smallMp3 = path.join(TMP, `t${tag}_s.mp3`);
  try {
    execSync(`curl -s -f -m 120 -o "${rawMp3}" "${track.audio}"`);
  } catch (e) {
    log(`ERROR ${tag} download failed: ${track.audio}`);
    return;
  }
  try {
    execSync(`ffmpeg -y -i "${rawMp3}" -ac 1 -b:a 32k "${smallMp3}" 2>/dev/null`, { timeout: 90000 });
  } catch (e) {
    log(`ERROR ${tag} ffmpeg failed`);
    return;
  }
  const duration = await getDuration(rawMp3);
  const audioB64 = fs.readFileSync(smallMp3).toString("base64");

  const numbered = lines.map((l, i) => `${i + 1}. ${l}`).join("\n");
  const prompt = `你會聽到一首中文歌曲的音檔。下面是這首歌「按順序」的歌詞行(已編號)。
請仔細聆聽音檔,判斷每一行歌詞「實際被唱出來的開始時間」(單位:秒,精確到小數點後一位)。
嚴格規則:
- 必須根據實際聽到的人聲起唱點。
- 時間必須隨行號單調不減。
- 若某行為標題、純音樂或聽不出有唱,start 給 null。
- 只回傳 JSON 陣列,格式:[{"n":1,"start":12.3}]
- 不要更改或翻譯歌詞文字。

歌詞:
${numbered}`;

  let arr = null;
  let lastErr = "";
  for (let attempt = 1; attempt <= MAX_RETRY; attempt++) {
    try {
      const callP = ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [
          {
            role: "user",
            parts: [
              { text: prompt },
              { inlineData: { mimeType: "audio/mp3", data: audioB64 } },
            ],
          },
        ],
        config: { responseMimeType: "application/json", temperature: 0 },
      });
      const toP = new Promise((_, rej) =>
        setTimeout(() => rej(new Error("gemini call timeout 45s")), 45000)
      );
      const resp = await Promise.race([callP, toP]);
      arr = JSON.parse(resp.text);
      if (Array.isArray(arr) && arr.length > 0) break;
      lastErr = "empty array";
      arr = null;
    } catch (e) {
      lastErr = (e && e.message) || String(e);
      const isRate = /429|rate|quota|RESOURCE_EXHAUSTED|overloaded|503|UNAVAILABLE/i.test(lastErr);
      const backoff = (isRate ? 5000 : 1500) * attempt;
      log(`RETRY ${tag} attempt ${attempt} (${lastErr.slice(0, 80)}) backoff ${backoff}ms`);
      await sleep(backoff);
    }
  }

  if (!arr) {
    log(`ERROR ${tag} gemini failed after retries: ${lastErr.slice(0, 120)}`);
    return;
  }

  // Map n -> start
  const times = new Array(lines.length).fill(null);
  for (const o of arr) {
    const n = o.n ?? o.line ?? o.index;
    if (typeof n === "number" && n >= 1 && n <= lines.length) {
      const s = o.start;
      times[n - 1] = typeof s === "number" && isFinite(s) ? s : null;
    }
  }

  // Interpolate nulls + enforce monotonic + clamp to duration
  const dur = duration > 0 ? duration : null;
  // leading nulls -> 0
  let firstKnown = times.findIndex((t) => t != null);
  if (firstKnown === -1) {
    // nothing known: even distribute
    for (let i = 0; i < times.length; i++) times[i] = (i / Math.max(1, times.length)) * (dur || 180);
  } else {
    for (let i = 0; i < firstKnown; i++) times[i] = Math.max(0, times[firstKnown] - (firstKnown - i));
    // interpolate interior + trailing
    for (let i = firstKnown + 1; i < times.length; i++) {
      if (times[i] == null) {
        // find next known
        let j = i + 1;
        while (j < times.length && times[j] == null) j++;
        const prev = times[i - 1];
        if (j < times.length && times[j] != null) {
          const step = (times[j] - prev) / (j - (i - 1));
          for (let k = i; k < j; k++) times[k] = prev + step * (k - (i - 1));
          i = j - 1;
        } else {
          // trailing nulls: increment by 2s up to duration
          for (let k = i; k < times.length; k++) times[k] = Math.min(dur || prev + 100, prev + 2 * (k - i + 1));
        }
      }
    }
  }
  // enforce monotonic + clamp
  for (let i = 0; i < times.length; i++) {
    if (i > 0 && times[i] < times[i - 1]) times[i] = times[i - 1];
    if (dur && times[i] > dur) times[i] = dur;
    if (times[i] < 0) times[i] = 0;
  }

  // Build LRC
  const lrc = lines.map((l, i) => `${fmtTime(times[i])} ${l}`).join("\n") + "\n";
  fs.writeFileSync(lyricsPath, lrc, "utf8");
  fs.writeFileSync(doneMarker, "ok");
  log(`OK ${tag} lines=${lines.length} dur=${Math.round(duration)}s first=${times[0].toFixed(1)} last=${times[times.length-1].toFixed(1)}`);

  // cleanup tmp audio to save space
  try { fs.unlinkSync(rawMp3); fs.unlinkSync(smallMp3); } catch {}
}

async function main() {
  const playlist = JSON.parse(
    fs.readFileSync(path.join(MUSIC_DIR, "playlist.json"), "utf8")
  );
  let tracks = playlist.tracks;
  if (process.env.ONLY) {
    const only = new Set(process.env.ONLY.split(","));
    tracks = tracks.filter((t) =>
      only.has(t.lyrics.split("/").pop().replace("lyrics_", "").replace(".txt", ""))
    );
  }
  log(`START aligning ${tracks.length} tracks, concurrency=${CONCURRENCY}`);

  let next = 0;
  async function worker(wid) {
    while (true) {
      if (Date.now() - START_TS > MAX_RUNTIME_MS) { log(`worker ${wid} stopping (runtime cap)`); break; }
      const i = next++;
      if (i >= tracks.length) break;
      let status;
      try {
        status = await alignTrack(tracks[i], i);
      } catch (e) {
        log(`ERROR track index ${i}: ${(e && e.stack) || e}`);
      }
      if (process.env.DBG) process.stderr.write(`[dbg] w${wid} i=${i} status=${status}\n`);
      if (status !== "skip") await sleep(500); // gentle rate limiting only after real work
    }
  }
  await Promise.all(Array.from({ length: CONCURRENCY }, (_, w) => worker(w)));
  log(`ALL DONE`);
}

main().catch((e) => log(`FATAL ${(e && e.stack) || e}`));
