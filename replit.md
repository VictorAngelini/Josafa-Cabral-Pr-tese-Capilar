# Josafá - Hair & Prótese Capilar

Site de apresentação e agendamento online para o estúdio de prótese capilar Josafá, em Tatuapé, São Paulo.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080)
- `pnpm --filter @workspace/josafa-site run dev` — run the frontend (port 21220)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec (then manually fix `lib/api-zod/src/index.ts` to only export `./generated/api`, not `./generated/types`)
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite, Tailwind CSS, shadcn/ui, wouter, TanStack Query, react-hook-form
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `lib/api-spec/openapi.yaml` — OpenAPI contract (source of truth)
- `lib/db/src/schema/appointments.ts` — DB schema (services + appointments tables)
- `artifacts/api-server/src/routes/` — Express route handlers
- `artifacts/josafa-site/src/` — React frontend (single-page site)

## Architecture decisions

- `lib/api-zod/src/index.ts` exports only from `./generated/api` (not `./generated/types`) to avoid naming conflicts between Zod schemas and TypeScript interfaces. Must be manually fixed after each `codegen` run.
- Frontend is a single-page site with anchor navigation — no multi-page routing.
- Appointments flow is public (no auth required); clients book via a form and receive a pending status.
- Services are seeded in DB and fetched from the API to populate the booking form.

## Product

- Landing page in Portuguese with hero, about, services, how-it-works, and booking sections
- Clients can book a consultation by filling a form with name, phone, email, service, date, time, and notes
- Floating WhatsApp button linking to +55 (11) 99322-3453
- Address: Rua Irapé, 217 — Tatuapé, São Paulo - SP | Phone: +55 (11) 99322-3453

## User preferences

- Language: Portuguese (Brazilian) throughout the UI
- No emojis in the UI

## Gotchas

- After running `pnpm --filter @workspace/api-spec run codegen`, manually overwrite `lib/api-zod/src/index.ts` with just `export * from "./generated/api";` — orval regenerates the file with duplicate exports.
- The API server must be running for the frontend booking form and services list to work.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
