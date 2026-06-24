import fs from "fs";
const P="artifacts/portfolio/public/music/playlist.json";
const MUSIC="artifacts/portfolio/public/music/";
const pl=JSON.parse(fs.readFileSync(P,"utf8"));
// 1) dedupe by name, keep first occurrence (best-synced: file aligned to its own audio)
const seen=new Set(); const kept=[];
let removed=0;
for(const t of pl.tracks){ if(seen.has(t.name)){removed++;continue;} seen.add(t.name); kept.push(t); }
pl.tracks=kept;
fs.writeFileSync(P, JSON.stringify(pl,null,2)+"\n");
console.log("kept",kept.length,"removed",removed);
// 2) fix exact-equal consecutive timestamps in kept lyric files (a line at same time as prev is never shown)
const re=/^\[(\d{1,2}):(\d{2})(?:\.(\d{1,3}))?\]/;
const fmt=t=>{const mm=Math.floor(t/60),ss=t-mm*60;return `[${String(mm).padStart(2,"0")}:${ss.toFixed(2).padStart(5,"0")}]`;};
let fixedFiles=0;
const files=[...new Set(kept.map(t=>t.lyrics.split("/").pop()))];
for(const f of files){
  const p=MUSIC+f; const lines=fs.readFileSync(p,"utf8").split("\n");
  const idxs=[],times=[];
  lines.forEach((l,i)=>{const m=l.match(re);if(m){idxs.push(i);times.push(+m[1]*60+ +m[2]+(m[3]?+("0."+m[3]):0));}});
  let changed=false;
  for(let k=1;k<times.length;k++){
    if(times[k]-times[k-1] < 0.05){ // collapsed/too-close: spread toward next distinct time
      // find next distinct strictly-greater time
      let j=k; while(j<times.length && times[j]-times[k-1]<0.05) j++;
      const lo=times[k-1]; const hi=(j<times.length)?times[j]:lo+ (times.length-k)*1.5 + 1.5;
      const n=j-(k-1); // count incl lo line
      for(let m=1;m<n;m++){ times[k-1+m]=lo+(hi-lo)*m/n; }
      changed=true; k=j-1;
    }
  }
  if(changed){ for(let a=0;a<idxs.length;a++){ lines[idxs[a]]=lines[idxs[a]].replace(re,fmt(times[a])); } fs.writeFileSync(p,lines.join("\n")); fixedFiles++; }
}
console.log("timestamp-spaced files:",fixedFiles);
