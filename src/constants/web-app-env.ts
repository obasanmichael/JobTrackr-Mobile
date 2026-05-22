import { readTrimmedPublicEnv } from './legal-env';

/** Public web app origin for companion flows (billing, admin, etc.). */
export function getWebAppBaseUrl(): string | undefined {
  return readTrimmedPublicEnv('EXPO_PUBLIC_WEB_APP_URL');
}

/** Web dashboard billing page, checkout and Stripe portal live here, not on mobile. */
export function getWebBillingUrl(): string | undefined {
  const base = getWebAppBaseUrl()?.replace(/\/$/, '');
  return base ? `${base}/dashboard/billing` : undefined;
}
