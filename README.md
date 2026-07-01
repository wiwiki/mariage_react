# Anaïssia & Antoine — Wedding site

Vite + React site with two parts:

- **Landing page** (`/`) — text copy and a couple of photos are pulled from six
  Strapi single types at runtime, with hardcoded defaults
  (`src/content/defaultWeddingContent.js`) shown until those fetches resolve —
  so the page never depends on Strapi being reachable to render.
- **Smart RSVP flow** (`/rsvp`) — guests enter a 6-digit household code, then
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
| `/rsvp` | `src/pages/rsvp/RsvpCodeEntry.jsx` | 6-digit code entry |
| `/rsvp/form` | `src/pages/rsvp/RsvpForm.jsx` | Editable guest form, or a locked summary if already responded |
| `/rsvp/merci` | `src/pages/rsvp/RsvpConfirmation.jsx` | Confirmation page after submitting |

## Development

```bash
npm install
npm run dev
```

`VITE_STRAPI_URL` (see `.env.development` / `.env.production`) points at the
Strapi backend used for content, media, and the RSVP API.

## Managing text content in Strapi

The frontend fetches from **six single types**, one per landing-page section,
each at `GET {VITE_STRAPI_URL}/api/<slug>?populate=*`. Any field left empty
in any of them falls back to the default copy in
`src/content/defaultWeddingContent.js`, and one section failing/being
unpublished doesn't affect the others — so this can be filled in gradually,
type by type.

| Single type (API ID) | Fields |
|---|---|
| `hero-banner` | `heroEyebrow`, `brideName`, `groomName`, `weddingDate`, `venueNameShort`, `venueLocationShort`, `heroImage` (media) |
| `story` | `storyEyebrow`, `storyScript` (supports a `\n` line break), `storyLede` |
| `programme` | `programmeEyebrow`, `programmeTitle`, `programmeItems` (repeatable component — `time`, `title`, `description`) |
| `venue` | `venueEyebrow`, `venueTitle`, `venueLede`, `venuePhotoAlt`, `venueName`, `venueAddress`, `howToReachLabel`, `howToReachText`, `accommodationLabel`, `accommodationText`, `venueContactLabel`, `venueContactText`, `mapUrl`, `mapLinkLabel`, `venuePhoto` (media) |
| `rsvp` | `rsvpEyebrow`, `rsvpTitle` (supports a `\n` line break), `rsvpDeadlineText`, `rsvpButtonLabel`, `rsvpDateLine` |
| `footer` | `footerScript`, `footerTagline` |

For each single type: enable `find` under **Settings → Users & Permissions →
Roles → Public** so the site can read it without auth, fill in the fields,
and **Publish** the entry.

## RSVP flow

Two Strapi custom routes back the `/rsvp` flow:

| Method | Route | Purpose |
|---|---|---|
| POST | `/api/rsvp/verify` | `{ code }` → `{ invitation, guests }`, or `404 { error: "invalid_code" }` |
| POST | `/api/rsvp/submit` | `{ code, guests[], message }` → `{ success: true }`, or `409 { error: "already_responded" }` if the household already responded |

The verified code + invitation/guests are kept in `sessionStorage` (see
`src/lib/rsvpSession.js`) between the code-entry step and the form step, and
cleared once submit succeeds — so a refresh on `/rsvp/form` doesn't force
retyping the code, but nothing survives closing the tab.

Whether the form is editable or shown as a locked summary is driven by
`invitation.rsvpStatus` (`"pending"` vs anything else) — note this is
`rsvpStatus` on the wire, not `status` as an earlier version of the spec for
this feature described.

**Known backend gap:** the `message` field sent to `/api/rsvp/submit` is
accepted (`200 { success: true }`) but is not currently persisted to
`invitation.messageToCouple` — confirmed by submitting and re-verifying the
same code. This needs a fix on the Strapi side; nothing to change here.
