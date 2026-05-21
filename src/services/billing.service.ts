import type { BillingMeApi, PlanSummaryApi } from '../types/billing.dto';
import { getApi } from './api';

export async function fetchBillingMeRequest(): Promise<BillingMeApi> {
  const api = await getApi();
  const { data } = await api.get<BillingMeApi>('/billing/me');
  return data;
}

export async function fetchPlansRequest(): Promise<PlanSummaryApi[]> {
  const api = await getApi();
  const { data } = await api.get<PlanSummaryApi[]>('/billing/plans');
  return data;
}
