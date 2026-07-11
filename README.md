# Kehila Network

The digital home of the global Jewish community — a trust-driven real estate marketplace and the foundation of a modular, multi-vertical community platform.

## Documentation

- [Product Blueprint & PRD — Phase 1: Real Estate](docs/PRODUCT_BLUEPRINT.md): Executive summary, GTM strategy, MVP feature specs (Property Passport™, Landlord/Tenant Passport™, AI Trust Score™, Community Score™, Property Match™), system architecture, database schema, and the 90-day implementation roadmap.

## What's built so far

This is an early, working slice of the Phase 1 marketplace — enough to run, click through, and iterate on:

- **Accounts**: sign up / log in (email + password) as a Home Seeker, Owner, or Agency, backed by NextAuth (Auth.js v5) + Postgres.
- **Listings**: browse/search live listings, view a listing detail page, and (when logged in) publish a new listing.
- **Data model**: Prisma schema for `User`, `Property`, `Listing`, `Message` — a simplified starting point for the full schema in the blueprint (Property Passport, Trust Score, Community Score, etc. are not implemented yet).

Stack: Next.js (App Router, TypeScript, Tailwind) + Prisma + PostgreSQL, single deployable app.

## Running locally

1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy `.env.example` to `.env` and fill in:
   - `DATABASE_URL` — a Postgres connection string (a local Postgres or a free Railway/Neon/Supabase instance both work).
   - `AUTH_SECRET` — generate with `openssl rand -base64 32`.
3. Push the schema to your database:
   ```bash
   npx prisma db push
   ```
4. Start the dev server:
   ```bash
   npm run dev
   ```
   Visit [http://localhost:3000](http://localhost:3000).

## Deploying to Railway

Railway can build and host this app directly from this GitHub repo — no Dockerfile needed, it auto-detects Next.js.

1. **Create a project** on [railway.app](https://railway.app) and choose **Deploy from GitHub repo**, selecting `shlomo27/jewish-home-network` and the `claude/community-platform-phase1-prd-1ck0f8` branch (or `main` once merged).
2. **Add a Postgres database**: in the project, click **+ New → Database → PostgreSQL**. Railway provisions it and exposes a `DATABASE_URL`.
3. **Set environment variables** on the app service (Settings → Variables):
   - `DATABASE_URL` — reference the Postgres plugin's variable (Railway lets you pick `${{Postgres.DATABASE_URL}}` from a dropdown).
   - `AUTH_SECRET` — generate with `openssl rand -base64 32` and paste it in.
   - `AUTH_TRUST_HOST` — set to `true` (required since Railway sits behind a reverse proxy).
4. **Deploy.** Railway runs `npm install` → `npm run build` (which also runs `prisma generate`) → `npm run start` (which runs `prisma db push` to sync the schema, then starts the server).
5. Once deployed, Railway gives you a `*.up.railway.app` URL immediately. To use a real domain, go to the service's **Settings → Networking → Custom Domain**, add your domain, and point its DNS (a `CNAME` record) at the target Railway gives you.

After the first deploy, every push to the connected branch redeploys automatically — so once this is wired up, any further changes pushed here go live without extra steps.

### Note on schema changes

`npm run start` runs `prisma db push` before boot, which is convenient for this early stage but can drop columns/data on destructive schema changes. Once there's real user data worth protecting, switch to proper Prisma Migrate (`prisma migrate deploy` as the release step) instead of `db push`.
