# Store listing assets

Place finalized assets here before uploading to App Store Connect / Play Console.

## Screenshots (reference sizes)

**iPhone (required on App Store)**

- 6.7" (1290 × 2796 or 1284 × 2778)
- 6.5" (1242 × 2688 or similar legacy)
- 5.5" (1242 × 2208) if supporting legacy devices

**iPad**, if `supportsTablet` remains enabled in `app.json`, prepare **13" / 12.9"** screenshots per Apple’s current matrix.

**Android**

- Phone: at least **1080 × 1920** (or higher) depending on Play requirements at submit time.
- Tablet (if tablet-supported): large-format captures.

Use consistent **JobTrackr** branding; avoid staging URLs or personal data in screenshots.

## Preview video

Optional but recommended for conversion:

- Short vertical demo (tab navigation → Applications → Quick add → Legal/Support path).
- Keep under platform maximum duration (check Apple/Google docs yearly).

## Naming & versioning

- **Display name**: `expo.name` in **`app.json`** (shown under icon as **JobTrackr**).
- **Slug / bundle IDs**: unchanged identifiers remain stable across releases (`slug`, `ios.bundleIdentifier`, Android package when configured).

Commit screenshots as PNG/WebP exports from simulator capture or Maestro/screenshot tooling, binary assets may be gitignored locally; adjust `.gitignore` if you version them.
