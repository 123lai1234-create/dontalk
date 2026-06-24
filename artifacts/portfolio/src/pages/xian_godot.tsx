import { useEffect } from 'react';

const HTML = `
  <div class="game-shell">
    <div class="game-frame-wrap">
      <iframe
        id="game-frame"
        src="/games/xian-godot/"
        title="仙境傳說"
        allowfullscreen
        loading="lazy"
      ></iframe>
      <div class="overlay" id="overlay">
        <button id="play-btn" aria-label="開始遊戲">▶ 點擊開始</button>
      </div>
    </div>
    <div class="controls">
      <span>↑↓←→ 移動</span>
      <span>Z / Enter 確認</span>
      <span>X / Esc 取消・選單</span>
      <button id="fs-btn" title="全螢幕">⛶</button>
    </div>
  </div>
`;

const STYLES = `
  :root { --game-w: 480px; --game-h: 854px; }
  .game-shell {
    display: flex; flex-direction: column; align-items: center;
    justify-content: center; min-height: 100dvh; background: #0c0418;
    gap: 0.6rem; padding: 1rem;
  }
  .game-frame-wrap {
    position: relative; width: min(var(--game-w), 100vw);
    aspect-ratio: 480 / 854; border: 1px solid #7a5c1e88;
    border-radius: 6px; overflow: hidden; background: #000;
    box-shadow: 0 0 40px #7a5c1e22;
  }
  iframe { width: 100%; height: 100%; border: none; display: block; }
  .overlay {
    position: absolute; inset: 0; display: flex; align-items: center;
    justify-content: center; background: #0c041899; backdrop-filter: blur(2px);
    transition: opacity 0.3s;
  }
  .overlay.hidden { opacity: 0; pointer-events: none; }
  #play-btn {
    padding: 0.7rem 2rem; font-size: 1.1rem;
    background: #7a5c1e; color: #ffd700; border: none;
    border-radius: 8px; cursor: pointer; font-weight: 600;
  }
  .controls {
    display: flex; gap: 1.2rem; font-size: 0.82rem; color: #b8a060;
    flex-wrap: wrap; justify-content: center;
  }
  #fs-btn {
    background: none; border: 1px solid #7a5c1e88; color: #b8a060;
    border-radius: 4px; padding: 2px 8px; cursor: pointer;
  }
`;

export default function XianGodotPage() {
  useEffect(() => {
    document.title = '仙境傳說 — 仙俠 RPG';
    document.body.dataset.page = 'game';

    const styleEl = document.createElement('style');
    styleEl.textContent = STYLES;
    document.head.appendChild(styleEl);

    const overlay = document.getElementById('overlay');
    const playBtn = document.getElementById('play-btn');
    const fsBtn = document.getElementById('fs-btn');
    const frame = document.getElementById('game-frame') as HTMLIFrameElement;

    if (playBtn && overlay) {
      playBtn.addEventListener('click', () => {
        overlay.classList.add('hidden');
        if (frame) frame.focus();
      });
    }
    if (fsBtn && frame) {
      fsBtn.addEventListener('click', () => frame.requestFullscreen?.());
    }

    return () => {
      styleEl.remove();
    };
  }, []);

  return <div dangerouslySetInnerHTML={{ __html: HTML }} />;
}
