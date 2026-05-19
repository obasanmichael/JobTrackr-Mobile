# Localization strategy (JobTrackr mobile)

The app currently ships **English-only UI strings** inline in components.

## When you need more than one locale

1. **Choose a catalog**: Recommended stack is **`expo-localization`** (device locale) + **`i18next`** + **`react-i18next`** with JSON bundles per language (`en`, `fr`, …).
2. **Bootstrap early**: Initialize i18n in `App.tsx` (before rendering navigation) so tab labels and headers translate consistently.
3. **Avoid scattering literals**: Prefer keys for tab titles, legal copy where duplicated, and accessibility strings that must stay in sync across platforms.
4. **RTL**: If you target RTL locales, validate **`HubNavRow`**, **`FloatingBottomTabBar`**, and form layouts after enabling RTL in Expo config.
5. **Legal URLs**: Keep localized **policy HTML/pages** on the server; env URLs can point to locale-specific paths if needed (`/en/privacy`, `/fr/confidentialité`).

## Single-locale releases

English-only is acceptable for initial TestFlight / Play internal tracks if your storefront listing matches the supported locales.
