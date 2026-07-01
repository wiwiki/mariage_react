# Anaïssia & Antoine — Wedding site

Single-page wedding site built with Vite + React. Text copy and a couple of
photos are pulled from a Strapi single type at runtime, with hardcoded
defaults (`src/content/defaultWeddingContent.js`) shown until that fetch
resolves — so the site never depends on Strapi being reachable to render.

## Development

```bash
npm install
npm run dev
```

`VITE_STRAPI_URL` (see `.env.development` / `.env.production`) points at the
Strapi Cloud backend used for content and media.

## Managing text content in Strapi

The frontend fetches `GET {VITE_STRAPI_URL}/api/wedding-page?populate=*`. To
make this endpoint return real content, create it once in the Strapi admin:

1. **Content-Type Builder → Create new single type** named `Wedding Page`
   (API ID: `wedding-page`).
2. Add these fields (all `Text` unless noted). Any field left empty falls
   back to the default copy already in the code, so you can fill this in
   gradually:

   | Field | Notes |
   |---|---|
   | `heroEyebrow`, `brideName`, `groomName`, `weddingDate`, `venueNameShort`, `venueLocationShort` | short strings |
   | `heroImage` | Media (single image) |
   | `storyEyebrow`, `storyScript`, `storyLede` | `storyScript` supports a `\n` line break |
   | `programmeEyebrow`, `programmeTitle` | |
   | `programmeItems` | Component (repeatable) — sub-fields `time`, `title`, `description`, all Text |
   | `venueEyebrow`, `venueTitle`, `venueLede`, `venuePhotoAlt`, `venueName`, `venueAddress`, `howToReachLabel`, `howToReachText`, `accommodationLabel`, `accommodationText`, `venueContactLabel`, `venueContactText`, `mapUrl`, `mapLinkLabel` | |
   | `venuePhoto` | Media (single image) |
   | `rsvpEyebrow`, `rsvpTitle`, `rsvpDeadlineText`, `rsvpButtonLabel`, `rsvpDateLine` | `rsvpTitle` supports a `\n` line break |
   | `footerScript`, `footerTagline` | |

3. **Settings → Users & Permissions → Roles → Public** — enable `find` on
   `Wedding Page` so the site can read it without auth.
4. Fill in the fields and **Publish** the entry.

Long free-text fields can be `Text` (long) instead of short `Text` — the
frontend renders them as plain strings either way.
