/** Public env validated at startup — never put secrets here (PRD §8). */
export function getPublicApiBaseUrl(): string {
  const url = process.env.EXPO_PUBLIC_API_URL?.trim();
  if (!url) {
    console.warn(
      '[env] EXPO_PUBLIC_API_URL is unset. Set it in `.env`, e.g. http://YOUR_LAN_IP:4000/api/v1 for a physical device.',
    );
    return '';
  }
  return url.replace(/\/$/, '');
}
