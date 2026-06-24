import fs from "fs";
import path from "path";
const MUSIC_DIR="artifacts/portfolio/public/music";
const results=JSON.parse(fs.readFileSync(".lyric-align/id-results.json","utf8"));
function displayLines(raw){const out=[];for(const r of raw.split("\n")){const line=r.trim();if(!line)continue;const m=line.match(/^\[(\d{1,2}):(\d{2})(?:\.(\d{1,3}))?\](.*)$/);if(m){const t=m[4].trim();if(t)out.push(t);}else if(line.startsWith("["))continue;else out.push(line);}return out;}
function titleOf(lines){for(const l of lines){const m=l.match(/【([^】]+)】/);if(m)return m[1].trim();}for(const l of lines){if(l.startsWith("#")){const seg=l.replace(/^#+\s*/,"").split(/[–—\-\/]/);return seg[seg.length-1].trim();}}return (lines[0]||"").replace(/【|】/g,"");}
const lyricFiles={};
for(const f of fs.readdirSync(MUSIC_DIR)){if(!/^lyrics_\d+\.txt$/.test(f))continue;const lines=displayLines(fs.readFileSync(path.join(MUSIC_DIR,f),"utf8"));const content=lines.filter(l=>!/【[^】]+】/.test(l)&&!l.startsWith("#")&&!/^[-*]\s/.test(l)&&!/^##/.test(l));lyricFiles[f]={lines,title:titleOf(lines),content};}
const norm=s=>(s||"").toLowerCase().replace(/[\s\p{P}\p{S}]/gu,"");
function ngrams(s,n){const g=new Set();for(let i=0;i<=s.length-n;i++)g.add(s.slice(i,i+n));return g;}
function dice(a,b,n){const A=ngrams(a,n),B=ngrams(b,n);if(!A.size||!B.size)return 0;let i=0;for(const x of A)if(B.has(x))i++;return 2*i/(A.size+B.size);}
function lineHit(tlns,lyc){let best=0;const lyN=lyc.map(norm);for(const tl of tlns.slice(0,6)){const t=norm(tl);if(t.length<4)continue;for(const ly of lyN){const s=dice(t,ly,2);if(s>best)best=s;}}return best;}
// score matrix
const files=Object.keys(lyricFiles);
const pairs=[];
for(const r of results){
  const tl=r.lines||[]; const trans=norm(tl.join(""));
  for(const f of files){const info=lyricFiles[f];const blob=norm(info.content.slice(0,16).join(""));const sc=0.6*dice(trans,blob,3)+0.4*lineHit(tl,info.content);pairs.push({idx:r.idx,f,sc});}
}
pairs.sort((a,b)=>b.sc-a.sc);
const audioTaken=new Map(), fileTaken=new Set();
for(const p of pairs){ if(audioTaken.has(p.idx)||fileTaken.has(p.f))continue; audioTaken.set(p.idx,{f:p.f,sc:p.sc}); fileTaken.add(p.f); }
// report
const byIdx=new Map(results.map(r=>[r.idx,r]));
const leftover=[];
const assign=[];
for(const r of results){
  const a=audioTaken.get(r.idx);
  if(!a){leftover.push(r.idx);continue;}
  assign.push({idx:r.idx,audio:r.audio,file:a.f,title:lyricFiles[a.f].title,sc:+a.sc.toFixed(3),
    aHead:(r.lines||[]).slice(0,1).join(""),lHead:lyricFiles[a.f].content.slice(0,1).join("")});
}
for(const m of assign){const lo=m.sc<0.30?" !!LOW":"";console.log(`${String(m.idx).padStart(2)} ${m.audio}->${m.file}(${m.title}) s=${m.sc}${lo}\n    A:${m.aHead}\n    L:${m.lHead}`);}
console.log("LEFTOVER audios (no file):",leftover.map(i=>byIdx.get(i).audio).join(", "));
fs.writeFileSync(".lyric-align/assign.json",JSON.stringify({assign,leftover:leftover.map(i=>({idx:i,audio:byIdx.get(i).audio}))},null,2));
