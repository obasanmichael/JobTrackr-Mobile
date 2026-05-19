/**
 * Store-required URLs from public env (Expo injects `EXPO_PUBLIC_*` at bundle time).
 * Host matching privacy policies on HTTPS before submitting to Apple / Google.
 */
export function readTrimmedPublicEnv(name: string): string | undefined {
  try {
    const v = process.env[name]?.trim();
    return v && v.length > 0 ? v : undefined;
  } catch {
    return undefined;
  }
}

export function getPrivacyPolicyUrl(): string | undefined {
  return readTrimmedPublicEnv('EXPO_PUBLIC_PRIVACY_POLICY_URL');
}

export function getTermsOfServiceUrl(): string | undefined {
  return readTrimmedPublicEnv('EXPO_PUBLIC_TERMS_OF_SERVICE_URL');
}

/** Apple / Google expect a documented account deletion flow (URL or in-app parity). */
export function getAccountDeletionUrl(): string | undefined {
  return readTrimmedPublicEnv('EXPO_PUBLIC_ACCOUNT_DELETION_URL');
}

/** Prefer HTTPS contact page; otherwise mailto using support email when set. */
export function getSupportLaunchUrl(): string | undefined {
  const web = readTrimmedPublicEnv('EXPO_PUBLIC_SUPPORT_URL');
  if (web) return web;

  const email = readTrimmedPublicEnv('EXPO_PUBLIC_SUPPORT_EMAIL');
  if (!email) return undefined;

  const subject = encodeURIComponent('JobTrackr support');
  return `mailto:${email}?subject=${subject}`;
}
