import { useEffect } from 'react';
import { Switch, Route, Router as WouterRouter } from 'wouter';

import IndexPage from './pages/index_page';
import AboutPage from './pages/about';
import WorksPage from './pages/works';
import GeneAiPage from './pages/gene_ai';
import NgsPage from './pages/ngs';
import ProteinMpnnPage from './pages/protein_mpnn';
import ReportPage from './pages/report';
import ThesisPage from './pages/thesis';
import InterviewPage from './pages/interview';
import MusicPage from './pages/music';
import VideoGenPage from './pages/video_gen';
import XianGodotPage from './pages/xian_godot';
import BlogPage from './pages/blog_page';
import FirmwarePage from './pages/firmware';
import StemCellPage from './pages/stem_cell';
import InteractiveShowcasePage from './pages/interactive_showcase';
import InterviewPrepPage from './pages/interview_prep';
import StockPage from './pages/stock';

const SHARED_STYLES = [
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;700&family=Source+Serif+4:ital,opsz,wght@0,8..60,300;0,8..60,400;0,8..60,600;1,8..60,300;1,8..60,400&family=Space+Grotesk:wght@400;500;600;700&display=swap',
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
    <Switch>
      <Route path="/" component={IndexPage} />
      <Route path="/about" component={AboutPage} />
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
      <Route path="/xian-godot" component={XianGodotPage} />
      <Route path="/stock" component={StockPage} />
      <Route path="/blog" component={BlogPage} />
      <Route path="/blog/:slug+" component={BlogPage} />
      <Route component={NotFoundPage} />
    </Switch>
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
