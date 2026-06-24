import { useEffect } from 'react';
import BasePage from '../components/BasePage';

const HTML = `
  <div data-site-nav></div>
  <main style="max-width:720px;margin:0 auto;padding:60px 24px">
    <div style="margin-bottom:40px">
      <div class="section-label">Blog</div>
      <h1 style="font-size:clamp(1.6rem,4vw,2.4rem);font-weight:700;margin:8px 0 12px;color:var(--text)">技術文章</h1>
      <p style="color:var(--muted);font-size:.95rem">研究筆記、技術解析、工程心得。</p>
    </div>
    <div style="padding:40px 0;text-align:center;color:var(--muted)">
      <div style="font-size:2rem;margin-bottom:16px">📖</div>
      <p>技術文章功能在 Replit 版本中暫時停用。</p>
      <p style="font-size:.85rem;margin-top:8px">Blog 功能即將上線，敬請期待。</p>
    </div>
  </main>
  <div data-site-footer></div>
`;

export default function BlogPage() {
  return (
    <BasePage
      title="技術文章 | JT Lai"
      bodyPage="blog"
      pageStyles={[]}
      pageScripts={['/scripts/app-config.js']}
      html={HTML}
    />
  );
}
