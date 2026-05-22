/** Mirrors Nest `UserProfileDto` JSON (ISO date strings over the wire). */
export type UserProfile = {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  avatarUrl?: string | null;
  timezone?: string | null;
  themePreference?: 'system' | 'light' | 'dark' | null;
};

/** Mirrors Nest `AuthResponseDto`. */
export type AuthSessionPayload = {
  user: UserProfile;
  accessToken: string;
};
