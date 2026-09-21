# Database setup (PostgreSQL)

This project uses Prisma with **PostgreSQL** (Neon, Vercel Postgres, or any managed Postgres).

## Empty database (recommended on first provision)

Either:

```bash
npx prisma migrate deploy
```

or (prototype / empty DB without migration history):

```bash
npx prisma db push
```

`prisma generate` does **not** need a live database. `migrate deploy` / `db push` do.

## Vercel

1. Create a Postgres store (Vercel Storage → Postgres / Neon) and connect it to the project.
2. Ensure `DATABASE_URL` is set for Production (and Preview if needed). Prefer the **pooled** connection string for the Next.js app.
3. Run migrations once against the DB (local CLI with the URL, or a one-off job):

   ```bash
   DATABASE_URL="postgresql://..." npx prisma migrate deploy
   ```

4. Redeploy the project so the new env is picked up.

Never commit real credentials. Keep secrets in Vercel / `.env.local` only.
