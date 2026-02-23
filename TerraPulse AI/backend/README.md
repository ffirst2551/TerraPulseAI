# TerraPulse Backend (Node.js)

Fastify-based backend scaffold for TerraPulse with:
- Auth (`JWT`)
- Project/Sector APIs
- Dashboard API
- Scan jobs (`BullMQ + Redis`) with mock fallback
- Verification hash API (mock Polygon anchor)
- Prisma schema for PostgreSQL
- Socket.IO channels for realtime scan updates

## 1) Prerequisites

- Node.js `20+`
- npm `10+`
- (Optional for connected mode) PostgreSQL + Redis

## 2) Install

```bash
cd backend
npm install
```

## 3) Environment

```bash
cp .env.example .env
```

Start quickly in mock mode:
- keep `USE_MOCK_DATA=true`

Connected mode:
- set `USE_MOCK_DATA=false`
- configure `DATABASE_URL` and `REDIS_URL`
- run Prisma migration:

```bash
npx prisma migrate dev --name init
```

## 4) Run API

```bash
npm run dev
```

Server default: `http://localhost:8787`

## 5) Run worker (connected mode)

```bash
npm run worker
```

## 6) Demo login

In mock mode, use:
- `admin@terrapulse.ai` / `terrapulse123`
- `analyst@terrapulse.ai` / `terrapulse123`

## 7) Core endpoints

- `GET /health`
- `POST /auth/login`
- `POST /auth/refresh`
- `GET /projects/:id/sectors`
- `GET /dashboard/:projectId`
- `POST /scans`
- `GET /scans/:id/status`
- `POST /verification/hash`
- `GET /verification/:id`

## 8) Socket events

Client emits:
- `join:project` with `projectId`
- `join:scan` with `scanId`

Server emits:
- `project:scan-update`
- `scan:update`

## 9) Quick API check (PowerShell)

```powershell
$loginBody = @{ email = "admin@terrapulse.ai"; password = "terrapulse123" } | ConvertTo-Json
$login = Invoke-RestMethod -Method Post -Uri http://localhost:8787/auth/login -ContentType "application/json" -Body $loginBody
$token = $login.tokens.accessToken
$headers = @{ Authorization = "Bearer $token" }

Invoke-RestMethod -Method Get -Uri http://localhost:8787/projects/project-th-001/sectors -Headers $headers
Invoke-RestMethod -Method Get -Uri http://localhost:8787/dashboard/project-th-001 -Headers $headers
```
