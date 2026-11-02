# dontalk

工程 × 生醫 × AI 跨域作品集。線上站：https://donttalk.vercel.app

前端是 Vite + React 單頁作品集（蛋白質 AI、基因分析、NGS、韌體、幹細胞研究、音樂、台股工具等頁面）；
後端是 Express API，部署在 Railway，前端透過 `vercel.json` 的 rewrite 或直接連 Railway 位址存取。

## 目錄

| 目錄 | 說明 |
| --- | --- |
| `artifacts/portfolio/` | 前端作品集，Vercel 部署的目標（`@workspace/portfolio`） |
| `artifacts/api-server/` | 後端 API，Railway 用根目錄 `Dockerfile` 部署 |
| `lib/` | 共用程式庫（`db`、`api-zod`、`api-spec`、`api-client-react` 等） |
| `scripts/` |  workspace 工具腳本 |
<!-- 2026-11-02 深度清理：以下目錄已從 main 刪除，內容仍可在 git 歷史中找到：
`artifacts/portfolio-mobile/`（舊版行動版實驗專案）、`artifacts/mockup-sandbox/`（Mockup 沙箱）、
`attic/`（封存舊程式碼）、`attached_assets/`（早期圖片素材，主站已無引用）。 -->

## 開發

```bash
pnpm install
# 前端（需要 PORT 與 BASE_PATH，見 artifacts/portfolio/vite.config.ts）
PORT=3000 BASE_PATH=/ pnpm --filter @workspace/portfolio run dev
# 完整 typecheck
pnpm run typecheck
# 前端建置（與 Vercel 相同指令）
PORT=3000 BASE_PATH=/ pnpm --filter @workspace/portfolio run build
```

## 部署

- **前端**：Vercel，追蹤 `main` 分支。建置指令與輸出目錄見 `vercel.json`
  （`pnpm --filter @workspace/portfolio run build` → `artifacts/portfolio/dist/public`）。
- **後端**：Railway，用根目錄 `Dockerfile` 建置，健康檢查為 `GET /api/healthz`，
  詳見 `railway.toml` 與 `DEPLOY_RAILWAY.md`。

## 注意事項

- 套件管理一律用 pnpm（`packageManager: pnpm@10.26.1`），根目錄的 `preinstall`
  會擋下非 pnpm 的安裝方式。
- `pnpm-workspace.yaml` 設定了套件最短上架年齡（`minimumReleaseAge: 1440`），
  不要隨意關掉，那是供應鏈攻擊的防護。
