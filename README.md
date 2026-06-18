# Altoma Command Center — Phase 1

Founder Brain platform — capture notes, process inbox, journal, and project shells ready for Phase 5.

**Stack:** Next.js 14 · Supabase · Tailwind · TypeScript · Vercel

---

## Local Setup

1. **Install dependencies**
   ```bash
   npm install
   cp .env.local.example .env.local
   ```

2. **Create a Supabase project** at [supabase.com](https://supabase.com)

3. **Copy API credentials** — Supabase Dashboard → **Project Settings** → **API**
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL` in `.env.local`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY` in `.env.local`

4. **Set founder auth**
   - `FOUNDER_EMAIL` → your founder login email (magic link)

5. **Set internal API key**
   - `ALTOMA_INTERNAL_API_KEY` → any long random secret (e.g. `openssl rand -hex 32`)

6. **Run database schema** — Supabase Dashboard → **SQL Editor**
   - Paste and run `supabase/schema-full.sql` (fresh project only)

7. **Enable auth** — Authentication → Providers → Email → Magic Link ON

8. **Add redirect URL** — Authentication → URL Configuration
   - `http://localhost:3000/auth/callback`

9. **Start dev server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000)

If Supabase env vars are missing, the app shows a setup page instead of a cryptic error.

---

## Local auth troubleshooting

### Magic link rate limit

Supabase limits how many auth emails can be sent per hour. If you see **"email rate limit exceeded"**:

- Wait before requesting another magic link (often 1 hour on free tier)
- Use **Dev password login** on `/login` during local development (see below)
- Do not retry old magic links — request a fresh one after the limit resets

### Same-browser PKCE requirement

Magic links use PKCE. The `code_verifier` cookie is stored in the **same browser** where you clicked "Send magic link".

- Open the email link in that same browser (not your phone if you requested on desktop)
- Avoid in-app email browsers (Gmail/Outlook) — copy link into Chrome/Edge/Firefox
- Old links sent **before** the PKCE cookie fix will not work — request a new link

### Dev password login (development only)

When `npm run dev`, `/login` shows **Dev password login** at the bottom. This is hidden in production builds.

**Set a password for the founder user in Supabase:**

1. Supabase Dashboard → **Authentication** → **Users**
2. If no user exists: **Add user** → enter `FOUNDER_EMAIL` + a password → create
3. If user exists (from prior magic link): open the user → **Send password recovery** or reset password via dashboard
4. Ensure **Authentication** → **Providers** → **Email** is enabled (password sign-in uses the Email provider)

**Test locally:**

1. `npm run dev`
2. Open `http://localhost:3000/login`
3. Use **Dev password login** with founder email + password
4. Redirect to `/os` — session cookies set via `@supabase/ssr` browser client

Magic link remains available when rate limits allow.

---

## Setup

```bash
npm install
cp .env.local.example .env.local
# Fill: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, FOUNDER_EMAIL
npm run dev
```

1. Run `supabase/schema.sql` in Supabase SQL Editor
2. Enable Email Magic Link auth
3. Add redirect URL: `http://localhost:3000/auth/callback`

---

## File map

| Path | Purpose |
|------|---------|
| `supabase/schema.sql` | Full schema (5 tables + seed) |
| `lib/types.ts` | Project, Note, JournalEntry, ProjectSnapshot, AiContextBlock |
| `lib/services/projects.service.ts` | getAll, getBySlug, getByType |
| `lib/services/notes.service.ts` | create, list, update, sendToInbox, archive |
| `lib/services/journal.service.ts` | create, list, update |
| `lib/services/snapshots.service.ts` | Phase 3 stub |
| `lib/services/founder-brain.service.ts` | Phase 4 stub |
| `app/os/page.tsx` | Dashboard grid |
| `app/os/[slug]/page.tsx` | Project shell (name + notes) |
| `app/os/new/` | Quick capture |
| `app/os/inbox/` | Desktop inbox |
| `app/os/vault/` | Vault notes |
| `app/os/journal/` | Journal |
| `app/api/snapshots/` | GET empty array (stub) |
| `app/api/snapshots/push/` | POST 501 (stub) |
| `app/api/brain/` | POST placeholder response |

