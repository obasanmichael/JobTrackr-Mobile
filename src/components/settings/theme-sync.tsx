import { useEffect } from 'react';
import type { ThemePreference } from '../theme';
import { useAuthStore } from '../store/auth.store';
import { useAppTheme } from '../theme';

/** Applies server-stored theme preference after auth hydrates. */
export function ThemeSync(): null {
  const user = useAuthStore((s) => s.user);
  const hasHydrated = useAuthStore((s) => s.hasHydrated);
  const { setPreference } = useAppTheme();

  useEffect(() => {
    if (!hasHydrated || !user) return;
    const next = (user.themePreference ?? 'system') as ThemePreference;
    setPreference(next);
  }, [hasHydrated, user?.themePreference, setPreference, user]);

  return null;
}
