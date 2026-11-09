# Pit500

Landing page + admin CMS. `backend/` = Express API (Render), `frontend/` = React + Vite + Tailwind (Vercel).

## Local run
1. `cd backend && cp .env.example .env` (fill MONGODB_URI, JWT_SECRET) then `npm install && npm run dev`
2. `cd frontend && cp .env.example .env && npm install && npm run dev`
3. Public site: http://localhost:5173 , admin: http://localhost:5173/admin
4. First sign-in: `admin_pit500` / the ADMIN_DEFAULT_PASSWORD value (default `Pit500@Admin2026`). Change it in the dashboard right away.

## Deploy
- Render (Web Service, root dir `backend`): build `npm install`, start `npm start`. Env: MONGODB_URI, JWT_SECRET, FRONTEND_URLS (your Vercel URL), ADMIN_DEFAULT_PASSWORD. In Atlas > Network Access allow Render (0.0.0.0/0 on the free tier).
- Vercel (root dir `frontend`, Vite preset): env VITE_API_URL = your Render URL (no trailing slash). `vercel.json` makes /admin work.
- Also update `PRODUCTION_FRONTEND` in backend/server.js if your Vercel URL differs from https://pit500.vercel.app.

## Image upload
Admin > any image field > Upload image. Files are resized to max 1920px, saved as WebP and stored in MongoDB (`images` collection), so they survive Render redeploys. Optional env `PUBLIC_API_URL` (Render URL) fixes the link base if your proxy reports the wrong host.
