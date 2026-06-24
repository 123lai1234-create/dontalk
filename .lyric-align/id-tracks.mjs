import { GoogleGenAI } from "@google/genai";
import fs from "fs";
import path from "path";
import { execSync } from "child_process";

const MUSIC_DIR = "artifacts/portfolio/public/music";
const TMP = ".lyric-align/tmp";
const CACHE = ".lyric-align/idcache";
fs.mkdirSync(TMP, { recursive: true });
fs.mkdirSync(CACHE, { recursive: true });

const ai = new GoogleGenAI({
  apiKey: process.env.AI_INTEGRATIONS_GEMINI_API_KEY,
  httpOptions: { apiVersion: "", baseUrl: process.env.AI_INTEGRATIONS_GEMINI_BASE_URL },
});

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function transcribe(track) {
  const audioName = track.audio.split("/").pop();
  const cacheFile = path.join(CACHE, audioName + ".json");
  if (fs.existsSync(cacheFile)) {
    try {
      const c = JSON.parse(fs.readFileSync(cacheFile, "utf8"));
      if (c && Array.isArray(c.lines) && c.lines.length) return c;
    } catch {}
  }
  const rawMp3 = path.join(TMP, `id_${audioName}`);
  const smallMp3 = path.join(TMP, `id_s_${audioName}`);
  try {
    execSync(`curl -s -f -m 120 -o "${rawMp3}" "${track.audio}"`);
    execSync(`ffmpeg -y -t 50 -i "${rawMp3}" -ac 1 -b:a 32k "${smallMp3}" 2>/dev/null`, { timeout: 90000 });
  } catch (e) {
    return { audio: audioName, err: "download/ffmpeg failed" };
  }
  const audioB64 = fs.readFileSync(smallMp3).toString("base64");
  const prompt = `這是一首歌的前 50 秒音檔。請聽寫出實際被唱出來的「前 8 句」人聲歌詞（中文/英文/日文/韓文皆可，照原文）。只回傳 JSON：{"lines":["第一句","第二句",...]}。若是純音樂前奏聽不到人聲就回傳已聽到的句子。不要翻譯。`;
  let arr = null, lastErr = "";
  for (let attempt = 1; attempt <= 4; attempt++) {
    try {
      const callP = ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [{ role: "user", parts: [{ text: prompt }, { inlineData: { mimeType: "audio/mp3", data: audioB64 } }] }],
        config: { responseMimeType: "application/json", temperature: 0 },
      });
      const toP = new Promise((_, rej) => setTimeout(() => rej(new Error("timeout45")), 45000));
      const resp = await Promise.race([callP, toP]);
      const j = JSON.parse(resp.text);
      arr = j.lines || j;
      if (Array.isArray(arr) && arr.length) break;
      arr = null; lastErr = "empty";
    } catch (e) {
      lastErr = (e && e.message) || String(e);
      await sleep((/429|rate|quota|RESOURCE_EXHAUSTED|overloaded|503|UNAVAILABLE/i.test(lastErr) ? 6000 : 1500) * attempt);
    }
  }
  try { fs.unlinkSync(rawMp3); fs.unlinkSync(smallMp3); } catch {}
  const res = { audio: audioName, lines: arr, err: arr ? null : lastErr.slice(0, 80) };
  if (arr) fs.writeFileSync(cacheFile, JSON.stringify(res));
  return res;
}

async function main() {
  const playlist = JSON.parse(fs.readFileSync(path.join(MUSIC_DIR, "playlist.json"), "utf8"));
  let tracks = playlist.tracks.map((t, i) => ({ ...t, _idx: i + 1 }));
  if (process.env.INDICES) {
    const want = new Set(process.env.INDICES.split(",").map((x) => parseInt(x, 10)));
    tracks = tracks.filter((t) => want.has(t._idx));
  }
  const CONC = Number(process.env.CONC || 2);
  let next = 0;
  const results = [];
  async function worker() {
    while (true) {
      const k = next++;
      if (k >= tracks.length) break;
      const t = tracks[k];
      const r = await transcribe(t);
      r.idx = t._idx; r.name = t.name; r.lyrics = t.lyrics.split("/").pop();
      results.push(r);
      process.stderr.write(`done idx${t._idx} ${r.audio} ${r.err ? "ERR:" + r.err : "ok(" + (r.lines ? r.lines.length : 0) + ")"}\n`);
      await sleep(300);
    }
  }
  await Promise.all(Array.from({ length: CONC }, () => worker()));
  results.sort((a, b) => a.idx - b.idx);
  fs.writeFileSync(".lyric-align/id-results.json", JSON.stringify(results, null, 2));
  process.stderr.write(`WROTE .lyric-align/id-results.json (${results.length})\n`);
}
main().catch((e) => { console.error("FATAL", e); process.exit(1); });
