export type InterviewFormat = 'REMOTE' | 'HYBRID' | 'ONSITE';

export type MockInterview = {
  id: string;
  roleTitle: string;
  companyName: string;
  startLabel: string;
  durationLabel: string;
  format: InterviewFormat;
  linkedApplicationId?: string;
};

export const MOCK_INTERVIEWS: MockInterview[] = [
  {
    id: 'mock-int-1',
    roleTitle: 'Staff Product Engineer',
    companyName: 'Acme Labs',
    startLabel: 'Tomorrow · 10:30 AM',
    durationLabel: '90 min · panel',
    format: 'REMOTE',
    linkedApplicationId: 'jobtrackr-ui-shell-application-id',
  },
  {
    id: 'mock-int-2',
    roleTitle: 'Senior UX Engineer — onsite loop',
    companyName: 'Nova Design Co.',
    startLabel: 'Mar 6 · 2:00 PM',
    durationLabel: 'Half day',
    format: 'HYBRID',
    linkedApplicationId: 'mock-app-nova-design',
  },
  {
    id: 'mock-int-3',
    roleTitle: 'Coffee chat · HM',
    companyName: 'Polaris Health',
    startLabel: 'Mar 10 · 9:00 AM',
    durationLabel: '45 min',
    format: 'REMOTE',
    linkedApplicationId: 'mock-app-polaris',
  },
];
