import OpenAI from 'openai';
import fs from 'fs';

const client = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
});

async function tryIt() {
  try {
    const r = await client.audio.transcriptions.create({
      file: fs.createReadStream('/tmp/t1.mp3'),
      model: 'whisper-1',
      response_format: 'verbose_json',
      language: 'zh',
      timestamp_granularities: ['segment'],
    });
    console.log('whisper-1 OK. duration=', r.duration, 'segments=', (r.segments || []).length);
    (r.segments || []).slice(0, 12).forEach(s =>
      console.log(`  [${s.start.toFixed(2)}-${s.end.toFixed(2)}] ${s.text}`)
    );
  } catch (e) {
    console.log('whisper-1 FAILED:', e.status, e.message);
  }
}
tryIt();
