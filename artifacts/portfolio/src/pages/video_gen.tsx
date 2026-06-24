import { useEffect } from 'react';
import BasePage from '../components/BasePage';

const HTML = `\r
    <!-- 背景影片 -->\r
    <div class="video-bg-wrapper">\r
        <video id="bgVideo" autoplay muted loop playsinline>\r
            <source src="/waiting-bg.mp4" type="video/mp4">\r
        </video>\r
        <div class="video-bg-overlay"></div>\r
    </div>\r
    <div data-site-nav></div>\r
    <header class="hero">\r
        <div class="eyebrow"><span class="live-dot"></span>AI Video Generation &middot; Seedance 2.0 &middot; fal.ai\r
            Proxy</div>\r
        <h1>文字生成影片<br><span>Seedance 2.0 via FastAPI</span></h1>\r
        <p class="hero-sub">輸入 prompt，FastAPI（Railway）作為安全代理送到 fal.ai，非同步輪詢完成後直接播放。API key 全程藏後端。</p>\r
        <div class="hero-stats">\r
            <div class="hero-stat">\r
                <div class="value">Seedance 2.0</div>\r
                <div class="label">ByteDance &middot; fal.ai queue</div>\r
            </div>\r
            <div class="hero-stat">\r
                <div class="value">Async Poll</div>\r
                <div class="label">submit &rarr; 5s poll &rarr; 播放</div>\r
            </div>\r
            <div class="hero-stat">\r
                <div class="value">Rate Limited</div>\r
                <div class="label">3 次 / IP / 天</div>\r
            </div>\r
        </div>\r
    </header>\r
    <main class="container">\r
        <div class="video-grid">\r
            <aside class="panel">\r
                <div class="panel-title">影片設定</div>\r
                <div class="panel-sub">填入 prompt 後按生成影片，等待約 30-120 秒。</div>\r
                <div class="field">\r
                    <label for="videoPrompt">Prompt（英文效果最佳）</label>\r
                    <textarea id="videoPrompt" rows="5"\r
                        placeholder="A glowing DNA helix rotating in space, cinematic..."></textarea>\r
                    <div class="field-hint">3-500 字元，建議英文</div>\r
                </div>\r
                <div class="field">\r
                    <label for="videoResolution">解析度</label>\r
                    <select id="videoResolution">\r
                        <option value="480p">480p（快速測試）</option>\r
                        <option value="720p" selected>720p（建議）</option>\r
                        <option value="1080p">1080p（較慢）</option>\r
                    </select>\r
                </div>\r
                <div class="field">\r
                    <label for="videoDuration">時長（秒）</label>\r
                    <select id="videoDuration">\r
                        <option value="3">3 秒</option>\r
                        <option value="5" selected>5 秒</option>\r
                        <option value="8">8 秒</option>\r
                        <option value="10">10 秒</option>\r
                    </select>\r
                </div>\r
                <button id="videoGenBtn" class="btn btn-primary" type="button">\r
                    <span id="videoSpinner" hidden></span>生成影片\r
                </button>\r
                <div id="videoStatus" class="status-banner" data-state="info">尚未送出請求。</div>\r
                <div class="small-note">API: <span id="videoApiLabel" class="mono">detecting...</span></div>\r
                <div style="margin-top:24px">\r
                    <div class="panel-title" style="font-size:.82rem;margin-bottom:10px">範例 Prompts</div>\r
                    <div class="example-list">\r
                        <button class="example-btn" type="button"\r
                            data-example-prompt="A glowing DNA double helix rotating slowly in deep blue space, cinematic lighting">DNA\r
                            double helix rotating in space</button>\r
                        <button class="example-btn" type="button"\r
                            data-example-prompt="Timelapse of a protein folding from a disordered chain into a structured 3D form, bioluminescent glow">Protein\r
                            folding timelapse</button>\r
                        <button class="example-btn" type="button"\r
                            data-example-prompt="Aerial drone shot of Taiwan mountains at sunrise with golden rays, cinematic 4K">Taiwan\r
                            mountain sunrise aerial</button>\r
                        <button class="example-btn" type="button"\r
                            data-example-prompt="A futuristic biotech lab with holographic displays showing gene sequences, photorealistic">Futuristic\r
                            biotech lab</button>\r
                    </div>\r
                </div>\r
            </aside>\r
            <div class="panel">\r
                <div class="result-top">\r
                    <div>\r
                        <h3>影片輸出</h3>\r
                        <p>生成完成後可在此播放與下載。</p>\r
                    </div>\r
                    <div class="section-badge">Seedance 2.0 Output</div>\r
                </div>\r
                <div class="video-wrap">\r
                    <div id="videoPlaceholder" class="video-placeholder">\r
                        <div class="icon">&#127916;</div>\r
                        <p>送出 prompt 後，影片將在此處顯示。生成通常需要 30-120 秒。</p>\r
                    </div>\r
                    <video id="videoResult" controls hidden preload="metadata"></video>\r
                </div>\r
                <div class="arch-note">\r
                    <div class="arch-note-title">架構說明</div>\r
                    <div class="arch-flow">\r
                        <span class="arch-node">Astro (Vercel)</span>\r
                        <span class="arch-arrow">&rarr;</span>\r
                        <span class="arch-node">FastAPI (Railway)</span>\r
                        <span class="arch-arrow">&rarr;</span>\r
                        <span class="arch-node">fal.ai &rarr; Seedance 2.0</span>\r
                    </div>\r
                    <div style="margin-top:12px;font-size:.8rem;color:var(--dim)">FAL_KEY 僅存在 Railway 環境變數。</div>\r
                </div>\r
                <div class="faq-list">\r
                    <div class="faq-item">\r
                        <div class="faq-header"><span>為什麼要用 FastAPI 當 proxy？</span><span\r
                                class="faq-arrow">&#9660;</span></div>\r
                        <div class="faq-body" hidden>API key 放後端環境變數，前端只拿到 request_id 和影片 URL，避免 key 洩漏。</div>\r
                    </div>\r
                    <div class="faq-item">\r
                        <div class="faq-header"><span>為什麼不同步等待回應？</span><span class="faq-arrow">&#9660;</span></div>\r
                        <div class="faq-body" hidden>生成時間 30-120 秒，Railway HTTP timeout 遠小於此。非同步 submit/poll 避免 timeout。\r
                        </div>\r
                    </div>\r
                </div>\r
            </div>\r
        </div>\r
    </main>\r
    <section class="vg-detail-section">\r
        <div class="vg-detail-inner">\r
            <div class="vg-detail-head">\r
                <div class="eyebrow" style="font-size:.72rem;letter-spacing:.14em">架構深度說明</div>\r
                <h2>Submit / Poll 非同步設計</h2>\r
                <p class="vg-detail-sub">生成任務通常需要 30–120 秒，遠超 HTTP timeout。FastAPI 代理採 submit-then-poll\r
                    模式，讓前端持續輪詢而不阻塞連線。</p>\r
            </div>\r
\r
            <div class="vg-arch-timeline">\r
                <div class="vg-arch-step">\r
                    <div class="vg-arch-num">01</div>\r
                    <div>\r
                        <div class="vg-arch-title">前端送出 Prompt</div>\r
                        <div class="vg-arch-desc">使用者在頁面填入 prompt、選擇解析度與時長，前端 POST 到 Railway FastAPI（不含 API key）。</div>\r
                    </div>\r
                </div>\r
                <div class="vg-arch-step">\r
                    <div class="vg-arch-num">02</div>\r
                    <div>\r
                        <div class="vg-arch-title">FastAPI 驗證 + 限速</div>\r
                        <div class="vg-arch-desc">後端驗證 prompt 長度、IP 頻率限制（3 次/IP/天），通過後以 <code>FAL_KEY</code> 呼叫 fal.ai\r
                            submit endpoint。</div>\r
                    </div>\r
                </div>\r
                <div class="vg-arch-step">\r
                    <div class="vg-arch-num">03</div>\r
                    <div>\r
                        <div class="vg-arch-title">fal.ai 非同步排隊</div>\r
                        <div class="vg-arch-desc">fal.ai 接收請求後立即回傳 <code>request_id</code>，將任務排入 Seedance 2.0\r
                            推理佇列，FastAPI 回傳此 ID 給前端。</div>\r
                    </div>\r
                </div>\r
                <div class="vg-arch-step">\r
                    <div class="vg-arch-num">04</div>\r
                    <div>\r
                        <div class="vg-arch-title">前端輪詢狀態</div>\r
                        <div class="vg-arch-desc">前端每 5 秒以 <code>request_id</code> 查詢 FastAPI status endpoint，後端轉發至\r
                            fal.ai 取得 <code>IN_QUEUE / IN_PROGRESS / COMPLETED</code>。</div>\r
                    </div>\r
                </div>\r
                <div class="vg-arch-step">\r
                    <div class="vg-arch-num">05</div>\r
                    <div>\r
                        <div class="vg-arch-title">取得影片 URL 並播放</div>\r
                        <div class="vg-arch-desc">狀態為 <code>COMPLETED</code> 後，後端回傳 fal.ai CDN 影片 URL，前端直接以\r
                            <code>&lt;video&gt;</code> 播放，API key 全程不離開後端。\r
                        </div>\r
                    </div>\r
                </div>\r
            </div>\r
\r
            <div class="vg-highlight-grid">\r
                <div class="vg-highlight">\r
                    <div class="vg-highlight-icon">🎬</div>\r
                    <div class="vg-highlight-title">Seedance 2.0</div>\r
                    <div class="vg-highlight-desc">ByteDance 開源影片生成模型，支援 480p / 720p / 1080p 輸出</div>\r
                </div>\r
                <div class="vg-highlight">\r
                    <div class="vg-highlight-icon">🔐</div>\r
                    <div class="vg-highlight-title">Zero Key Exposure</div>\r
                    <div class="vg-highlight-desc">FAL_KEY 僅存在 Railway 環境變數，前端永不接觸 API 金鑰</div>\r
                </div>\r
                <div class="vg-highlight">\r
                    <div class="vg-highlight-icon">⚡</div>\r
                    <div class="vg-highlight-title">Async Poll</div>\r
                    <div class="vg-highlight-desc">Submit → 5s 輪詢 → 完成播放，避免 Railway HTTP timeout 問題</div>\r
                </div>\r
                <div class="vg-highlight">\r
                    <div class="vg-highlight-icon">🛡️</div>\r
                    <div class="vg-highlight-title">Rate Limited</div>\r
                    <div class="vg-highlight-desc">每 IP 每天限制 3 次請求，防止濫用與 API 配額耗盡</div>\r
                </div>\r
            </div>\r
\r
            <div class="vg-faq-grid" style="margin-top:32px">\r
                <div class="vg-faq-card">\r
                    <div class="vg-faq-q">為什麼要用 FastAPI 當 proxy？</div>\r
                    <div class="vg-faq-a">API key 放後端環境變數，前端只拿到 request_id 和影片 URL，避免 key 暴露在 JavaScript 原始碼中被爬取。</div>\r
                </div>\r
                <div class="vg-faq-card">\r
                    <div class="vg-faq-q">為什麼不同步等待回應？</div>\r
                    <div class="vg-faq-a">生成時間 30–120 秒，Railway 的 HTTP timeout 遠小於此。非同步 submit/poll 讓連線立即返回，前端自行追蹤進度。\r
                    </div>\r
                </div>\r
                <div class="vg-faq-card">\r
                    <div class="vg-faq-q">為什麼選 fal.ai？</div>\r
                    <div class="vg-faq-a">fal.ai 提供標準化的佇列 API（submit + status + result），免去自建 GPU 推理基礎設施，且支援 Seedance 2.0\r
                        等前沿模型。</div>\r
                </div>\r
                <div class="vg-faq-card">\r
                    <div class="vg-faq-q">影片生成有哪些限制？</div>\r
                    <div class="vg-faq-a">每 IP 每天 3 次，prompt 限 3–500 字元，建議英文。1080p 生成時間較長（可達 2 分鐘），且受 fal.ai 佇列負載影響。\r
                    </div>\r
                </div>\r
            </div>\r
        </div>\r
    </section>\r
\r
    <div data-site-footer></div>\r
    <script src="scripts/video_gen.js"></script>\r
    <button class="scroll-top" aria-label="返回頂部">&uarr;</button>\r
`;

export default function VideoGenPage() {
  return (
    <BasePage
      title='AI Video Generation | Seedance 2.0'
      bodyPage='video_gen'
      pageStyles={['/styles/video_gen.css']}
      pageScripts={['/scripts/video_gen.js']}
      html={HTML}
    />
  );
}
