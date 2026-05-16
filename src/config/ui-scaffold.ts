/**
 * Auth bypass for UI scaffolding (no SecureStore/session yet).
 *
 * - Dev: bypass **on** unless `EXPO_PUBLIC_UI_SCAFFOLD_AUTH_SKIP=0`.
 * - Production: bypass **only** if `EXPO_PUBLIC_UI_SCAFFOLD_AUTH_SKIP=1` (internal/staging builds).
 *
 * Ship App Store/production with bypass off; integrate real auth in RootNavigator.tsx.
 */
export const UI_SCAFFOLD_BYPASS_AUTHENTICATION =
  process.env.NODE_ENV === 'production'
    ? process.env.EXPO_PUBLIC_UI_SCAFFOLD_AUTH_SKIP === '1'
    : process.env.EXPO_PUBLIC_UI_SCAFFOLD_AUTH_SKIP !== '0';
