# Altoma Command Center — Handoff

**Date:** June 2026  
**Status:** Phase 1 complete · foundation stable  
**Repo path:** `F:\Altoma Founder OS Builder`  
**Package name:** `altoma-founder-os`

---

## 1. რა არის ეს პროექტი

**Altoma Command Center** (ყოფით Altoma Founder OS) — standalone Next.js 14 აპი, founder-ისთვის:

- იდეების/შენიშვნების capture (mobile-first)
- Desktop inbox processing
- Private vault
- Journal
- Project shells (`/os/[slug]`) — Phase 5-ში metrics + AI

ეს **არ არის** ATHLETIQ / WhaleIQ / AT Analytics codebase. ცალკე პროდუქტია, მაგრამ მომავალში მათგან snapshot-ებს მიიღებს.

**არქიტექტურული პრინციპი:** პროექტები data-driven არიან (`projects` table). ახალი პროექტი = `INSERT`, არა კოდის ცვლილება.

---

## 2. Stack

| Layer | Tech |
|-------|------|
| Frontend | Next.js 14 App Router, React 18, Tailwind |
| Backend | Next.js API routes + Server Components |
| DB + Auth | Supabase (Postgres, Magic Link, RLS) |
| Deploy | Vercel (planned) |
| State | `useState` only — no Redux/Zustand |

---

## 3. Phase 1 — რა მზადაა

### Pages (7)

| Route | Purpose |
|-------|---------|
| `/login` | Magic link auth, dark minimal |
| `/os` | Dashboard — project grid from DB, health dots, inbox badge |
| `/os/[slug]` | Project shell — name, health, notes list (Phase 5 placeholder) |
| `/os/new` | Quick capture — project chips, type, priority, tags |
| `/os/inbox` | `sent_to_desktop` notes, mark processed, archive |
| `/os/vault` | Notes where `project_slug = 'vault'` |
| `/os/journal` | Journal entries, full-screen compose |

### API Routes (10)

| Method | Route | Status |
|--------|-------|--------|
| GET | `/api/projects` | ✅ Live |
| GET/POST | `/api/notes` | ✅ Live |
| PATCH | `/api/notes/[id]` | ✅ Live |
| GET | `/api/notes/inbox` | ✅ Live |
| GET/POST | `/api/journal` | ✅ Live |
| PATCH | `/api/journal/[id]` | ✅ Live |
| GET | `/api/snapshots` | Stub → `[]` |
| POST | `/api/snapshots/push` | Stub → `501` (auth wired) |
| POST | `/api/brain` | Stub → placeholder string |

### Services (`lib/services/`)

| File | Methods | Wired |
|------|---------|-------|
| `projects.service.ts` | getAll, getBySlug, getByType | ✅ |
| `notes.service.ts` | create, list, update, sendToInbox, archive | ✅ (sendToInbox/archive unused in UI) |
| `journal.service.ts` | create, list, update | ✅ |
| `snapshots.service.ts` | getLatest, push, list | Stub |
| `founder-brain.service.ts` | query | Stub → `/api/brain` |
| `events.service.ts` | create, list | **No API route yet** |

### AI Layer (`lib/ai/`) — Phase 4 foundation

| File | Status |
|------|--------|
| `router.ts` | Stub — not imported anywhere |
| `brains/founder.brain.ts` | Stub |
| `brains/project.brain.ts` | Stub |

`founder-brain.service.ts` და `lib/ai/` **coexist** — Phase 4-ში service გადავა ai layer-ზე.

### Database (7 tables)

| Table | RLS |
|-------|-----|
| `projects` | ✅ authenticated read |
| `notes` | ✅ founder_only (user_id) |
| `journal_entries` | ✅ founder_only_journal |
| `project_snapshots` | ✅ founder read |
| `ai_context_blocks` | ✅ founder read/write |
| `events` | ✅ founder read/write |

**Seed projects:** athletiq, whaleiq, at_analytics, altoma, vault, future_projects

---

## 4. Phase 1 — რა არ არის (განზრახ)

