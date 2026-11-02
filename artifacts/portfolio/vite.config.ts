import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import { createHash } from "node:crypto";
import fs from "node:fs";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";

const rawPort = process.env.PORT;

if (!rawPort) {
  throw new Error(
    "PORT environment variable is required but was not provided.",
  );
}

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

const basePath = process.env.BASE_PATH;

if (!basePath) {
  throw new Error(
    "BASE_PATH environment variable is required but was not provided.",
  );
}

// Content hash of the non-hashed public/ assets (styles + scripts injected
// by BasePage). Unlike Date.now(), this only changes when an asset actually
// changes, so visitors keep a valid cache across deploys that touch nothing.
function publicAssetVersion(): string {
  try {
    const hash = createHash("sha256");
    const walk = (dir: string) => {
      for (const entry of fs.readdirSync(dir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) walk(full);
        else if (entry.isFile()) hash.update(fs.readFileSync(full));
      }
    };
    const root = path.resolve(import.meta.dirname, "public");
    for (const sub of ["styles", "scripts"]) {
      const dir = path.join(root, sub);
      if (fs.existsSync(dir)) walk(dir);
    }
    return hash.digest("hex").slice(0, 10);
  } catch {
    return "1";
  }
}

export default defineConfig({
  base: basePath,
  define: {
    __ASSET_VERSION__: JSON.stringify(publicAssetVersion()),
  },
  plugins: [
    react(),
    tailwindcss(),
    runtimeErrorOverlay(),
    ...(process.env.NODE_ENV !== "production" &&
    process.env.REPL_ID !== undefined
      ? [
          await import("@replit/vite-plugin-cartographer").then((m) =>
            m.cartographer({
              root: path.resolve(import.meta.dirname, ".."),
            }),
          ),
          await import("@replit/vite-plugin-dev-banner").then((m) =>
            m.devBanner(),
          ),
        ]
      : []),
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "src"),
    },
    dedupe: ["react", "react-dom"],
  },
  root: path.resolve(import.meta.dirname),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
    rollupOptions: {
      output: {
        // Split the heaviest libraries out of the initial bundle so the
        // first page load doesn't pay for chart / animation code that
        // only some pages use. Vite still hashes these chunk filenames,
        // so they can be cached long-term (see vercel.json headers).
        manualChunks: {
          react: ["react", "react-dom", "wouter"],
          charts: ["recharts", "chart.js"],
          motion: ["framer-motion"],
        },
      },
    },
  },
  server: {
    port,
    strictPort: true,
    host: "0.0.0.0",
    allowedHosts: true,
    fs: {
      strict: true,
    },
  },
  preview: {
    port,
    host: "0.0.0.0",
    allowedHosts: true,
  },
});
