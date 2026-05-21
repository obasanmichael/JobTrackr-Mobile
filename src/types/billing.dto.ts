export type SubscriptionStatusApi =
  | 'BETA'
  | 'ACTIVE'
  | 'TRIALING'
  | 'PAST_DUE'
  | 'CANCELLED'
  | 'EXPIRED';

export type BillingProviderApi = 'NONE' | 'STRIPE';

export interface EntitlementEntryApi {
  featureKey: string;
  isEnabled: boolean;
  limitValue: number | null;
}

export interface BillingMeApi {
  planCode: string;
  planName: string;
  subscriptionStatus: SubscriptionStatusApi;
  billingProvider: BillingProviderApi;
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
  currentPeriodEnd: string | null;
  entitlements: EntitlementEntryApi[];
  stripeConfigured: boolean;
}

export interface PlanSummaryApi {
  code: string;
  name: string;
  description: string | null;
  priceMonthly: number | null;
  currency: string;
  checkoutAvailable: boolean;
  isBeta: boolean;
  sortOrder: number;
}