---

## Mobile test instructions

1. `npm run dev` on your machine
2. On phone (same Wi-Fi): `http://<local-ip>:3000`
3. Add `http://<local-ip>:3000/auth/callback` to Supabase redirects
4. Sign in via magic link
5. Dashboard shows 6 projects from DB with health dot (unknown in Phase 1)
6. Tap a project → `/os/[slug]` shell with notes list
7. FAB or **+ Note** → quick capture, source auto-detects `mobile`
8. **Save + Send to Desktop** → appears in inbox
9. Bottom nav: Home · Inbox · New · Vault · Journal

---

## Desktop inbox test flow

1. Sign in at `/login`
2. `/os/new` → create note → **Save + Send to Desktop**
3. `/os/inbox` → note shows project badge, type, priority, content, tags
4. **Mark processed** → disappears from default view
5. **Show processed** → reappears
6. **Archive** → status archived
7. Dashboard inbox badge decrements

---

## Journal test flow

1. `/os/journal` → **+ New Entry**
2. Full-screen textarea, date = today
3. Save → entry listed newest first
4. Cancel dismisses without saving

---

## How to add a new project in future

**Rule: new project = one INSERT, no code change.**

```sql
insert into projects (slug, name, icon, color, project_type, sort_order)
values ('my_new_product', 'My New Product', '⚡', '#22D3EE', 'product', 7);
```

Refresh — dashboard, `/os/new` selector, `/os/[slug]`, and badges update automatically from DB.

To hide: `update projects set status = 'archived' where slug = 'my_new_product';`

---

## How Phase 3 snapshot push will work

External products (ATHLETIQ, WhaleIQ, AT Analytics) will POST metrics to `/api/snapshots/push` with `{ project_slug, health, metrics }`. The route will call `snapshots.service.push()`, which inserts a row into `project_snapshots` with the top-level `health` field (`green` | `yellow` | `red` | `unknown`) and a `metrics` JSON blob. The dashboard reads `getLatest(slug)` per project for fast health-dot rendering without parsing metrics. Phase 1 returns 501 on push and empty snapshots — the URL and service interface are already in place.

---

## Schema highlights

- `project_snapshots.health` — top-level for fast dashboard render
- `ai_context_blocks.confidence` — 0.0–1.0 for AI output quality tracking (Phase 4)
- `notes.type/priority/status/source` — plain `text`, not enums
- `/os/[slug]` — stable URL; Phase 5 adds metrics + AI without route changes

---

## Deploy (Vercel)

Env vars: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `FOUNDER_EMAIL`

Production redirect: `https://your-app.vercel.app/auth/callback`

---

## Database Setup

**Fresh install:** run `supabase/schema-full.sql`

**Existing DB:**

- Step 1: `supabase/schema.sql`
- Step 2: `supabase/schema-additions.sql`

---

## Required env vars (.env.local)

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
FOUNDER_EMAIL=
ALTOMA_INTERNAL_API_KEY=
```

---

## Architecture Notes

- `lib/ai/` — Phase 4 stub. Not wired. Do not remove.
- `events.service.ts` — Phase 3/4 foundation. No API route yet.
- `/api/brain` — returns placeholder. AI not active.
- `/api/snapshots/push` — accepts `x-altoma-api-key` (no session needed).

---

## Test Flows

**Mobile:**

1. Open on phone or DevTools mobile view
2. `/login` → send magic link
3. `/os/new` → capture note, tap "Save + Send to Desktop"
4. Confirm note appears in `/os/inbox`

**Desktop inbox:**

1. Open `/os/inbox`
2. Confirm note from mobile appears
3. Click "Mark processed"
4. Confirm `processed=true` in Supabase table

**Journal:**

1. Open `/os/journal`
2. Click "+ New Entry"
3. Write content, save
4. Confirm entry appears with today's date

---

## Adding a new project (future)

```sql
INSERT INTO projects (slug, name, icon, color, project_type, sort_order)
VALUES ('new-project', 'New Project', '⚡', '#F59E0B', 'product', 7);
```

No code change needed.
