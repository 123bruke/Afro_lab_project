# ContextFlow — Smart SDK System

<div align="center">

**Deterministic context windows · Client-side function calling · PII-free retrieval · 128K horizons**

A modern developer-product website and AI workspace client built with **React 19**, **Vite 8**, and **Tailwind CSS v4**. It presents the ContextFlow "Smart SDK System" — a context-management SDK — and ships a fully interactive mock workspace: chat, task orchestration, memory stores, agent pipelines, a context inspector, analytics, and settings.

</div>

---

## Table of Contents

- [What is this project?](#what-is-this-project)
- [Main features](#main-features)
- [Tech stack](#tech-stack)
- [Requirements](#requirements)
- [How to run the project](#how-to-run-the-project)
  - [1. Install dependencies](#1-install-dependencies)
  - [2. Configure environment variables](#2-configure-environment-variables)
  - [3. Start the development server](#3-start-the-development-server)
  - [4. Production build & preview](#4-production-build--preview)
- [Environment variables](#environment-variables)
  - [`.env.example`](#envexample)
  - [`.env.local` (local development)](#envlocal-local-development)
- [Scripts](#scripts)
- [Project structure](#project-structure)
- [Design notes](#design-notes)
- [Troubleshooting](#troubleshooting)
- [Deployment](#deployment)

---

## What is this project?

ContextFlow is a single-page application with two surfaces:

1. **Marketing / landing page (`Home`)** — the first page featuring the large solid **"SMART SDK SYSTEM"** hero, a live particle canvas, code-synthesis + agent-interaction demos, a product-versions marquee, a trusted-ecosystem logo track, the company team, and deterministic pricing tiers.
2. **Application workspace** — a functional mock workspace where you can:
   - **Chat** — ChatGPT-style conversation panel with file/image attachments, a **History (Memory)** button, and a tabbed **Workspace** panel (Tasks / Memory / Agents / Context).
   - **Tasks** — multi-phase task orchestration with progress tracking and agent selection.
   - **Settings** — workspace identity, context-engine configuration, theme, API endpoint, plus an embedded **Analytics Dashboard** (context utilization, compression, retrieval latency, token burn rate, memory growth).
   - **Accounts** — create an account or sign in (email, Google, GitHub), upload your own profile photo, and reach it from the header in any tab.

All workspace behavior is a high-fidelity **front-end mock** powered by a React context store — **no backend is required** to run or explore the UI.

---

## Main features

| # | Section | Highlights |
|---|---------|------------|
| 1 | Hero | Solid, shadow-free **"SMART SDK SYSTEM"** title, particle flow canvas, CTA buttons |
| 2 | Engine | `CodeTypewriter` live code-synthesis + `AgentInteractiveEngine` phase selector |
| 3 | Versions | Continuous horizontal marquee of product versions |
| 4 | Ecosystem | Two-track scroll of 14 real brand logos (inline SVG) |
| 5 | Updates | Chronological `SystemUpdates` changelog |
| 6 | Team | `CompanyTeamSection` with circular profile photos |
| 7 | Pricing | Deterministic tiers ($0 / $49 / Custom) |
| 8 | End page | Full-cover architectural house panorama + footer |

**Workspace tabs:** Home · Dashboard · Tasks · Chat · Settings (via the `•••` drawer button, with keyboard shortcuts).

---

## Tech stack

- **React 19** + **TypeScript**
- **Vite 8** — dev server on port `3000`, `vite build` for production
- **Tailwind CSS v4** (`@tailwindcss/vite`) + custom unlayered CSS in `src/index.css`
- **lucide-react** icons, **motion** animations
- `express` + `dotenv` (optional local serve layer), `@google/genai` (optional Gemini integration)

---

## Requirements

- **Node.js 18+** (includes `npm`)
- A terminal (PowerShell, bash, zsh)

Verify your environment:

```bash
node -v
npm -v
```

---

## How to run the project

### 1. Install dependencies

```bash
npm install
```

> If you hit peer-dependency errors on older Node versions, retry with `npm install --legacy-peer-deps`.

### 2. Configure environment variables

The app runs fine with no variables (everything is mocked). To wire real services, set them:

```bash
cp .env.example .env.local
# edit .env.local and fill in your keys (see "Environment variables")
```

### 3. Start the development server

```bash
npm run dev
```

Open **http://localhost:3000** in your browser. Vite serves the app with hot-module replacement — save a file and the page updates instantly.

### 4. Production build & preview

```bash
npm run lint      # type-check the project (tsc --noEmit)
npm run build     # create the production bundle in dist/
npm run preview   # serve the dist/ build locally for verification
```

---

## Environment variables

All documented variables live in [`.env.example`](./.env.example). Real values go in `.env.local` (or `.env`), which is git-ignored. Only `.env.example` is committed.

### `.env.example`

```env
GEMINI_API_KEY="MY_GEMINI_API_KEY"
APP_URL="http://localhost:3000"
PORT=3000
HOST=0.0.0.0
VITE_ENGINE_ENDPOINT="http://localhost:8080"
VITE_TELEMETRY_ENDPOINT=""
```

### `.env.local` (local development)

```env
GEMINI_API_KEY="AIzaSy..."
APP_URL="http://localhost:3000"
PORT=3000
HOST=0.0.0.0
VITE_ENGINE_ENDPOINT="http://localhost:8080"
VITE_TELEMETRY_ENDPOINT=""
```

| Variable                  | Required | Default                | Description                                                                                |
| ------------------------- | -------- | ---------------------- | ------------------------------------------------------------------------------------------ |
| `GEMINI_API_KEY`          | No       | –                      | Google Gemini API key. Required only when wiring the chat to a real model.                  |
| `APP_URL`                 | No       | `http://localhost:3000`| Public URL of the app — self-referential links, OAuth callbacks, API endpoints.             |
| `PORT`                    | No       | `3000`                 | Dev-server port (used when you adjust the `dev` script).                                   |
| `HOST`                    | No       | `0.0.0.0`              | Dev-server bind address.                                                                   |
| `VITE_ENGINE_ENDPOINT`    | No       | –                      | ContextFlow engine base URL; pre-fills Settings → API → Context Engine Endpoint.            |
| `VITE_TELEMETRY_ENDPOINT` | No       | –                      | Optional analytics/telemetry event endpoint; leave empty to disable.                        |

> **Security:** variables prefixed `VITE_` are bundled client-side — never put secrets in them. `GEMINI_API_KEY` should stay on the server or in the platform's secret manager.

---

## Scripts

| Command            | Description                                            |
| ------------------ | ------------------------------------------------------ |
| `npm run dev`      | Start Vite dev server on port `3000` (`--host 0.0.0.0`)|
| `npm run lint`     | Type-check the whole project with `tsc --noEmit`       |
| `npm run build`    | Create a production bundle in `dist/`                  |
| `npm run preview`  | Preview the production build locally                   |
| `npm run clean`    | Remove `dist/` build output                            |

---

## Project structure

```
src/
├── components/
│   ├── features/        # Chat, bubbles, inspector, marquees, charts, agents...
│   ├── layout/          # TopHeader, Sidebar (drawer), global chrome
│   └── ui/              # StatusBadge, MetricCard, AuthModal, CommandMenu...
├── context/
│   └── ContextFlowContext.tsx   # central state store + mock operations
├── data/
│   └── mockData.ts              # initial tasks, sessions, memories, series
├── services/
│   └── contextService.ts        # mock context-window helpers
├── types/
│   └── contextflow.ts           # shared TypeScript types
└── views/               # Home, Dashboard, ChatWorkspace, Tasks, Settings, Analytics...
```

Key entry points:

- `src/main.tsx` → `src/App.tsx` (tab router, command palette, cursor effects)
- `src/views/HomeView.tsx` — landing page (hero, sections, pricing)
- `src/views/ChatWorkspaceView.tsx` — chat + tabbed Workspace panel
- `src/components/ui/AuthModal.tsx` — mock account creation / sign-in (Google, GitHub)
- `src/components/layout/TopHeader.tsx` — brand, nav pill, theme toggle, account menu

---

## Design notes

- **Color modes:** full dark/light theming via a `colorMode` setting; light mode renders buttons black for contrast.
- **Text purity:** hero titles are solid-color, shadow- and gradient-free.
- **Real shadows only:** glows were removed from pricing cards, header pills, and nav buttons in favor of transparent blurred surfaces with neutral shadows.
- Images (hero forest, house panorama, team photos) are bundled via Vite imports so they resolve in both dev and production builds.

---

## Troubleshooting

| Issue | Fix |
| ----- | --- |
| `npm install` fails with peer-dependency errors | Run `npm install --legacy-peer-deps` |
| Port `3000` already in use | Change `--port` in the `dev` script of `package.json`, or stop the conflicting process |
| Images/logos missing in the built app | They are bundled as Vite imports — run `npm run build` then `npm run preview` (don't rely on raw `/src/...` paths) |
| Blue hero title or unwanted text glow | `textShadow` is forced to `none` inline; a residual `text-shadow` in CSS must be removed the same way |
| Env keys not picked up | Put them in `.env.local` (git-ignored), not in a committed file, then restart `npm run dev` |

---

## Deployment

A standard Vite SPA:

```bash
npm run build      # outputs dist/
npm run preview    # verify locally
```

Deploy the `dist/` folder to any static host (Vercel, Netlify, Cloud Run, S3 + CDN) and set `APP_URL` to the deployed URL. If attaching a Gemini/AI-Studio backend, keep `GEMINI_API_KEY` in the platform's secret manager rather than in the bundle.