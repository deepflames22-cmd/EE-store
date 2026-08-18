# AURION back-of-house API — Postgres via Prisma

The storefront is a static build, so the database lives behind this small Express API.
Give it your Postgres URL and the whole maison (catalog, brands, categories, orders,
promos, settings) reads and writes through it. When the API is absent, the site silently
falls back to its browser ledger — nothing breaks.

## 1 — Configure

```bash
export DATABASE_URL="postgres://USER:PASSWORD@HOST:5432/aurion?schema=public"
```

## 2 — Create the tables

The initial migration ships hand-written in `prisma/migrations/0001_init/`:

```bash
npx prisma migrate deploy
```

(Or skip the migration record entirely with `npx prisma db push`.)

## 3 — Seed the maison

```bash
npx tsx server/seed.ts
```

Seeds the 3 labels, 4 disciplines, 7 objets and 6 house codes.

## 4 — Run

```bash
npx tsx server/index.ts        # listens on :4000 (override with PORT=…)
```

Verify with `curl http://localhost:4000/api/health`.

## 5 — Connect the storefront

Dashboard → **Settings** → **Database bridge**: paste `http://localhost:4000`
(or your deployed URL), hit **Save URL**, then **Test line**.

From that moment:

- products / brands / categories hydrate from Postgres on load
- every create / edit / delete in the dashboard tabs writes through to Postgres
- placed orders are inserted into `orders` + `order_items`

## Endpoints

| Method | Path | Purpose |
| ------ | ---- | ------- |
| GET | /api/health | Liveness + DB check |
| GET/POST/PUT/DELETE | /api/products[/:id] | Catalog CRUD |
| GET/POST/PUT/DELETE | /api/brands[/:id] | Brand CRUD |
| GET/POST/PUT/DELETE | /api/categories[/:name] | Category CRUD |
| GET/POST | /api/orders | Order list / place |
| PATCH | /api/orders/:ref/status | Update status |
| GET/PUT | /api/promos[/:code] | Promo ledger |
| GET/PUT | /api/settings | Site settings blob |
| POST | /api/auth/register · /api/auth/login | Demo-grade auth |

## Notes

- Money is stored as integer dollars.
- Auth is deliberately demo-grade (sha-256, no sessions hardening) — swap in real
  auth (JWT/cookies, bcrypt/argon2) before exposing publicly.
- CORS is wide open for local use; lock it down in production.
