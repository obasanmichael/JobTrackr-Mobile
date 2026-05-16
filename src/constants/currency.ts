/** Common salary currencies accepted by the API (aligned with web). */
export const APPLICATION_CURRENCIES = ['USD', 'GBP', 'EUR', 'CAD', 'AUD', 'NGN', 'OTHER'] as const;

export type ApplicationCurrency = (typeof APPLICATION_CURRENCIES)[number];
