import { create } from 'zustand';
import type { LoginFormValues, RegisterFormValues } from '../schemas/auth.schemas';
import type { UserProfile } from '../types/user';
import { UI_SCAFFOLD_BYPASS_AUTHENTICATION } from '../config/ui-scaffold';
import * as authService from '../services/auth.service';
import { deleteStoredAccessToken, getStoredAccessToken, setStoredAccessToken } from '../storage/token-storage';
import { registerUnauthorizedHandler } from '../services/api-unauthorized';

type AuthActions = {
  hydrate: () => Promise<void>;
  login: (credentials: LoginFormValues) => Promise<void>;
  register: (payload: RegisterFormValues) => Promise<void>;
  logout: () => Promise<void>;
};

type AuthSlice = AuthActions & {
  user: UserProfile | null;
  hasHydrated: boolean;
};

export const useAuthStore = create<AuthSlice>((set) => ({
  user: null,
  hasHydrated: UI_SCAFFOLD_BYPASS_AUTHENTICATION,

  hydrate: async () => {
    if (UI_SCAFFOLD_BYPASS_AUTHENTICATION) {
      set({ hasHydrated: true, user: null });
      return;
    }

    try {
      const token = await getStoredAccessToken();
      if (!token) {
        set({ user: null });
        return;
      }
      const user = await authService.getCurrentUserRequest();
      set({ user });
    } catch {
      await deleteStoredAccessToken();
      set({ user: null });
    } finally {
      set({ hasHydrated: true });
    }
  },

  login: async (credentials) => {
    const session = await authService.loginRequest(credentials);
    await setStoredAccessToken(session.accessToken);
    set({ user: session.user });
  },

  register: async (payload) => {
    const session = await authService.registerRequest(payload);
    await setStoredAccessToken(session.accessToken);
    set({ user: session.user });
  },

  logout: async () => {
    await deleteStoredAccessToken();
    set({ user: null });
  },
}));

registerUnauthorizedHandler(() => {
  void deleteStoredAccessToken().finally(() => {
    useAuthStore.setState({ user: null });
  });
});
