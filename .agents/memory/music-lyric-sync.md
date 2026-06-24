---
name: Music lyric sync (portfolio /music)
description: How per-line lyric timing is produced and how the player consumes it
---

# Music lyric sync

The LRC `.txt` files in `artifacts/portfolio/public/music/` are now **AI-aligned to the
real audio**. Each line carries an `[mm:ss.xx]` start time derived by listening to the
externally hosted mp3s (`donttalk.netlify.app`) with Gemini. Before this, the bundled
timestamps were hand-estimated and unreliable (over/undershoot, ~24 files had none).

**Player (`music-player.js`):** `parseLyrics` stores each line's `rawTime`;
`fitLyricsToDuration()` now **trusts raw timestamps directly** when they fit the audio
(`minRaw>=0 && maxRaw<=duration*1.02`), clamping to duration. It only range-normalizes
(min..max onto duration) when timestamps clearly overshoot (legacy/fabricated), and
even-distributes when a track has no timestamps. Runs after lyrics load AND on the audio
`loadedmetadata` event (duration is NaN at `loadLyrics` time). Manual offset: J/K keys ±0.5s.
**Do not revert `fitLyricsToDuration` to always-normalize** — that distorts the accurate times.

## Regenerating alignment (dev-only tool `.lyric-align/align-all.mjs`)
Resumable batch: downloads mp3 → ffmpeg mono 32k (<8MB) → Gemini `gemini-2.5-flash`
(audio + numbered lyric lines) → per-line start seconds → interpolate nulls + enforce
monotonic + clamp to duration → write LRC back. Backups of originals in `.lyric-align/backup/`,
done-markers in `.lyric-align/done/`. Env: `ONLY=037,061` (filter tags), `CONC` (concurrency),
`RETRIES`. **Never change lyric text — only timing.** `extractLines` strips `[mm:ss]` and drops
`[Section]` markers to match the player's display logic.

## Audio↔lyric mapping was shuffled (separate from timing)
The catalog has TWO problems that look the same on screen but are distinct:
1. **Wrong file pointed to** — `playlist.json` mapped `track_NNN.mp3` to the wrong
   `lyrics_MMM.txt` (49/64 mismatched, genuinely shuffled, no offset). The lyric files
   themselves are correctly self-labeled with a `【title】` line; the catalog has ~2
   near-duplicate copies of most songs. Fix = remap each track to the file whose CONTENT
   matches its audio, and set `name` to that file's `【title】`.
2. **Timing** — see above. After remapping, re-run alignment so each file is timed to its
   now-correct audio (old timing was for whatever it used to point to).
**Identifying which song an audio actually is:** transcribe the first ~8 sung lines of every
mp3 with Gemini (`.lyric-align/id-tracks.mjs`, short 50s clip), then trigram-Dice match
audio heads vs lyric-file content heads (`.lyric-align/match.mjs`). Use **best-match
(many-to-one allowed)**, NOT forced 1:1 — some songs have 2 recordings sharing 1 lyric file,
and forcing 1:1 pushes real recordings onto wrong files. The player normalizes timing per
audio, so two recordings sharing one file is acceptable.
**`我一個人也很好` (track_013) has NO lyric file** in the catalog — it was authored fresh
(`lyrics_066.txt`) from a full Gemini transcription, then aligned like any other.

## Duplicate songs + offset sign (player sync)
- The catalog has ~2 recordings of most songs (64 audio → only 33 distinct songs). When the
  user complains about duplicates, **dedupe `playlist.json` by `name`, keeping the FIRST
  occurrence.** Why: alignment times each shared lyric file to the first track that references
  it (playlist order), so the first occurrence is the well-synced copy and later duplicates
  are timed to a different recording (drift). Dedupe therefore fixes BOTH the duplicate list
  AND much of the "out of sync" complaint in one move.
- **`lyricsOffset` sign:** player does `currentTime = audio.currentTime + lyricsOffset`, active
  line = last with `time <= currentTime`. So **negative offset = lyrics switch LATER (lag)**,
  positive = earlier. To fix "提前跳 / jumps to next line before the singer finishes", use a
  **negative** default (set to `-0.5`). The original J/K keyboard toast labels were INVERTED
  vs this math (now corrected). Gemini line-onset timestamps trend slightly early, so a small
  negative default reads better than 0.

## Gemini audio-alignment gotchas (cost real time — heed these)
- **Prompt phrasing can cause indefinite hangs.** A prompt with an explicit duration
  upper-bound constraint (e.g. "時間…不得超過 N 秒") or extra "don't distribute evenly"
  phrasing makes the model hang forever for ad-lib/foreign-vocal-heavy tracks (037, 061-065,
  Korean/「不死的腳」). The **simpler prompt** (no duration line, single-element JSON example)
  is reliable (~15s). Post-processing already clamps to duration, so the constraint is needless.
- **Always wrap `generateContent` in a `Promise.race` timeout** (~45s) — there is no built-in
  timeout; a hang otherwise blocks the worker until the process is killed (no log, looks like
  "nothing happened").
- **Concurrency >2 hits `RATELIMIT_EXCEEDED`** on the Replit Gemini proxy quickly; sustained
  load also makes calls queue/hang. Use CONC=1-2 + backoff; cool down if saturated.
- Client init must be `new GoogleGenAI({ apiKey, httpOptions:{ apiVersion:"", baseUrl } })` —
  `apiVersion:""` mandatory (default `/v1beta/` rejected by proxy). whisper-1 unsupported;
  gpt-4o-transcribe lacks timestamps — that's why Gemini audio+lyrics alignment is used.
- 2 of 64 source lyric files contain markdown metadata headers (`# title`, `- BPM:…`,
  `## 歌曲資料`) as lines; these are pre-existing source content and (per "timing only" rule)
  are left untouched — they display as lyric lines with interpolated times.
