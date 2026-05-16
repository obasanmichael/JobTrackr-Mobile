/**
 * UI scaffold: open signed-in navigation without JWT (fixtures / design QA only).
 * Set `EXPO_PUBLIC_UI_SCAFFOLD_AUTH_SKIP=1` in `.env`; leave unset for normal auth.
 */
export const UI_SCAFFOLD_BYPASS_AUTHENTICATION = process.env.EXPO_PUBLIC_UI_SCAFFOLD_AUTH_SKIP === '1';
