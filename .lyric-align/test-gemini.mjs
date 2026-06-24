import { GoogleGenAI } from "@google/genai";
import fs from "fs";
import { execSync } from "child_process";

const ai = new GoogleGenAI({
  apiKey: process.env.AI_INTEGRATIONS_GEMINI_API_KEY,
  httpOptions: { apiVersion: "", baseUrl: process.env.AI_INTEGRATIONS_GEMINI_BASE_URL },
});

// Compress to mono 32kbps mp3 to stay well under 8MB
execSync(`ffmpeg -y -i /tmp/t1.mp3 -ac 1 -b:a 32k /tmp/t1_small.mp3 2>/dev/null`);
const sz = fs.statSync("/tmp/t1_small.mp3").size;
console.log("compressed size:", (sz / 1024 / 1024).toFixed(2), "MB");

// Existing lyric lines for track 001 (displayed lines, strip empty)
const raw = fs.readFileSync(
  "artifacts/portfolio/public/music/lyrics_001.txt",
  "utf8"
);
const lines = raw
  .split("\n")
  .map((l) => l.replace(/^\[\d{1,2}:\d{2}(?:\.\d+)?\]/, "").trim())
  .filter((l) => l.length > 0);

const numbered = lines.map((l, i) => `${i + 1}. ${l}`).join("\n");

const prompt = `你會聽到一首中文歌曲的音檔。下面是這首歌「按順序」的歌詞行(已編號)。
請仔細聆聽音檔,判斷每一行歌詞「實際被唱出來的開始時間」(以秒為單位,可含小數)。
規則:
- 時間必須隨行號遞增(單調不減)。
- 如果某一行在音檔中聽不出來(例如純背景或沒唱到),start 給 null。
- 只回傳 JSON,格式為陣列:[{"n":1,"start":12.3}, {"n":2,"start":18.7}, ...]
- 不要更改歌詞文字,只需要時間。

歌詞:
${numbered}`;

const audioB64 = fs.readFileSync("/tmp/t1_small.mp3").toString("base64");

const resp = await ai.models.generateContent({
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

const text = resp.text;
console.log("=== raw response (first 1200 chars) ===");
console.log(text.slice(0, 1200));

const arr = JSON.parse(text);
console.log("\n=== aligned (line -> time) ===");
arr.slice(0, 16).forEach((o) => {
  const fmt =
    o.start == null
      ? "null"
      : `${Math.floor(o.start / 60)}:${(o.start % 60).toFixed(2).padStart(5, "0")}`;
  console.log(`  [${fmt}] ${lines[o.n - 1] || "?"}`);
});
console.log("total lines:", lines.length, "returned:", arr.length);
