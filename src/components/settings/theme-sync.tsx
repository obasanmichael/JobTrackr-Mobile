import { useEffect, useRef } from 'react';
import type { ThemePreference } from '../../theme';
import { useAuthStore } from '../../store/auth.store';
import { useAppTheme } from '../../theme';

/** Applies server-stored theme preference when it changes (login, save, hydrate). */
export function ThemeSync(): null {
  const user = useAuthStore((s) => s.user);
  const hasHydrated = useAuthStore((s) => s.hasHydrated);
  const { setPreference } = useAppTheme();
  const syncedPreference = useRef<ThemePreference | null>(null);

  useEffect(() => {
    if (!hasHydrated) return;

    if (!user) {
      syncedPreference.current = null;
      return;
    }

    const serverPreference = (user.themePreference ?? 'system') as ThemePreference;
    if (syncedPreference.current === serverPreference) return;

    syncedPreference.current = serverPreference;
    setPreference(serverPreference);
  }, [hasHydrated, user?.themePreference, setPreference, user]);

  return null;
}
