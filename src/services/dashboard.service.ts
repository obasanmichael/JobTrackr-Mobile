import type { DashboardSummaryDto } from '../types/dashboard.dto';
import { getApi } from './api';

export async function fetchDashboardSummary(): Promise<DashboardSummaryDto> {
  const api = await getApi();
  const { data } = await api.get<DashboardSummaryDto>('/dashboard/summary');
  return data;
}
