import fs from "fs";
function fix(file){
  const p="artifacts/portfolio/public/music/"+file;
  const lines=fs.readFileSync(p,"utf8").split("\n");
  const re=/^\[(\d{1,2}):(\d{2})(?:\.(\d{1,3}))?\]/;
  const idxs=[]; const times=[];
  lines.forEach((l,i)=>{const m=l.match(re); if(m){idxs.push(i); times.push(+m[1]*60+ +m[2]+ (m[3]?+("0."+m[3]):0));}});
  // find trailing run of identical max-time
  const last=times.length-1; const end=times[last];
  let start=last; while(start>0 && Math.abs(times[start-1]-end)<0.01) start--;
  if(start===last){console.log(file,"no collapse");return;}
  const prev=times[start-1];
  const n=last-start+1; // collapsed count incl the run
  // distribute n lines evenly in (prev, end], last stays at end
  const newTimes=[];
  for(let k=0;k<n;k++){ const t=prev+(end-prev)*(k+1)/n; newTimes.push(t); }
  for(let k=0;k<n;k++){
    const i=idxs[start+k]; const t=newTimes[k];
    const mm=Math.floor(t/60), ss=(t-mm*60);
    const stamp=`[${String(mm).padStart(2,"0")}:${ss.toFixed(2).padStart(5,"0")}]`;
    lines[i]=lines[i].replace(re,stamp);
  }
  fs.writeFileSync(p,lines.join("\n"));
  console.log(file,"fixed",n,"lines from",prev.toFixed(1),"to",end.toFixed(1));
}
fix("lyrics_014.txt"); fix("lyrics_051.txt");
