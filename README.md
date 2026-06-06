# rpc.virbicoin.com

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![ESLint](https://img.shields.io/badge/ESLint-10-4B32C3?logo=eslint&logoColor=white)](https://eslint.org)
[![License](https://img.shields.io/github/license/virbicoin/rpc.virbicoin.com)](LICENSE)

VirBiCoin RPC Node Status Dashboard — A web application that displays real-time cryptocurrency node status and provides JSON-RPC proxy endpoints.

## Features

- 🖥️ **Node Status Display** — Real-time block height, peer count, and version info
- 🌐 **JSON-RPC Proxy** — Relays POST requests to VirBiCoin nodes
- 🌙 **Dark/Light Theme** — System preference detection with manual toggle
- ⚡ **Fast Rendering** — Next.js App Router + Turbopack
- 📱 **Responsive** — Mobile-friendly dashboard UI

## Getting Started

### Prerequisites

- Node.js 20+
- npm 10+

### Installation

```bash
git clone https://github.com/virbicoin/rpc.virbicoin.com.git
cd rpc.virbicoin.com
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Development server (Turbopack) |
| `npm run build` | Production build |
| `npm start` | Production server |
| `npm run check` | All checks (lint + format + typecheck) |
| `npm run lint` | ESLint check |
| `npm run lint:fix` | ESLint auto-fix |
| `npm run typecheck` | TypeScript type check |
| `npm run format` | Prettier format |
| `npm run format:check` | Prettier check |

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/nodes` | GET | List all node statuses |
| `/api/nodes/:name` | GET | Get specific node status |
| `/health` | GET | Health check |
| `/` | POST | JSON-RPC proxy (via Nginx) |

## Project Structure

```
src/
├── app/                  # App Router (routes, layouts, pages)
│   ├── globals.css       # Tailwind global styles
│   ├── layout.tsx        # Root layout
│   ├── page.tsx          # Main dashboard
│   ├── api/
│   │   └── nodes/        # Node status API
│   │       ├── route.ts  # GET /api/nodes
│   │       ├── data.ts   # Node configuration (from env)
│   │       └── [NODE_NAME]/
│   │           └── route.ts  # GET /api/nodes/:name
│   └── health/
│       └── route.ts      # Health check
├── components/           # Reusable React components
│   ├── Header.tsx
│   ├── NodeStatus.tsx
│   ├── ConnectionInfo.tsx
│   ├── SecurityInfo.tsx
│   ├── UsageGuide.tsx
│   ├── ThemeProvider.tsx
│   └── ThemeToggle.tsx
public/
├── favicon.ico
└── VBC.svg
```

## Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `3000` |
| `NODES` | Node config (JSON: `{"Name": "URL", ...}`) | None (no nodes) |

Example `.env`:

```bash
PORT=4000
NODES='{"Node 1":"http://host1:8329","Node 2":"http://host2:8329"}'
```

## Production Deployment

```bash
npm run build
PORT=4000 npm start
```

### Nginx Reverse Proxy Example

```nginx
server {
    server_name rpc.virbicoin.com;

    # Proxy _next/ static assets to Next.js
    location /_next/ {
        proxy_pass http://127.0.0.1:4000;
        proxy_set_header Host $host;
    }

    location / {
        # JSON-RPC (POST) → VirBiCoin node
        if ($request_method = POST) {
            proxy_pass http://127.0.0.1:8329;
            break;
        }
        # GET → Next.js dashboard
        proxy_pass http://127.0.0.1:4000$request_uri;
        proxy_set_header Host $host;
    }
}
```

## Tech Stack

- [Next.js](https://nextjs.org) 16 (App Router, Turbopack)
- [TypeScript](https://www.typescriptlang.org) 6
- [Tailwind CSS](https://tailwindcss.com) 4
- [ESLint](https://eslint.org) 10 + [Prettier](https://prettier.io)

## License

See [LICENSE](LICENSE) for details.
