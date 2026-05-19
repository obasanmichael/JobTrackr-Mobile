/**
 * UI scaffold: sign in without JWT using fixtures (development / design QA only).
 * Safety: never active in production bundles — `__DEV__` must be true and the env flag set.
 */
export const UI_SCAFFOLD_BYPASS_AUTHENTICATION =
  typeof __DEV__ !== 'undefined' && __DEV__ && process.env.EXPO_PUBLIC_UI_SCAFFOLD_AUTH_SKIP === '1';
