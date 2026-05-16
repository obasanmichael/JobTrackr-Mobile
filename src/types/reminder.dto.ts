export type ReminderDto = {
  id: string;
  userId: string;
  applicationId: string;
  title: string;
  description?: string | null;
  dueDate: string;
  isCompleted: boolean;
  createdAt: string;
  updatedAt: string;
};
