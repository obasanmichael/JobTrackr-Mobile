import * as WebBrowser from 'expo-web-browser';
import { getWebCalendarOAuthRedirectUrl } from '../constants/web-app-env';

export type CalendarOAuthResult =
  | { ok: true }
  | { ok: false; message: string };

function parseOAuthReturnUrl(url: string): CalendarOAuthResult {
  try {
    const parsed = new URL(url);
    if (parsed.searchParams.get('connected') === '1') {
      return { ok: true };
    }
    const error = parsed.searchParams.get('error');
    if (error) {
      return { ok: false, message: decodeURIComponent(error) };
    }
    return { ok: false, message: 'Google Calendar connection did not complete.' };
  } catch {
    return { ok: false, message: 'Invalid OAuth return URL.' };
  }
}

export async function openGoogleCalendarOAuthSession(
  authorizationUrl: string,
): Promise<CalendarOAuthResult> {
  const redirectUrl = getWebCalendarOAuthRedirectUrl();
  if (!redirectUrl) {
    return {
      ok: false,
      message:
        'Set EXPO_PUBLIC_WEB_APP_URL to match your backend FRONTEND_URL so OAuth can return to the app.',
    };
  }

  WebBrowser.maybeCompleteAuthSession();
  const result = await WebBrowser.openAuthSessionAsync(authorizationUrl, redirectUrl);

  if (result.type === 'success' && result.url) {
    return parseOAuthReturnUrl(result.url);
  }

  if (result.type === 'cancel' || result.type === 'dismiss') {
    return { ok: false, message: 'Google sign-in was cancelled.' };
  }

  return { ok: false, message: 'Could not complete Google Calendar connection.' };
}
