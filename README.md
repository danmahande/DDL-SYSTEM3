# DDL-SYSTEM3

Direct Demand-to-Logistics (DDL) supplier dashboard built with Next.js, Prisma, PostgreSQL, and Upstash Redis.

## Features

- Signed cookie sessions with role-based API access
- Demand signal ingestion from retailer apps (API key protected)
- Live signal notifications via SSE + Redis
- Map-based demand visualization (Mapbox)
- CRUD modules for users, merchants, products, neighborhoods, drivers, and runsheets

## Prerequisites

- Node.js 20+
- PostgreSQL database
- Upstash Redis (optional, for real-time notifications)
- Mapbox access token (for map module)

## Setup

1. Clone and install dependencies:

```bash
git clone https://github.com/danmahande/DDL-SYSTEM3.git
cd DDL-SYSTEM3
npm install
```

2. Copy environment variables:

```bash
cp .env.example .env.local
```

3. Update `.env.local` with your secrets:

- `SESSION_SECRET` — long random string (required in production)
- `DATABASE_URL` — PostgreSQL connection string
- `RETAILER_API_KEY` — key used by retailer apps for signal ingestion
- `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` — for SSE notifications
- `NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN` — Mapbox token

4. Run migrations and seed data:

```bash
npm run db:deploy
npm run db:seed
```

Default seeded admin:

- Email: `admin@ddl.com`
- Password: `ChangeMe123!`

5. Start the dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run db:migrate` | Create/apply migrations in dev |
| `npm run db:deploy` | Apply migrations in production/CI |
| `npm run db:seed` | Seed admin user and sample data |
| `npm test` | Run unit tests |

## API Security

- Dashboard APIs require a valid signed session cookie (`ddl-session`)
- Retailer signal ingestion (`POST /api/retailer-signals`) requires `X-API-Key` header
- Public registration is disabled by default (`ALLOW_PUBLIC_REGISTRATION=false`)

### Retailer signal example

```bash
curl -X POST http://localhost:3000/api/retailer-signals \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your-retailer-api-key" \
  -d '{
    "signalId": "SIG-001",
    "shopkeeperId": "SHOP-001",
    "neighborhood": "Bugolobi Market",
    "productCategory": "Beverages",
    "productLabel": "Soda 500ml",
    "packageSize": "medium",
    "priceTier": "mid-range"
  }'
```

## Deployment (Vercel)

1. Connect the repo to Vercel
2. Add environment variables from `.env.example`
3. Use Vercel Postgres for `DATABASE_URL`
4. The `vercel-build` script runs `prisma migrate deploy` before building

## Project Structure

```
src/
  app/api/          # Route handlers
  components/       # UI modules and layout
  lib/              # Auth, session, prisma, redis helpers
  providers/        # React context providers
prisma/
  schema.prisma     # Database schema
  migrations/       # Versioned SQL migrations
  seed.ts           # Seed script
tests/              # Unit tests
```

## License

Private project.
