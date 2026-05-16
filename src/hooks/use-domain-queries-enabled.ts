import { getPublicApiBaseUrl } from '../config/env';
import { UI_SCAFFOLD_BYPASS_AUTHENTICATION } from '../config/ui-scaffold';
import { useAuthStore } from '../store/auth.store';

/** True when scaffold is off, user is hydrated, JWT-backed profile exists, and API URL is configured. */
export function useDomainQueriesEnabled(): boolean {
  const user = useAuthStore((s) => s.user);
  const hydrated = useAuthStore((s) => s.hasHydrated);
  if (UI_SCAFFOLD_BYPASS_AUTHENTICATION) return false;
  if (!hydrated) return false;
  if (!user) return false;
  return !!getPublicApiBaseUrl();
}
