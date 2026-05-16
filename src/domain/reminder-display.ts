export type ReminderListItem = {
  id: string;
  title: string;
  dueLabel: string;
  linkedApplicationSummary?: string;
  linkedApplicationId?: string;
  completed?: boolean;
};
