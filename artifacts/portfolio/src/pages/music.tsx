import BasePage from '../components/BasePage';

const HTML = `
<div class="bg-gradient" data-astro-cid-klhljcvd>
</div>
<nav class="top-nav" data-astro-cid-klhljcvd>
<div class="nav-logo" data-astro-cid-klhljcvd>
<svg viewBox="0 0 24 24" fill="currentColor" data-astro-cid-klhljcvd>
<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" data-astro-cid-klhljcvd>
</path>
</svg>
Music
</div>
<div class="nav-search" data-astro-cid-klhljcvd>
<span class="nav-search-icon" data-astro-cid-klhljcvd>
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" data-astro-cid-klhljcvd>
<circle cx="11" cy="11" r="8" data-astro-cid-klhljcvd>
</circle>
<line x1="21" y1="21" x2="16.65" y2="16.65" data-astro-cid-klhljcvd>
</line>
</svg>
</span>
<input type="text" id="track-search" class="nav-search-box" placeholder="搜尋歌曲、藝人或專輯..." data-astro-cid-klhljcvd>
</div>
<div class="stats-row" data-astro-cid-klhljcvd>
<span class="stats-badge" id="stats-total" data-astro-cid-klhljcvd>
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" data-astro-cid-klhljcvd>
<path d="M9 18V5l12-2v13" data-astro-cid-klhljcvd>
</path>
<circle cx="6" cy="18" r="3" data-astro-cid-klhljcvd>
</circle>
<circle cx="18" cy="16" r="3" data-astro-cid-klhljcvd>
</circle>
</svg>
<span id="total-tracks" data-astro-cid-klhljcvd>0</span> 首歌
</span>
<span class="stats-badge" id="stats-liked" data-astro-cid-klhljcvd>
<svg viewBox="0 0 24 24" fill="currentColor" stroke="none" data-astro-cid-klhljcvd>
<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" data-astro-cid-klhljcvd>
</path>
</svg>
<span id="liked-count" data-astro-cid-klhljcvd>0</span> 喜歡
</span>
</div>
<div class="nav-actions" data-astro-cid-klhljcvd>
<button class="nav-btn nav-btn-outline" id="ai-analyze-btn" data-astro-cid-klhljcvd>🤖 AI 分析</button>
<button class="nav-btn nav-btn-primary" data-astro-cid-klhljcvd>登入</button>
</div>
</nav>
<section class="main-content" data-astro-cid-klhljcvd>
<div class="music-grid" data-astro-cid-klhljcvd>
<div data-astro-cid-klhljcvd>
<div class="hero-banner" data-astro-cid-klhljcvd>
<div class="hero-content" data-astro-cid-klhljcvd>
<span class="hero-tag" data-astro-cid-klhljcvd>線上音樂</span>
<h1 class="hero-title" data-astro-cid-klhljcvd>探索音樂世界</h1>
<p class="hero-subtitle" data-astro-cid-klhljcvd>盡情播放、分享你喜愛的音樂</p>
</div>
<div class="hero-waveform" data-astro-cid-klhljcvd>
<div class="hero-wave-bar" data-astro-cid-klhljcvd>
</div>
<div class="hero-wave-bar" data-astro-cid-klhljcvd>
</div>
<div class="hero-wave-bar" data-astro-cid-klhljcvd>
</div>
<div class="hero-wave-bar" data-astro-cid-klhljcvd>
</div>
<div class="hero-wave-bar" data-astro-cid-klhljcvd>
</div>
<div class="hero-wave-bar" data-astro-cid-klhljcvd>
</div>
<div class="hero-wave-bar" data-astro-cid-klhljcvd>
</div>
<div class="hero-wave-bar" data-astro-cid-klhljcvd>
</div>
<div class="hero-wave-bar" data-astro-cid-klhljcvd>
</div>
<div class="hero-wave-bar" data-astro-cid-klhljcvd>
</div>
<div class="hero-wave-bar" data-astro-cid-klhljcvd>
</div>
<div class="hero-wave-bar" data-astro-cid-klhljcvd>
</div>
</div>
</div>
<div class="filter-row" data-astro-cid-klhljcvd>
<select id="lang-filter" data-astro-cid-klhljcvd>
<option value="all" data-astro-cid-klhljcvd>🌐 全部語言</option>
<option value="TW" data-astro-cid-klhljcvd>🇹🇼 台灣</option>
<option value="EN" data-astro-cid-klhljcvd>🇺🇸 英文</option>
<option value="JP" data-astro-cid-klhljcvd>🇯🇵 日文</option>
<option value="KR" data-astro-cid-klhljcvd>🇰🇷 韓文</option>
</select>
<select id="style-filter" data-astro-cid-klhljcvd>
<option value="all" data-astro-cid-klhljcvd>🎵 全部曲風</option>
<option value="流行" data-astro-cid-klhljcvd>流行</option>
<option value="抒情" data-astro-cid-klhljcvd>抒情</option>
<option value="嘻哈" data-astro-cid-klhljcvd>嘻哈</option>
<option value="搖滾" data-astro-cid-klhljcvd>搖滾</option>
<option value="Lo-fi" data-astro-cid-klhljcvd>Lo-fi</option>
<option value="電子" data-astro-cid-klhljcvd>電子</option>
<option value="R&B" data-astro-cid-klhljcvd>R&B</option>
</select>
<select id="gender-filter" data-astro-cid-klhljcvd>
<option value="all" data-astro-cid-klhljcvd>👤 全部歌手</option>
<option value="M" data-astro-cid-klhljcvd>♂ 男歌手</option>
<option value="F" data-astro-cid-klhljcvd>♀ 女歌手</option>
</select>
</div>
<div class="track-list-container" data-astro-cid-klhljcvd>
<div class="track-list-header" data-astro-cid-klhljcvd>
<span data-astro-cid-klhljcvd>🎵</span>
<span data-astro-cid-klhljcvd>標題</span>
<span data-astro-cid-klhljcvd>🎤 歌手</span>
<span data-astro-cid-klhljcvd>💿 專輯</span>
<span data-astro-cid-klhljcvd>⏱ 時長</span>
<span data-astro-cid-klhljcvd>操作</span>
</div>
<div class="track-scroll" data-astro-cid-klhljcvd>
<div id="track-list" data-astro-cid-klhljcvd>
<p style="color: var(--text-tertiary); text-align: center; padding: 50px;" data-astro-cid-klhljcvd>載入中...</p>
</div>
</div>
</div>
</div>
<div class="lyrics-panel" data-astro-cid-klhljcvd>
<button class="mobile-lyrics-close" id="mobile-lyrics-close" data-astro-cid-klhljcvd>✕ 關閉</button>
<div class="lyrics-header" data-astro-cid-klhljcvd>
<div class="lyrics-title" data-astro-cid-klhljcvd>
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" data-astro-cid-klhljcvd>
<path d="M9 18V5l12-2v13" data-astro-cid-klhljcvd>
</path>
<circle cx="6" cy="18" r="3" data-astro-cid-klhljcvd>
</circle>
<circle cx="18" cy="16" r="3" data-astro-cid-klhljcvd>
</circle>
</svg>
歌詞
</div>
<span class="lyrics-badge" id="lyrics-count" data-astro-cid-klhljcvd>0 句</span>
</div>
<!-- 歌詞偏移控制 UI -->
<div class="lyrics-offset-controls" data-astro-cid-klhljcvd>
<button class="lyrics-offset-btn" id="lyrics-offset-minus" title="歌詞提前 0.5s" data-astro-cid-klhljcvd>−</button>
<span class="lyrics-offset-value" id="lyrics-offset-value" data-astro-cid-klhljcvd>0s</span>
<button class="lyrics-offset-btn" id="lyrics-offset-plus" title="歌詞延後 0.5s" data-astro-cid-klhljcvd>+</button>
<button class="lyrics-offset-btn" id="lyrics-offset-reset" title="重置偏移" style="font-size: 0.7rem;" data-astro-cid-klhljcvd>↺</button>
</div>
<div class="lyrics-translate-toggle" data-astro-cid-klhljcvd>
<button class="translate-tab active" data-mode="original" data-astro-cid-klhljcvd>原文</button>
<button class="translate-tab" data-mode="roman" data-astro-cid-klhljcvd>羅馬拼音</button>
</div>
<div class="lyrics-container" id="lyrics-container" data-astro-cid-klhljcvd>
<p style="color: var(--text-tertiary); text-align: center; padding: 50px;" data-astro-cid-klhljcvd>選擇歌曲以顯示歌詞<br data-astro-cid-klhljcvd>
<span style="font-size: 0.75rem;" data-astro-cid-klhljcvd>按 J/K 鍵調整歌詞時間偏移</span>
</p>
</div>
</div>
</div>
</section>
<button class="mobile-lyrics-toggle" id="mobile-lyrics-toggle" data-astro-cid-klhljcvd>
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" data-astro-cid-klhljcvd>
<path d="M9 18V5l12-2v13" data-astro-cid-klhljcvd>
</path>
<circle cx="6" cy="18" r="3" data-astro-cid-klhljcvd>
</circle>
<circle cx="18" cy="16" r="3" data-astro-cid-klhljcvd>
</circle>
</svg>
</button>
<div class="ai-modal" id="ai-modal" data-astro-cid-klhljcvd>
<div class="ai-modal-content" data-astro-cid-klhljcvd>
<button class="ai-modal-close" id="ai-modal-close" data-astro-cid-klhljcvd>✕</button>
<div class="ai-modal-header" data-astro-cid-klhljcvd>
<h2 data-astro-cid-klhljcvd>🤖 AI 音樂分析</h2>
<p data-astro-cid-klhljcvd>上傳音頻檔案或輸入歌曲名稱，讓 AI 幫你分析歌詞和歌手性別</p>
</div>
<div class="ai-tabs" data-astro-cid-klhljcvd>
<button class="ai-tab active" data-tab="upload" data-astro-cid-klhljcvd>📤 上傳音頻</button>
<button class="ai-tab" data-tab="text" data-astro-cid-klhljcvd>✏️ 輸入名稱</button>
</div>
<!-- 上傳音頻 Tab -->
<div class="ai-tab-content active" id="ai-upload-tab" data-astro-cid-klhljcvd>
<div class="ai-dropzone" id="ai-dropzone" data-astro-cid-klhljcvd>
<div class="ai-dropzone-icon" data-astro-cid-klhljcvd>🎵</div>
<p class="ai-dropzone-text" data-astro-cid-klhljcvd>拖放音頻檔案到此處</p>
<p class="ai-dropzone-subtext" data-astro-cid-klhljcvd>或點擊選擇檔案 (MP3, WAV, OGG, M4A)</p>
<input type="file" id="ai-file-input" accept="audio/*" hidden data-astro-cid-klhljcvd>
</div>
<div class="ai-file-preview" id="ai-file-preview" style="display: none;" data-astro-cid-klhljcvd>
<span class="ai-file-name" id="ai-file-name" data-astro-cid-klhljcvd>
</span>
<button class="ai-remove-file" id="ai-remove-file" data-astro-cid-klhljcvd>✕</button>
</div>
<button class="ai-analyze-btn" id="ai-analyze-upload-btn" disabled data-astro-cid-klhljcvd>
<span class="ai-btn-text" data-astro-cid-klhljcvd>🔍 開始分析</span>
<span class="ai-btn-loading" style="display: none;" data-astro-cid-klhljcvd>分析中...</span>
</button>
</div>
<!-- 輸入名稱 Tab -->
<div class="ai-tab-content" id="ai-text-tab" data-astro-cid-klhljcvd>
<div class="ai-form-group" data-astro-cid-klhljcvd>
<label for="ai-song-name" data-astro-cid-klhljcvd>歌曲名稱</label>
<input type="text" id="ai-song-name" placeholder="例如：不服輸、城市裡的我們、Late Night City" data-astro-cid-klhljcvd>
</div>
<div class="ai-form-group" data-astro-cid-klhljcvd>
<label for="ai-artist" data-astro-cid-klhljcvd>歌手名稱（可選）</label>
<input type="text" id="ai-artist" placeholder="例如：TW男歌手、EN女歌手" data-astro-cid-klhljcvd>
</div>
<button class="ai-analyze-btn" id="ai-analyze-text-btn" data-astro-cid-klhljcvd>
<span class="ai-btn-text" data-astro-cid-klhljcvd>🔍 開始分析</span>
<span class="ai-btn-loading" style="display: none;" data-astro-cid-klhljcvd>分析中...</span>
</button>
</div>
<!-- 分析結果 -->
<div class="ai-result" id="ai-result" style="display: none;" data-astro-cid-klhljcvd>
<h3 data-astro-cid-klhljcvd>📊 分析結果</h3>
<div class="ai-result-grid" data-astro-cid-klhljcvd>
<div class="ai-result-item" data-astro-cid-klhljcvd>
<span class="ai-result-label" data-astro-cid-klhljcvd>🎤 歌手性別</span>
<span class="ai-result-value" id="ai-result-gender" data-astro-cid-klhljcvd>--</span>
</div>
<div class="ai-result-item" data-astro-cid-klhljcvd>
<span class="ai-result-label" data-astro-cid-klhljcvd>🌐 語言</span>
<span class="ai-result-value" id="ai-result-language" data-astro-cid-klhljcvd>--</span>
</div>
<div class="ai-result-item" data-astro-cid-klhljcvd>
<span class="ai-result-label" data-astro-cid-klhljcvd>🎵 曲風</span>
<span class="ai-result-value" id="ai-result-style" data-astro-cid-klhljcvd>--</span>
</div>
<div class="ai-result-item" data-astro-cid-klhljcvd>
<span class="ai-result-label" data-astro-cid-klhljcvd>📈 置信度</span>
<span class="ai-result-value" id="ai-result-confidence" data-astro-cid-klhljcvd>--</span>
</div>
</div>
<div class="ai-lyrics-section" data-astro-cid-klhljcvd>
<h4 data-astro-cid-klhljcvd>📝 歌詞內容</h4>
<pre class="ai-lyrics-content" id="ai-lyrics-content" data-astro-cid-klhljcvd>
</pre>
</div>
<button class="ai-apply-btn" id="ai-apply-btn" data-astro-cid-klhljcvd>✅ 套用到歌曲</button>
</div>
</div>
</div>
<div class="bottom-bar" data-astro-cid-klhljcvd>
<div class="bar-left" data-astro-cid-klhljcvd>
<div class="bar-album" id="bar-album" title="點擊展開播放器" data-astro-cid-klhljcvd>
<img id="album-img" src="" alt="" style="display: none;" data-astro-cid-klhljcvd>
<svg id="album-fallback" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" data-astro-cid-klhljcvd>
<circle cx="12" cy="12" r="10" data-astro-cid-klhljcvd>
</circle>
<path d="M9 18V5l12-2v13" data-astro-cid-klhljcvd>
</path>
<circle cx="6" cy="18" r="3" data-astro-cid-klhljcvd>
</circle>
<circle cx="18" cy="16" r="3" data-astro-cid-klhljcvd>
</circle>
</svg>
</div>
<div class="bar-track-info" data-astro-cid-klhljcvd>
<p class="bar-track-name" id="bar-track-name" data-astro-cid-klhljcvd>未播放</p>
<p class="bar-track-artist" id="bar-track-artist" data-astro-cid-klhljcvd>--</p>
</div>
<button class="bar-like-btn" id="bar-like-btn" title="喜歡" data-astro-cid-klhljcvd>
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" data-astro-cid-klhljcvd>
<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" data-astro-cid-klhljcvd>
</path>
</svg>
</button>
<button class="bar-icon-btn" id="bar-share-btn" title="分享" data-astro-cid-klhljcvd>
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" data-astro-cid-klhljcvd>
<circle cx="18" cy="5" r="3" data-astro-cid-klhljcvd>
</circle>
<circle cx="6" cy="12" r="3" data-astro-cid-klhljcvd>
</circle>
<circle cx="18" cy="19" r="3" data-astro-cid-klhljcvd>
</circle>
<line x1="8.59" y1="13.51" x2="15.42" y2="17.49" data-astro-cid-klhljcvd>
</line>
<line x1="15.41" y1="6.51" x2="8.59" y2="10.49" data-astro-cid-klhljcvd>
</line>
</svg>
</button>
</div>
<div class="bar-center" data-astro-cid-klhljcvd>
<div class="bar-controls" data-astro-cid-klhljcvd>
<button class="bar-ctrl-btn mode-btn" id="bar-mode" title="播放模式" data-astro-cid-klhljcvd>
<svg id="mode-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" data-astro-cid-klhljcvd>
<polyline points="23 4 23 10 17 10" data-astro-cid-klhljcvd>
</polyline>
<polyline points="1 20 1 14 7 14" data-astro-cid-klhljcvd>
</polyline>
<path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" data-astro-cid-klhljcvd>
</path>
</svg>
<div class="mode-dropdown" data-astro-cid-klhljcvd>
<div class="mode-option active" data-mode="sequence" data-astro-cid-klhljcvd>
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" data-astro-cid-klhljcvd>
<line x1="8" y1="6" x2="21" y2="6" data-astro-cid-klhljcvd>
</line>
<line x1="8" y1="12" x2="21" y2="12" data-astro-cid-klhljcvd>
</line>
<line x1="8" y1="18" x2="21" y2="18" data-astro-cid-klhljcvd>
</line>
<line x1="3" y1="6" x2="3.01" y2="6" data-astro-cid-klhljcvd>
</line>
<line x1="3" y1="12" x2="3.01" y2="12" data-astro-cid-klhljcvd>
</line>
<line x1="3" y1="18" x2="3.01" y2="18" data-astro-cid-klhljcvd>
</line>
</svg>
順序播放
</div>
<div class="mode-option" data-mode="shuffle" data-astro-cid-klhljcvd>
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" data-astro-cid-klhljcvd>
<polyline points="16 3 21 3 21 8" data-astro-cid-klhljcvd>
</polyline>
<line x1="4" y1="20" x2="21" y2="3" data-astro-cid-klhljcvd>
</line>
<polyline points="21 16 21 21 16 21" data-astro-cid-klhljcvd>
</polyline>
<line x1="15" y1="15" x2="21" y2="21" data-astro-cid-klhljcvd>
</line>
<line x1="4" y1="4" x2="9" y2="9" data-astro-cid-klhljcvd>
</line>
</svg>
隨機播放
</div>
<div class="mode-option" data-mode="repeat" data-astro-cid-klhljcvd>
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" data-astro-cid-klhljcvd>
<polyline points="17 1 21 5 17 9" data-astro-cid-klhljcvd>
</polyline>
<path d="M3 11V9a4 4 0 0 1 4-4h14" data-astro-cid-klhljcvd>
</path>
<polyline points="7 23 3 19 7 15" data-astro-cid-klhljcvd>
</polyline>
<path d="M21 13v2a4 4 0 0 1-4 4H3" data-astro-cid-klhljcvd>
</path>
</svg>
全部循環
</div>
<div class="mode-option" data-mode="repeat-one" data-astro-cid-klhljcvd>
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" data-astro-cid-klhljcvd>
<polyline points="17 1 21 5 17 9" data-astro-cid-klhljcvd>
</polyline>
<path d="M3 11V9a4 4 0 0 1 4-4h14" data-astro-cid-klhljcvd>
</path>
<polyline points="7 23 3 19 7 15" data-astro-cid-klhljcvd>
</polyline>
<path d="M21 13v2a4 4 0 0 1-4 4H3" data-astro-cid-klhljcvd>
</path>
<line x1="12" y1="8" x2="12" y2="16" data-astro-cid-klhljcvd>
</line>
<line x1="9" y1="12" x2="15" y2="12" data-astro-cid-klhljcvd>
</line>
</svg>
單曲循環
</div>
</div>
</button>
<button class="bar-ctrl-btn" id="bar-prev" title="上一首" data-astro-cid-klhljcvd>
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" data-astro-cid-klhljcvd>
<polygon points="19 20 9 12 19 4 19 20" data-astro-cid-klhljcvd>
</polygon>
<line x1="5" y1="19" x2="5" y2="5" data-astro-cid-klhljcvd>
</line>
</svg>
</button>
<button class="bar-play-btn" id="bar-play" title="播放" data-astro-cid-klhljcvd>
<svg id="play-icon" viewBox="0 0 24 24" fill="currentColor" stroke="none" data-astro-cid-klhljcvd>
<polygon points="5 3 19 12 5 21 5 3" data-astro-cid-klhljcvd>
</polygon>
</svg>
<svg id="pause-icon" viewBox="0 0 24 24" fill="currentColor" stroke="none" style="display:none" data-astro-cid-klhljcvd>
<rect x="6" y="4" width="4" height="16" data-astro-cid-klhljcvd>
</rect>
<rect x="14" y="4" width="4" height="16" data-astro-cid-klhljcvd>
</rect>
</svg>
</button>
<button class="bar-ctrl-btn" id="bar-next" title="下一首" data-astro-cid-klhljcvd>
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" data-astro-cid-klhljcvd>
<polygon points="5 4 15 12 5 20 5 4" data-astro-cid-klhljcvd>
</polygon>
<line x1="19" y1="5" x2="19" y2="19" data-astro-cid-klhljcvd>
</line>
</svg>
</button>
<button class="bar-ctrl-btn speed-btn" id="bar-speed" title="播放速度" data-astro-cid-klhljcvd>
<span id="speed-label" data-astro-cid-klhljcvd>1x</span>
<div class="speed-dropdown" data-astro-cid-klhljcvd>
<div class="speed-option" data-speed="0.5" data-astro-cid-klhljcvd>0.5x</div>
<div class="speed-option" data-speed="0.75" data-astro-cid-klhljcvd>0.75x</div>
<div class="speed-option active" data-speed="1" data-astro-cid-klhljcvd>1x</div>
<div class="speed-option" data-speed="1.25" data-astro-cid-klhljcvd>1.25x</div>
<div class="speed-option" data-speed="1.5" data-astro-cid-klhljcvd>1.5x</div>
<div class="speed-option" data-speed="2" data-astro-cid-klhljcvd>2x</div>
</div>
</button>
</div>
<div class="bar-progress" data-astro-cid-klhljcvd>
<span class="bar-time" id="bar-current-time" data-astro-cid-klhljcvd>0:00</span>
<input type="range" class="bar-progress-slider" id="bar-progress" min="0" max="100" value="0" style="--progress: 0%" data-astro-cid-klhljcvd>
<span class="bar-time" id="bar-duration" data-astro-cid-klhljcvd>0:00</span>
</div>
</div>
<div class="bar-right" data-astro-cid-klhljcvd>
<button class="shortcuts-btn" id="shortcuts-btn" title="快捷鍵" data-astro-cid-klhljcvd>?</button>
<button class="bar-icon-btn" id="bar-eq-btn" title="等化器" data-astro-cid-klhljcvd>
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" data-astro-cid-klhljcvd>
<line x1="4" y1="21" x2="4" y2="14" data-astro-cid-klhljcvd>
</line>
<line x1="4" y1="10" x2="4" y2="3" data-astro-cid-klhljcvd>
</line>
<line x1="12" y1="21" x2="12" y2="12" data-astro-cid-klhljcvd>
</line>
<line x1="12" y1="8" x2="12" y2="3" data-astro-cid-klhljcvd>
</line>
<line x1="20" y1="21" x2="20" y2="16" data-astro-cid-klhljcvd>
</line>
<line x1="20" y1="12" x2="20" y2="3" data-astro-cid-klhljcvd>
</line>
<line x1="1" y1="14" x2="7" y2="14" data-astro-cid-klhljcvd>
</line>
<line x1="9" y1="8" x2="15" y2="8" data-astro-cid-klhljcvd>
</line>
<line x1="17" y1="16" x2="23" y2="16" data-astro-cid-klhljcvd>
</line>
</svg>
</button>
<button class="bar-icon-btn" id="bar-vol-btn" title="靜音" data-astro-cid-klhljcvd>
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" id="vol-icon" data-astro-cid-klhljcvd>
<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" data-astro-cid-klhljcvd>
</polygon>
<path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" data-astro-cid-klhljcvd>
</path>
</svg>
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" id="vol-mute-icon" style="display:none" data-astro-cid-klhljcvd>
<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" data-astro-cid-klhljcvd>
</polygon>
<line x1="23" y1="9" x2="17" y2="15" data-astro-cid-klhljcvd>
</line>
<line x1="17" y1="9" x2="23" y2="15" data-astro-cid-klhljcvd>
</line>
</svg>
</button>
<input type="range" class="bar-volume-slider" id="bar-volume" min="0" max="100" value="80" data-astro-cid-klhljcvd>
</div>
</div>
<div class="eq-panel" id="eq-panel" data-astro-cid-klhljcvd>
<div class="eq-title" data-astro-cid-klhljcvd>
等化器
<button class="eq-close" id="eq-close" data-astro-cid-klhljcvd>✕</button>
</div>
<div class="eq-slider-row" data-astro-cid-klhljcvd>
<span class="eq-label" data-astro-cid-klhljcvd>低音</span>
<input type="range" class="eq-slider" id="eq-bass" min="-10" max="10" value="0" data-astro-cid-klhljcvd>
<span class="eq-value" id="eq-bass-val" data-astro-cid-klhljcvd>0</span>
</div>
<div class="eq-slider-row" data-astro-cid-klhljcvd>
<span class="eq-label" data-astro-cid-klhljcvd>中音</span>
<input type="range" class="eq-slider" id="eq-mid" min="-10" max="10" value="0" data-astro-cid-klhljcvd>
<span class="eq-value" id="eq-mid-val" data-astro-cid-klhljcvd>0</span>
</div>
<div class="eq-slider-row" data-astro-cid-klhljcvd>
<span class="eq-label" data-astro-cid-klhljcvd>高音</span>
<input type="range" class="eq-slider" id="eq-treble" min="-10" max="10" value="0" data-astro-cid-klhljcvd>
<span class="eq-value" id="eq-treble-val" data-astro-cid-klhljcvd>0</span>
</div>
<div class="eq-slider-row" data-astro-cid-klhljcvd>
<span class="eq-label" data-astro-cid-klhljcvd>音量</span>
<input type="range" class="eq-slider" id="eq-gain" min="-10" max="10" value="0" data-astro-cid-klhljcvd>
<span class="eq-value" id="eq-gain-val" data-astro-cid-klhljcvd>0</span>
</div>
</div>
<div class="shortcuts-overlay" id="shortcuts-overlay" data-astro-cid-klhljcvd>
</div>
<div class="shortcuts-panel" id="shortcuts-panel" data-astro-cid-klhljcvd>
<button class="close-shortcuts" id="close-shortcuts" data-astro-cid-klhljcvd>✕</button>
<div class="shortcuts-title" data-astro-cid-klhljcvd>⌨️ 快捷鍵</div>
<div class="shortcuts-grid" data-astro-cid-klhljcvd>
<div class="shortcut-item" data-astro-cid-klhljcvd>
<span class="shortcut-key" data-astro-cid-klhljcvd>Space</span>
<span class="shortcut-desc" data-astro-cid-klhljcvd>播放/暫停</span>
</div>
<div class="shortcut-item" data-astro-cid-klhljcvd>
<span class="shortcut-key" data-astro-cid-klhljcvd>←</span>
<span class="shortcut-desc" data-astro-cid-klhljcvd>倒回 10 秒</span>
</div>
<div class="shortcut-item" data-astro-cid-klhljcvd>
<span class="shortcut-key" data-astro-cid-klhljcvd>→</span>
<span class="shortcut-desc" data-astro-cid-klhljcvd>快轉 10 秒</span>
</div>
<div class="shortcut-item" data-astro-cid-klhljcvd>
<span class="shortcut-key" data-astro-cid-klhljcvd>↑</span>
<span class="shortcut-desc" data-astro-cid-klhljcvd>音量 +10</span>
</div>
<div class="shortcut-item" data-astro-cid-klhljcvd>
<span class="shortcut-key" data-astro-cid-klhljcvd>↓</span>
<span class="shortcut-desc" data-astro-cid-klhljcvd>音量 -10</span>
</div>
<div class="shortcut-item" data-astro-cid-klhljcvd>
<span class="shortcut-key" data-astro-cid-klhljcvd>M</span>
<span class="shortcut-desc" data-astro-cid-klhljcvd>靜音切換</span>
</div>
<div class="shortcut-item" data-astro-cid-klhljcvd>
<span class="shortcut-key" data-astro-cid-klhljcvd>S</span>
<span class="shortcut-desc" data-astro-cid-klhljcvd>隨機播放</span>
</div>
<div class="shortcut-item" data-astro-cid-klhljcvd>
<span class="shortcut-key" data-astro-cid-klhljcvd>L</span>
<span class="shortcut-desc" data-astro-cid-klhljcvd>喜歡/取消</span>
</div>
<div class="shortcut-item" data-astro-cid-klhljcvd>
<span class="shortcut-key" data-astro-cid-klhljcvd>J</span>
<span class="shortcut-desc" data-astro-cid-klhljcvd>歌詞提前 0.5s</span>
</div>
<div class="shortcut-item" data-astro-cid-klhljcvd>
<span class="shortcut-key" data-astro-cid-klhljcvd>K</span>
<span class="shortcut-desc" data-astro-cid-klhljcvd>歌詞延後 0.5s</span>
</div>
</div>
</div>
<div class="player-modal" id="player-modal" data-astro-cid-klhljcvd>
<div class="player-modal-content" data-astro-cid-klhljcvd>
<button class="close-modal-btn" id="close-modal-btn" data-astro-cid-klhljcvd>✕</button>
<div class="player-modal-album" id="modal-album" data-astro-cid-klhljcvd>
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" data-astro-cid-klhljcvd>
<circle cx="12" cy="12" r="10" data-astro-cid-klhljcvd>
</circle>
<path d="M9 18V5l12-2v13" data-astro-cid-klhljcvd>
</path>
<circle cx="6" cy="18" r="3" data-astro-cid-klhljcvd>
</circle>
<circle cx="18" cy="16" r="3" data-astro-cid-klhljcvd>
</circle>
</svg>
</div>
<h2 class="player-modal-title" id="modal-title" data-astro-cid-klhljcvd>未播放</h2>
<p class="player-modal-artist" id="modal-artist" data-astro-cid-klhljcvd>--</p>
<div class="player-modal-controls" data-astro-cid-klhljcvd>
<button class="bar-ctrl-btn" id="modal-prev" title="上一首" data-astro-cid-klhljcvd>
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" data-astro-cid-klhljcvd>
<polygon points="19 20 9 12 19 4 19 20" data-astro-cid-klhljcvd>
</polygon>
<line x1="5" y1="19" x2="5" y2="5" data-astro-cid-klhljcvd>
</line>
</svg>
</button>
<button class="bar-play-btn" id="modal-play" data-astro-cid-klhljcvd>
<svg id="modal-play-icon" viewBox="0 0 24 24" fill="currentColor" stroke="none" data-astro-cid-klhljcvd>
<polygon points="5 3 19 12 5 21 5 3" data-astro-cid-klhljcvd>
</polygon>
</svg>
<svg id="modal-pause-icon" viewBox="0 0 24 24" fill="currentColor" stroke="none" style="display:none" data-astro-cid-klhljcvd>
<rect x="6" y="4" width="4" height="16" data-astro-cid-klhljcvd>
</rect>
<rect x="14" y="4" width="4" height="16" data-astro-cid-klhljcvd>
</rect>
</svg>
</button>
<button class="bar-ctrl-btn" id="modal-next" title="下一首" data-astro-cid-klhljcvd>
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" data-astro-cid-klhljcvd>
<polygon points="5 4 15 12 5 20 5 4" data-astro-cid-klhljcvd>
</polygon>
<line x1="19" y1="5" x2="19" y2="19" data-astro-cid-klhljcvd>
</line>
</svg>
</button>
</div>
<div class="player-modal-progress" data-astro-cid-klhljcvd>
<span class="bar-time" id="modal-current-time" data-astro-cid-klhljcvd>0:00</span>
<input type="range" class="bar-progress-slider" id="modal-progress" min="0" max="100" value="0" style="--progress: 0%" data-astro-cid-klhljcvd>
<span class="bar-time" id="modal-duration" data-astro-cid-klhljcvd>0:00</span>
</div>
</div>
</div>
<div id="toast-container" data-astro-cid-klhljcvd>
</div>
`;

export default function MusicPage() {
  return (
    <BasePage
      title='🎵 線上音樂 - donttalk'
      bodyPage='music'
      pageStyles={['/styles/music.css', '/styles/music-scoped.css']}
      pageScripts={[
        '/scripts/app-config.js',
        '/scripts/theme-randomizer.js',
        '/scripts/shader-bg.js',
        '/scripts/theme-toggle.js',
        '/scripts/music-player.js',
        '/scripts/music-ai-analysis.js',
      ]}
      html={HTML}
    />
  );
}
