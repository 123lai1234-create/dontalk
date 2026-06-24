import fs from "fs";
import path from "path";
const MUSIC_DIR = "artifacts/portfolio/public/music";
const results = JSON.parse(fs.readFileSync(".lyric-align/id-results.json","utf8"));

function displayLines(raw){
  const out=[];
  for(const r of raw.split("\n")){
    const line=r.trim(); if(!line) continue;
    const m=line.match(/^\[(\d{1,2}):(\d{2})(?:\.(\d{1,3}))?\](.*)$/);
    if(m){ const t=m[4].trim(); if(t) out.push(t); }
    else if(line.startsWith("[")) continue;
    else out.push(line);
  }
  return out;
}
function titleOf(lines){
  for(const l of lines){ const m=l.match(/【([^】]+)】/); if(m) return m[1].trim(); }
  for(const l of lines){ if(l.startsWith("#")){ const seg=l.replace(/^#+\s*/,"").split(/[–—\-\/]/); return seg[seg.length-1].trim(); } }
  return (lines[0]||"").replace(/【|】/g,"");
}
const lyricFiles={};
for(const f of fs.readdirSync(MUSIC_DIR)){
  if(!/^lyrics_\d+\.txt$/.test(f)) continue;
  const lines=displayLines(fs.readFileSync(path.join(MUSIC_DIR,f),"utf8"));
  // drop the title/metadata lines for content matching
  const content=lines.filter(l=>!/【[^】]+】/.test(l) && !l.startsWith("#") && !/^[-*]\s/.test(l) && !/^##/.test(l));
  lyricFiles[f]={lines, title:titleOf(lines), content};
}
const norm=s=>(s||"").toLowerCase().replace(/[\s\p{P}\p{S}]/gu,"");
function ngrams(s,n){ const g=new Set(); for(let i=0;i<=s.length-n;i++) g.add(s.slice(i,i+n)); return g; }
function dice(a,b,n){ const A=ngrams(a,n),B=ngrams(b,n); if(!A.size||!B.size) return 0; let i=0; for(const x of A) if(B.has(x)) i++; return 2*i/(A.size+B.size); }
// best single-line match: does any transcribed line appear ~verbatim in the lyric file?
function lineHit(transLines, lyContent){
  let best=0;
  const lyN=lyContent.map(norm);
  for(const tl of transLines.slice(0,5)){
    const t=norm(tl); if(t.length<4) continue;
    for(const ly of lyN){ const s=dice(t,ly,2); if(s>best) best=s; }
  }
  return best;
}
const matches=[];
for(const r of results){
  const tl=r.lines||[];
  const trans=norm(tl.join(""));
  let best=null,bestScore=-1,second=-1,bestInfo=null;
  for(const [f,info] of Object.entries(lyricFiles)){
    const lyBlob=norm(info.content.slice(0,16).join(""));
    const sc = 0.6*dice(trans,lyBlob,3) + 0.4*lineHit(tl,info.content); // trigram blob + line-level
    if(sc>bestScore){ second=bestScore; bestScore=sc; best=f; bestInfo=info; }
    else if(sc>second) second=sc;
  }
  matches.push({ idx:r.idx, audio:r.audio, curLyrics:r.lyrics,
    newLyrics:best, newTitle:bestInfo.title, score:+bestScore.toFixed(3), gap:+(bestScore-second).toFixed(3),
    transHead: tl.slice(0,2).join(" / "),
    lyHead: bestInfo.content.slice(0,2).join(" / ") });
}
fs.writeFileSync(".lyric-align/matches.json", JSON.stringify(matches,null,2));
let low=0;
for(const m of matches){
  const flag = m.score<0.30 ? " !!LOW" : "";
  if(m.score<0.30) low++;
  console.log(`${String(m.idx).padStart(2)} ${m.audio}->${m.newLyrics}(${m.newTitle}) s=${m.score}${flag}`);
  console.log(`    AUDIO: ${m.transHead}`);
  console.log(`    LYRIC: ${m.lyHead}`);
}
console.log("LOW-CONFIDENCE:",low);
