import type { ApplicationEventType } from '../constants/application-event-type';

export type ApplicationEventDto = {
  id: string;
  userId: string;
  applicationId: string;
  type: ApplicationEventType;
  title: string;
  description?: string | null;
  createdAt: string;
};