- Real AI calls
- External connector snapshot push (ATHLETIQ/WhaleIQ/AT Analytics)
- Voice recording
- Push notifications
- `/api/events` route
- Metrics UI on `/os/[slug]`
- Global state library

---

## 5. სწრაფი გაშვება

```bash
cd "F:\Altoma Founder OS Builder"
npm install
cp .env.local.example .env.local
# შეავსე 4 env var (ქვემოთ)
npm run dev
```

Supabase Dashboard:

1. **Auth** → Email Magic Link ON
2. **Redirect URLs:** `http://localhost:3000/auth/callback` (+ production URL)
3. **SQL** — იხ. Database Setup ქვემოთ

---

## 6. Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
FOUNDER_EMAIL=you@yourdomain.com
ALTOMA_INTERNAL_API_KEY=<random-secret>
```

| Var | Purpose |
|-----|---------|
| `FOUNDER_EMAIL` | API routes reject non-founder users (403) |
| `ALTOMA_INTERNAL_API_KEY` | External products POST to `/api/snapshots/push` |

**Vercel deploy:** იგივე 4 ცვლადი + production auth callback URL.

---

## 7. Database Setup

### Fresh Supabase project

```sql
-- Run once:
supabase/schema-full.sql
```

შეიცავს: 7 table, seed, indexes, RLS policies.

### Existing DB (უკვე გაშვებული schema.sql)

```sql
-- Step 1 (თუ ჯერ არ გაქვს):
supabase/schema.sql

