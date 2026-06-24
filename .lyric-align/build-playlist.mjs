import fs from "fs";
const P="artifacts/portfolio/public/music/playlist.json";
const matches=JSON.parse(fs.readFileSync(".lyric-align/matches.json","utf8"));
const pl=JSON.parse(fs.readFileSync(P,"utf8"));
const byIdx=new Map(matches.map(m=>[m.idx,m]));
let changed=0;
pl.tracks=pl.tracks.map((t,i)=>{
  const idx=i+1;
  let newLyrics, newName;
  if(idx===12){ // track_013 我一個人也很好 (no existing file)
    newLyrics="lyrics_066.txt"; newName="我一個人也很好";
  } else {
    const m=byIdx.get(idx);
    newLyrics=m.newLyrics;
    newName=(m.newTitle||"").split(" / ")[0].trim();
  }
  const oldLy=t.lyrics.split("/").pop();
  if(oldLy!==newLyrics||t.name!==newName) changed++;
  return {...t, name:newName, lyrics:"/music/"+newLyrics};
});
fs.writeFileSync(P, JSON.stringify(pl,null,2)+"\n");
console.log("tracks:",pl.tracks.length,"changed:",changed);
// list distinct lyric files now referenced + check duplicates
const used=pl.tracks.map(t=>t.lyrics.split("/").pop());
const cnt={}; used.forEach(u=>cnt[u]=(cnt[u]||0)+1);
const dups=Object.entries(cnt).filter(([,c])=>c>1);
console.log("files used >1x:", dups.map(([f,c])=>`${f}:${c}`).join(", ")||"none");
