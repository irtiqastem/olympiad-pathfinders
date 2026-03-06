# Irtiqa STEM — Olympiad Pathfinders

A free, non-profit platform providing structured Olympiad preparation and STEM guidance for Pakistan's students in grades 6–9.

## Tech Stack

- **React + TypeScript** — frontend framework
- **Vite** — build tool
- **Tailwind CSS + shadcn/ui** — styling and components
- **Supabase** — auth, database, and real-time
- **Framer Motion** — animations

## Features

- **IMO & IOI Tracks** — structured roadmaps from school level to international competition
- **Practice Problems** — filterable problem bank with difficulty ratings
- **Student Dashboard** — submission tracking and achievement badges
- **Admin Panel** — restricted to `arhammukhtar777@gmail.com`; manage problems, review submissions, publish blog posts, and add scholarships
- **STEM Hub & Scholarships** — curated resources and funding opportunities

## Getting Started

```bash
# 1. Clone the repo
git clone <your-repo-url>
cd <project-folder>

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
# Fill in your Supabase project URL and anon key

# 4. Run the development server
npm run dev
```

## Environment Variables

| Variable | Description |
|---|---|
| `VITE_SUPABASE_URL` | Your Supabase project URL |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Your Supabase anon/public key |

## Admin Access

The admin panel at `/admin` is locked to a single authorised email address. Only `arhammukhtar777@gmail.com` can access it after signing in. Any other user attempting to visit `/admin` will be redirected to the home page.

## Database

SQL migrations are in `supabase/migrations/`. Run them against your Supabase project to set up the required tables (`problems`, `submissions`, `profiles`, `blog_posts`, `scholarships`, `user_roles`).

## Deployment

This project can be deployed on any static hosting platform (Vercel, Netlify, Cloudflare Pages, etc.) that supports Vite builds.

```bash
npm run build   # outputs to /dist
```
