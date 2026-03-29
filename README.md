# Buyer Portal

Full-stack app: **Express API** (JWT, bcrypt, **SQLite via sql.js**), **Next.js 15 + TypeScript** frontend with reusable UI components.

## Run

**1. API** (`http://localhost:3001`)

```bash
cd server
cp .env.example .env
# Windows: Copy-Item .env.example .env
npm install
npm run dev
```

**2. Frontend** (`http://localhost:3000`)

```bash
cd client
npm install
npm run dev
```

Set `CLIENT_ORIGIN=http://localhost:3000` in `server/.env` for CORS.

Optional: `client/.env.local` with `API_ORIGIN=http://localhost:3001` if you change the API URL (`next.config.ts` rewrites `/api`).

## API

| Method | Path | Auth |
|--------|------|------|
| POST | `/api/auth/register` | No |
| POST | `/api/auth/login` | No |
| GET | `/api/auth/me` | Bearer |
| GET | `/api/properties` | Bearer |
| GET | `/api/favourites` | Bearer |
| POST | `/api/favourites` | Bearer, body `{ propertyId }` |
| DELETE | `/api/favourites/:propertyId` | Bearer |

Database file: `server/data/app.db` (created on first run; gitignored).

## Structure

- `server/src` — `db.js`, `middleware/auth.js`, `routes/` (`auth`, `favourites`, `properties`)
- `client/` — Next.js App Router, `components/`, `lib/`

## Git

Do not commit `.env`, `node_modules`, `client/.next`, or `server/data/*.db`.
