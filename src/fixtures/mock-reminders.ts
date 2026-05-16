export type MockReminder = {
  id: string;
  title: string;
  dueLabel: string;
  linkedApplicationSummary?: string;
  linkedApplicationId?: string;
  completed?: boolean;
};

export const MOCK_REMINDERS: MockReminder[] = [
  {
    id: 'mock-rem-1',
    title: 'Follow up with Jordan (Acme)',
    dueLabel: 'Today · 4:00 PM',
    linkedApplicationSummary: 'Staff Product Engineer · Acme Labs',
    linkedApplicationId: 'jobtrackr-ui-shell-application-id',
    completed: false,
  },
  {
    id: 'mock-rem-2',
    title: 'Prep system design outline',
    dueLabel: 'Tomorrow · morning',
    linkedApplicationSummary: 'Nova · onsite loop',
    linkedApplicationId: 'mock-app-nova-design',
    completed: false,
  },
  {
    id: 'mock-rem-3',
    title: 'Send thank-you note',
    dueLabel: 'Completed yesterday',
    linkedApplicationSummary: 'Polaris HM chat',
    linkedApplicationId: 'mock-app-polaris',
    completed: true,
  },
];