-- Step 2:
supabase/schema-additions.sql
-- (scope column, events table, RLS policies)
```

**არ გაუშვა** `schema-full.sql` არსებულ DB-ზე — duplicate table error.

---

## 8. ავთენტიფიკაცია

| Layer | Mechanism |
|-------|-----------|
| Pages `/os/*` | `middleware.ts` → no session → `/login` |
| API routes | `requireSession()` + `FOUNDER_EMAIL` check |
| `/api/snapshots/push` | **API key OR session** (ორივე არა) |

Snapshot push auth logic:

- Internal product (Phase 3): header `x-altoma-api-key`
- Founder manual push: Supabase session cookie
- ერთ-ერთი საკმარისია

---

## 9. არქიტექტურა

```
app/
  os/           → pages (server + client)
  api/          → thin routes → lib/services/
  auth/callback → magic link handler

lib/
  types.ts      → all table interfaces
  services/     → Supabase data access
  ai/           → Phase 4 stubs (not wired)
  supabase/     → client, server, middleware helpers
  api-auth.ts   → requireSession, parseTags
  utils.ts      → NOTE_TYPES, healthColor, detectSource

components/     → OsLayout, ProjectCard, NoteCard, BottomNav, LoginForm
```

**Data flow:**

- Server pages (`/os`, `/os/[slug]`) → services პირდაპირ
- Client pages (inbox, vault, journal, new) → `fetch('/api/...')`

**Visual:** dark only — bg `#0A0A0A`, accent `#F5A623`, Inter font, mobile bottom nav.

---

## 10. ახალი პროექტის დამატება

```sql
INSERT INTO projects (slug, name, icon, color, project_type, sort_order)
VALUES ('new-project', 'New Project', '⚡', '#F59E0B', 'product', 7);
```

კოდის ცვლილება არ სჭირდება. Dashboard, `/os/new`, `/os/[slug]` ავტომატურად განახლდება.

დამალვა: `UPDATE projects SET status = 'archived' WHERE slug = '...';`

---

## 11. Test Flows (smoke test)

### Mobile

1. DevTools mobile view ან ტელეფონი (`http://<local-ip>:3000`)
2. `/login` → magic link
3. `/os/new` → note → **Save + Send to Desktop**
4. `/os/inbox` → note ჩანს

### Desktop inbox

1. `/os/inbox` → note from mobile
2. **Mark processed** → ქრება default view-დან
3. Supabase `notes` table → `processed = true`

### Journal

1. `/os/journal` → **+ New Entry**
2. Save → entry დღევანდელი თარიღით

### Build

```bash
npm run build   # უნდა გაივიდეს exit 0
```

---

## 12. Phase Roadmap

| Phase | Focus | Key work |
|-------|-------|----------|
| **1** ✅ | Foundation | Pages, services, schema, stubs |
| **2** | — | (not spec'd yet) |
| **3** | Snapshots | Implement `snapshots.service.push()`, wire `/api/snapshots/push`, `getLatest()` from DB, `/api/events` |
| **4** | AI | Wire `lib/ai/router` → brains, `/api/brain`, `ai_context_blocks` |
| **5** | Project hub | `/os/[slug]` metrics + AI context (URL unchanged) |

### Phase 3 snapshot push (როგორ იმუშავებს)

External product POST:

```http
POST /api/snapshots/push
x-altoma-api-key: <ALTOMA_INTERNAL_API_KEY>
Content-Type: application/json

{ "project_slug": "athletiq", "health": "green", "metrics": { ... } }
```

→ `project_snapshots` insert → dashboard health dot განახლდება `getLatest(slug)`-ით.

---

## 13. ცნობილი technical debt (არა blocker)

| Item | Notes |
|------|-------|
| `notes.sendToInbox()` / `archive()` | Service-შია, UI generic PATCH იყენებს |
| `projects.getByType()` | Unused |
| `events.service.ts` | No API route |
| `lib/ai/` | Orphan stubs — Phase 4-ს ელოდება |
| README duplicate sections | Setup + Test Flows ორჯერაა — harmless |
| `package.json` name | `altoma-founder-os` vs Command Center branding |

---

## 14. ფაილების სრული სია

```
supabase/
  schema.sql              # base (existing DB step 1)
  schema-additions.sql    # scope, events, RLS (existing DB step 2)
  schema-full.sql         # fresh install only

lib/
  types.ts
  api-auth.ts
  utils.ts
  services/
    projects.service.ts
    notes.service.ts
    journal.service.ts
    snapshots.service.ts
    founder-brain.service.ts
    events.service.ts
  ai/
    router.ts
    brains/founder.brain.ts
    brains/project.brain.ts
  supabase/
    client.ts
    server.ts
    middleware.ts

app/
  layout.tsx, page.tsx, globals.css
  login/page.tsx
  auth/callback/route.ts
  os/page.tsx
  os/[slug]/page.tsx
  os/new/page.tsx, NewNoteClient.tsx
  os/inbox/page.tsx
  os/vault/page.tsx
  os/journal/page.tsx
  api/projects/route.ts
  api/notes/route.ts, [id]/route.ts, inbox/route.ts
  api/journal/route.ts, [id]/route.ts
  api/snapshots/route.ts, push/route.ts
  api/brain/route.ts

components/
  OsLayout.tsx, ProjectCard.tsx, NoteCard.tsx
  BottomNav.tsx, LoginForm.tsx

middleware.ts
.env.local.example
README.md
HANDOFF.md          ← ეს ფაილი
```

---

## 15. შემდეგი ნაბიჯები (რეკომენდაცია)

1. Supabase project შექმნა + `schema-full.sql` გაშვება
2. `.env.local` შევსება
3. `npm run dev` → smoke tests (სექცია 11)
4. Vercel deploy + production redirect URL
5. Phase 3 დაწყება — `snapshots.service.push()` იმპლემენტაცია

---

## 16. წესები შემდეგი developer-ისთვის

- პროექტები **არასოდეს** დაამატო ENUM-ით ან frontend constant-ით
- `icon` + `project_type` — DB fields, Phase 2-3 UI გაფართოებს
- `/os/[slug]` URL **არ შეცვალო** — Phase 5 content only
- `lib/ai/` **არ წაშალო** — Phase 4 wiring
- ATHLETIQ / WhaleIQ / AT Analytics codebase **არ შეეხო**
- Phase 1-ში: additive patches only, no scope creep

---

*Phase 1 foundation დახურულია. Build passes. Ready for Supabase setup + deploy.*
