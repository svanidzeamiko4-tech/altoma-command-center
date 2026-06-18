# Altoma Command Center — Deployment Guide

## Vercel Setup

### 1. Import repo
- Connect GitHub repo to Vercel
- Framework: Next.js (auto-detected)
- Root directory: ./ (default)

### 2. Environment variables
Add these in Vercel → Settings → Environment Variables:

  NEXT_PUBLIC_SUPABASE_URL        → Supabase project URL
  NEXT_PUBLIC_SUPABASE_ANON_KEY   → Supabase anon/public key
  FOUNDER_EMAIL                   → founder's email address
  ALTOMA_INTERNAL_API_KEY         → generate a secure random string

### 3. Supabase Auth callback URL
In Supabase → Authentication → URL Configuration:

  Site URL:
    https://your-vercel-domain.vercel.app

  Redirect URLs (add both):
    https://your-vercel-domain.vercel.app/auth/callback
    http://localhost:3000/auth/callback

This is required for magic link to work in production.
Without this, magic link redirects to localhost after click.

### 4. Deploy
Push to main branch → Vercel auto-deploys.
First deploy: check Function Logs for any missing env var errors.

## Post-deploy checklist
- [ ] Magic link email received
- [ ] Magic link opens production URL (not localhost)
- [ ] /os loads after login
- [ ] /os/new → save note → appears in /os/inbox
- [ ] /os/[slug] routes load (athletiq, whaleiq, at-analytics, vault)
- [ ] Logout redirects to /login
- [ ] ALTOMA_INTERNAL_API_KEY set (even if push not used yet)

## Local development
  cp .env.local.example .env.local
  npm install
  npm run dev

For mobile testing on same WiFi:
  npm run dev -- -H 0.0.0.0
  Open http://<PC-IP>:3000 on phone
  Magic link must be opened on the same phone browser.

## Adding a new project (no code change needed)
  INSERT INTO projects (slug, name, icon, color, project_type, sort_order)
  VALUES ('new-slug', 'Name', '⚡', '#F59E0B', 'product', 7);

## Phase notes
  lib/ai/        — Phase 4 stub. Not wired. Do not remove.
  events.service — Phase 3/4 foundation. No API route yet.
  /api/brain     — returns placeholder. AI not active.
  /api/snapshots/push — accepts x-altoma-api-key (no session needed).
