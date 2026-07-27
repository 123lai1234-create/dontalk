# syntax=docker/dockerfile:1.7
# ----------------------------------------------------------------------------
# dontalk api-server — production image for Railway / Fly.io / any OCI host.
#
# Single-process Node.js 24 server (Express 5 + Drizzle). Uses pnpm workspaces
# because @workspace/db and @workspace/api-zod live in sibling workspace
# packages. The esbuild build step bundles those workspace deps into
# dist/index.mjs, so the runtime only needs the bundled output + external
# production node_modules.
# ----------------------------------------------------------------------------

# ---- build stage --------------------------------------------------------
FROM node:24-bookworm-slim AS build
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
# Reproducible pnpm version pinned in packageManager
RUN corepack enable \
 && corepack prepare pnpm@10.26.1 --activate

WORKDIR /workspace

# Copy lockfile + workspace metadata first for maximum layer cache hit rate.
# Split into individual COPY lines — BuildKit on Railway's Metal builder
# has a quirk where multi-source COPY with dotfiles (like .npmrc) can fail
# the cache key check with a misleading "not found" error during the
# runtime stage's `COPY --from=build`. Single-source COPY is reliable.
COPY pnpm-lock.yaml ./
COPY pnpm-workspace.yaml ./
COPY package.json ./
COPY .npmrc ./
COPY tsconfig.base.json ./
COPY tsconfig.json ./

# Workspace members the api-server transitively needs.
COPY lib ./lib
COPY artifacts ./artifacts
COPY scripts ./scripts

# Full install (devDeps required for esbuild + TypeScript).
# --no-frozen-lockfile because pnpm-workspace.yaml sets minimumReleaseAge
# which can conflict with first-time install in CI; lockfile is committed
# and reviewed, so we don't need to enforce frozen here.
RUN pnpm install --no-frozen-lockfile

# Build only the api-server (esbuild bundles workspace deps into dist/).
RUN pnpm --filter @workspace/api-server run build

# ---- runtime stage ------------------------------------------------------
FROM node:24-bookworm-slim AS runtime
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable \
 && corepack prepare pnpm@10.26.1 --activate

WORKDIR /workspace

# Workspace metadata + pnpm cache for prod install.
# Same single-source COPY rationale as the build stage above. The runtime
# stage doesn't need .npmrc (pnpm install will use defaults — the strict
# settings there were only relevant to the build stage's devDep install).
COPY pnpm-lock.yaml ./
COPY pnpm-workspace.yaml ./
COPY package.json ./
COPY tsconfig.base.json ./
COPY tsconfig.json ./

# Workspace members (lib is needed for symlink targets; lib/db and
# lib/api-zod are TS-source exports bundled into the api-server's dist,
# but pnpm's hoisted store still wants them present for symlink correctness).
COPY lib ./lib
COPY artifacts ./artifacts
COPY scripts ./scripts

# Install production-only deps (no esbuild/tsc/etc.). The api-server
# node_modules holds the external runtime deps (pg, drizzle-orm, express, ...).
# --ignore-scripts so we don't try to run any postinstall hooks in this
# minimal stage.
RUN pnpm install --prod --no-frozen-lockfile --ignore-scripts

# Bring the api-server's per-package node_modules (linked deps + binaries).
COPY --from=build /workspace/artifacts/api-server/node_modules ./artifacts/api-server/node_modules
# Bring the bundled build output (gitignored, produced by esbuild above).
COPY --from=build /workspace/artifacts/api-server/dist ./artifacts/api-server/dist

ENV NODE_ENV=production
# Required by src/index.ts: throws if PORT is missing.
ENV PORT=8080
EXPOSE 8080

# Belt-and-suspenders liveness probe. Railway also has its own HTTP probe
# (configured in railway.toml) which takes precedence; this is here for
# `docker run` / other orchestrators.
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:'+process.env.PORT+'/api/healthz').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

WORKDIR /workspace/artifacts/api-server
CMD ["node", "--enable-source-maps", "./dist/index.mjs"]
