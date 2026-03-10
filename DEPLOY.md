# Deployment & Prisma migration steps

This project uses Prisma ORM and expects a Postgres database in production (we recommend Supabase). Images are uploaded to Cloudinary.

Prerequisites
- Node.js >= 18
- A Postgres database (Supabase, Railway, etc.)
- Cloudinary account (cloud name, api key, api secret)

Environment variables (set in your host / CI / Vercel):
- DATABASE_URL (postgres://...)
- CLOUDINARY_CLOUD_NAME
- CLOUDINARY_API_KEY
- CLOUDINARY_API_SECRET
- ADMIN_USER
- ADMIN_PASS
- ADMIN_SECRET
- NODE_ENV=production

Local dev (quick start using local sqlite)
- The repository's `prisma/schema.prisma` is set for PostgreSQL in production. For local experimentation you can override DATABASE_URL with a sqlite file, but for production use Postgres.

Install dependencies

```bash
npm install
# if you added new deps: cloudinary and @types/formidable are required
npm install cloudinary formidable
npm install --save-dev @types/formidable
```

Prisma setup (development)

1. Ensure `DATABASE_URL` points to a development database. For a quick local sqlite test you can use `sqlite:./dev.db` but the schema provider in `prisma/schema.prisma` is `postgresql` in this branch — change the `provider` to `sqlite` if you want to use sqlite locally, or create a local Postgres instance.

2. Run migrations and generate client:

```bash
npx prisma migrate dev --name init
npx prisma generate
```

Production migration (Supabase)

1. Provision a Supabase Postgres instance and get the connection string.
2. Set `DATABASE_URL` in your deployment environment.
3. In the deploy environment, ensure `prisma/schema.prisma` has `provider = "postgresql"` (it does in this branch).
4. Run migrations on the production DB:

```bash
npx prisma migrate deploy
npx prisma generate
```

Notes for CI / Vercel
- Set the environment variables in your project settings.
- As part of your deploy pipeline run `npx prisma migrate deploy` and `npx prisma generate` before starting the server.

Cloudinary
- Set `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` in env.
- The upload endpoint (`/api/admin/upload`) requires these.

Data migration from old JSON
- The old file-based content (admin-content.json) has been removed from runtime paths. If you have existing `data/admin-content.json`, you can migrate it into the DB by running a small script (we can provide one) that upserts the JSON into the `SiteContent` table (key: "site").

Testing after deploy
1. Visit `/admin` and login using ADMIN_USER/ADMIN_PASS.
2. Go to `/admin/content` to manage products.
3. Upload images (they will be stored on Cloudinary) and create products.
4. Visit public pages to confirm product rendering.

If you want, I can also add a seed/migration script to import an existing `data/admin-content.json` into the DB.
