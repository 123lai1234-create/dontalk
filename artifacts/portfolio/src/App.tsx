import { lazy, Suspense, useEffect } from 'react';
import { Switch, Route, Router as WouterRouter } from 'wouter';
import { initWebVitals } from './lib/web-vitals';

// Route-level code splitting: each page is only downloaded when the user
// navigates to it. Previously all 18 pages were statically imported, so the
// first visit paid for every page (including recharts / chart-heavy pages).
const IndexPage = lazy(() => import('./pages/index_page'));
const AboutPage = lazy(() => import('./pages/about'));
const WorksPage = lazy(() => import('./pages/works'));
const GeneAiPage = lazy(() => import('./pages/gene_ai'));
const NgsPage = lazy(() => import('./pages/ngs'));
const ProteinMpnnPage = lazy(() => import('./pages/protein_mpnn'));
const ReportPage = lazy(() => import('./pages/report'));
const ThesisPage = lazy(() => import('./pages/thesis'));
const InterviewPage = lazy(() => import('./pages/interview'));
const MusicPage = lazy(() => import('./pages/music'));
const VideoGenPage = lazy(() => import('./pages/video_gen'));
const BlogPage = lazy(() => import('./pages/blog_page'));
const FirmwarePage = lazy(() => import('./pages/firmware'));
const StemCellPage = lazy(() => import('./pages/stem_cell'));
const InteractiveShowcasePage = lazy(() => import('./pages/interactive_showcase'));
const InterviewPrepPage = lazy(() => import('./pages/interview_prep'));
const StockPage = lazy(() => import('./pages/stock'));

// Inter is already loaded from index.html (400/500/600/700). Only the mono
// font actually used by the stylesheets is loaded here. The previous URL
// also pulled Source Serif 4 and Space Grotesk in many weights, neither of
// which is referenced by any stylesheet, plus a second copy of Inter.
const SHARED_STYLES = [
  'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&display=swap',
  '/styles/shared.css',
  '/styles/polish.css',
  '/styles/dynamic.css',
  '/styles/immersive.css',
];

const SHARED_SCRIPTS = [
  '/scripts/site-shell-config.js',
  '/scripts/nav.js',
];

function useGlobalSetup() {
  useEffect(() => {
    initWebVitals();
    document.documentElement.classList.add('js-reveal');
    if ('serviceWorker' in navigator) {
      if (import.meta.env.PROD) {
        navigator.serviceWorker.register('/sw.js').catch(() => {});
      } else {
        navigator.serviceWorker.getRegistrations().then(regs => {
          regs.forEach(r => r.unregister());
        });
        // Dev: also purge any caches a previously-registered SW left behind,
        // otherwise stale CSS/JS keeps getting served from Cache Storage.
        if (window.caches) {
          caches.keys().then(keys => keys.forEach(k => caches.delete(k)));
        }
      }
    }
    SHARED_STYLES.forEach(href => {
      if (!document.querySelector(`link[href="${href}"]`)) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = href;
        document.head.appendChild(link);
      }
    });
    const loadNext = (index: number) => {
      if (index >= SHARED_SCRIPTS.length) return;
      const src = SHARED_SCRIPTS[index];
      if (!document.querySelector(`script[data-shared-script="${src}"]`)) {
        const script = document.createElement('script');
        script.src = src;
        script.dataset.sharedScript = src;
        script.onload = () => loadNext(index + 1);
        script.onerror = () => loadNext(index + 1);
        document.body.appendChild(script);
      } else {
        loadNext(index + 1);
      }
    };
    loadNext(0);
  }, []);
}

function NotFoundPage() {
  useEffect(() => { document.title = '404 — Page Not Found'; }, []);
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '16px' }}>
      <h1 style={{ fontSize: '4rem', margin: 0 }}>404</h1>
      <p>頁面不存在</p>
      <a href="/">← 回首頁</a>
    </div>
  );
}

function Router() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>載入中…</div>}>
      <Switch>
        <Route path="/" component={IndexPage} />
        <Route path="/about" component={AboutPage} />
        {/* Legacy underscore URLs are kept as a fallback for local dev /
            direct file serving; on Vercel, vercel.json redirects them to
            the hyphenated canonical URL before the SPA rewrite runs. */}
        <Route path="/about_me" component={AboutPage} />
        <Route path="/works" component={WorksPage} />
        <Route path="/gene-ai" component={GeneAiPage} />
        <Route path="/gene_ai" component={GeneAiPage} />
        <Route path="/ngs" component={NgsPage} />
        <Route path="/protein-mpnn" component={ProteinMpnnPage} />
        <Route path="/protein_mpnn" component={ProteinMpnnPage} />
        <Route path="/report" component={ReportPage} />
        <Route path="/thesis" component={ThesisPage} />
        <Route path="/interview" component={InterviewPage} />
        <Route path="/interview_prep" component={InterviewPage} />
        <Route path="/interview-prep" component={InterviewPrepPage} />
        <Route path="/firmware" component={FirmwarePage} />
        <Route path="/stem-cell" component={StemCellPage} />
        <Route path="/stem_cell" component={StemCellPage} />
        <Route path="/interactive-showcase" component={InteractiveShowcasePage} />
        <Route path="/music" component={MusicPage} />
        <Route path="/video-gen" component={VideoGenPage} />
        <Route path="/video_gen" component={VideoGenPage} />
        <Route path="/stock" component={StockPage} />
        <Route path="/blog" component={BlogPage} />
        <Route path="/blog/:slug+" component={BlogPage} />
        <Route component={NotFoundPage} />
      </Switch>
    </Suspense>
  );
}

function App() {
  useGlobalSetup();
  return (
    <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
      <Router />
    </WouterRouter>
  );
}

export default App;
