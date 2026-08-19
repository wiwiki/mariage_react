# Anaïssia & Antoine — Wedding site

Vite + React site with two parts:

- **Landing page** (`/`) — all text and photos are hardcoded in the section
  components (the copy is final), except the **programme** section, which is
  pulled from the Supabase `programme` table at runtime with a hardcoded
  fallback (`src/content/defaultProgramme.js`) — so the page never depends on
  the backend being reachable to render.
- **Smart RSVP flow** (`/rsvp`) — guests enter a 6-character household code (uppercase letters and digits, e.g. 58FXFP), then
  fill in an editable guest form (attendance, meal choice, allergies, message
  to the couple) or see a locked read-only summary if they already responded.

Routing uses `HashRouter` (URLs like `/#/rsvp`), not `BrowserRouter` —
GitHub Pages serves static files and can't rewrite paths server-side, so a
direct link or refresh on `/rsvp/form` would 404 with normal path-based
routing. Because of this, the landing page's nav links (`Histoire`,
`Programme`, `Lieu`, `RSVP`) scroll to their section via JS instead of native
`href="#histoire"` anchors — `HashRouter` owns the URL hash for routing, so a
plain hash link would be read as a route change instead of a same-page jump.

## Routes

| Path | Component | Purpose |
|---|---|---|
| `/` | `src/pages/LandingPage.jsx` | The wedding page itself |
| `/rsvp` | `src/pages/rsvp/RsvpCodeEntry.jsx` | 6-character code entry |
| `/rsvp/form` | `src/pages/rsvp/RsvpForm.jsx` | Editable guest form, or a locked summary if already responded |
| `/rsvp/merci` | `src/pages/rsvp/RsvpConfirmation.jsx` | Confirmation page after submitting |

## Development

```bash
npm install
npm run dev
```

Two env vars (see `.env.development` / `.env.production`) point at the Supabase
project that serves both the programme content and the RSVP API:

| Variable | Purpose |
|---|---|
| `VITE_SUPABASE_URL` | Project URL |
| `VITE_SUPABASE_KEY` | Publishable (`sb_publishable_…`) key |

The publishable key is designed to ship to browsers and is deliberately
committed — row-level security is what protects the data, not key secrecy.
`.env.production` is committed and read at build time, so there are no GitHub
secrets to configure for a deploy.

### ⚠️ Local dev talks to the live production database

There is no local backend. Both env files point at the same hosted project, so
`npm run dev` reads and writes the real wedding data.

A submitted RSVP is irreversible from the UI: `/submit` flips that household's
`rsvp_status` to `confirmed`, writes their guest list, and every later attempt
returns `409` — the real guest is locked out and only manual SQL can undo it.

So **only ever submit with the dedicated `TEST01` row**, and never type a code
you did not create yourself. `/verify` is read-only and safe on any code. To
exercise the 409 path, submit `TEST01` twice rather than reusing a real code.

```sql
-- create it once
insert into invitations (code, household_name, max_guests, rsvp_status)
values ('TEST01', 'Test household', 4, 'pending');

-- reset between runs
update invitations set
  rsvp_status = 'pending', guests = '[]'::jsonb, responded_at = null,
  message_to_couple = null, count_adult = 0, count_child = 0, count_baby = 0,
  count_standard = 0, count_vegetarian = 0, count_vegan = 0, count_gluten_free = 0
where code = 'TEST01';
```

## Managing text content

Only the **programme** section is still backend-driven. The frontend reads one
row via PostgREST at `GET {VITE_SUPABASE_URL}/rest/v1/programme?select=*`; if
the request fails or the table is empty, the default copy in
`src/content/defaultProgramme.js` is shown instead.

| Table | Columns |
|---|---|
| `programme` | `programme_items` (jsonb array of `{time, title, description}`); `programme_eyebrow` and `programme_title` exist but are unread — the section heading is hardcoded in `ProgrammeSection.jsx` |

Postgres columns are snake_case and the app is camelCase. `src/lib/supabase.js`
is the **only** file that knows about that: it maps `programme_items` →
`programmeItems` on the way out, so nothing downstream — including the
`sessionStorage` cache — ever sees a snake_case key. The cache key is versioned
(`programme-content-v2`) so a shape change can't hand a returning visitor a
stale payload.

The `programme` table needs a row-level security policy allowing anonymous
`select` so the site can read it without auth. `invitations` deliberately has
no such policy: it is still reachable through PostgREST, but RLS filters every
row out, so the request returns `200 []` and no guest data ever reaches a client
key. Granting `invitations` a permissive select policy would expose every
household at once — all RSVP access must stay behind the Edge Function.

Every other section (hero, story, venue, RSVP intro, footer) is hardcoded in
its component under `src/components/sections/` — editing that copy is a code
change. All photos are bundled locally by Vite, so no image depends on an
external host.

## RSVP flow

An `rsvp` Supabase Edge Function backs the `/rsvp` flow. It is the only way in:
`invitations` is not readable by any client key, and the function never returns
`code` or `invite_link`.

| Method | Route | Purpose |
|---|---|---|
| POST | `/functions/v1/rsvp/verify` | `{ code }` → `{ invitation, guests }`, or `404 { error: "invalid_code" }` |
| POST | `/functions/v1/rsvp/submit` | `{ code, guests[], message }` → `{ success: true }`, `404 { error: "invalid_code" }`, or `409 { error: "already_responded" }` if the household already responded |

`invitation` carries `householdName`, `maxGuests`, `rsvpStatus`,
`messageToCouple`, `respondedAt` and the seven `count*` fields, all camelCase.

The verified code + invitation/guests are kept in `sessionStorage` (see
`src/lib/rsvpSession.js`) between the code-entry step and the form step, and
cleared once submit succeeds — so a refresh on `/rsvp/form` doesn't force
retyping the code, but nothing survives closing the tab.

Whether the form is editable or shown as a locked summary is driven by
`invitation.rsvpStatus` (`"pending"` vs anything else) — note this is
`rsvpStatus` on the wire, not `status`.

Submitting is a **full replace**: every used slot is sent as a plain object and
becomes the household's complete guest list. `/submit` rejects an
already-confirmed household *before* writing, so a rejected retry cannot clear
an existing guest list.

Meal choices are `standard`, `vegetarian` and `vegan` (`MEAL_OPTIONS` in
`RsvpForm.jsx`), matching the `count_standard` / `count_vegetarian` /
`count_vegan` columns. Guests describe actual allergies in the separate
free-text "Allergies / restrictions" field, which is stored per guest rather
than counted. Age groups (`adult`, `child`, `baby`) feed `count_adult` /
`count_child` / `count_baby`, and only *attending* guests are counted.

## Deploying

`.github/workflows/deploy.yml` builds and publishes to GitHub Pages on every
push to `main`, so a merge goes live immediately. The Pages source must stay set
to **GitHub Actions** — pointing it at a branch instead serves the raw repo and
the site renders blank.
