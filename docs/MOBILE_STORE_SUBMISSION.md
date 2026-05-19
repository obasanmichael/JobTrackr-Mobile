# JobTrackr mobile — store submission checklist

Use this when preparing **App Store Connect**, **Google Play Console**, and **EAS Build / Submit**.

## Legal URLs & in-app parity

Configure these in `.env` / EAS secrets as **`EXPO_PUBLIC_*`** (see `.env.example`). The **More → Settings → Privacy, terms & support** screen reads them at runtime.

| Variable | Purpose |
|----------|---------|
| `EXPO_PUBLIC_PRIVACY_POLICY_URL` | HTTPS privacy policy |
| `EXPO_PUBLIC_TERMS_OF_SERVICE_URL` | HTTPS terms |
| `EXPO_PUBLIC_ACCOUNT_DELETION_URL` | Account deletion instructions or request flow (Apple expects a clear path) |
| `EXPO_PUBLIC_SUPPORT_URL` | Preferred: HTTPS contact / help center |
| `EXPO_PUBLIC_SUPPORT_EMAIL` | Used when `EXPO_PUBLIC_SUPPORT_URL` is unset (`mailto:` link) |

## App Privacy Nutrition Labels (iOS)

Answer based on **actual behavior** of this codebase and dependencies. Treat this table as a starting point — verify each release after dependency changes.

**Likely categories (confirm before submitting)**

| Data / usage | Detail |
|--------------|--------|
| **Contact info** | Email and name when user registers or signs in (sent to your backend via HTTPS). |
| **User content** | Job applications, resumes (document picker uploads), notes, reminders — tied to account when API is enabled. |
| **Identifiers** | Auth/session tokens stored locally (`expo-secure-store`). |
| **Diagnostics** | Optional: `@react-native-community/netinfo` exposes connectivity state on device only for UI (offline banner); no third-party analytics SDK is wired in this repo snapshot. |

**SDKs / modules to disclose as linked frameworks where applicable**

- **Expo runtime & configured plugins**: `expo`, `expo-secure-store`, `expo-document-picker`, `@react-native-community/datetimepicker`, `expo-haptics`, etc.
- **Networking**: `axios` — requests to `EXPO_PUBLIC_API_URL`.
- **Secure storage**: `expo-secure-store` — sensitive tokens.

Do **not** copy boilerplate “we collect everything” answers if you only persist auth tokens and user-entered job data.

## Google Play — Data safety form

Mirror the same honesty as iOS:

- Declare account registration data (email, password handling via backend).
- Declare files users attach (resumes).
- Declare network calls to your API.
- Declare NetInfo **only if** you treat connectivity telemetry as collected data (currently used for UI banner only).

## Versioning & build numbers

- **`app.json` `version`**: marketing version string (e.g. `1.0.0`).
- **`eas.json`**: `"appVersionSource": "remote"` with **`production.autoIncrement`** — store-facing build numbers are managed remotely during EAS production builds.
- Before each submission: bump **`expo.version`** when you ship user-visible release notes; rely on EAS for monotonic Android `versionCode` / iOS build increments unless you pin them explicitly.

## Screenshots & preview media

See **`assets/store/README.md`** for recommended dimensions and folder convention.

## Expo / privacy manifests

Newer Apple tooling expects accurate privacy manifests from SDK vendors. After upgrading Expo SDK or native modules, re-check Expo’s release notes for **Privacy Manifest / required reason API** updates and adjust App Privacy answers accordingly.
