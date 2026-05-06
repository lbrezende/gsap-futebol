# gsap-futebol — FIFA 2026 ticket sales

Next.js 16 + Tailwind 4 + GSAP ScrollTrigger + Prisma 6 + Neon.

## Header GSAP

The hero pins while two videos play full-through on scroll:

- `public/jogador1.mp4` — first half (player prepares to kick)
- `public/jogador2.mp4` — second half (ball flies + celebration)
- "BRASIL EXA" overlay crossfades between them

Drop both files in `public/` with those exact names.

## Local dev

```bash
pnpm install
cp .env.example .env       # fill in DATABASE_URL
pnpm exec prisma db push
pnpm exec tsx prisma/seed.ts
pnpm dev
```

## Deploy

Connected to Vercel + Neon. Pushes to `main` auto-deploy.

## Stack

- Next.js 16 (App Router)
- Tailwind CSS 4
- GSAP 3 + ScrollTrigger (pinned scroll-driven video)
- Prisma 6 + Neon (Postgres serverless)
- React Server Components (DB → page in one pass)
