/** UI interview format inferred from Nest `InterviewType` */
export type InterviewFormat = 'REMOTE' | 'HYBRID' | 'ONSITE';

export type InterviewListItem = {
  id: string;
  roleTitle: string;
  companyName: string;
  startLabel: string;
  durationLabel: string;
  format: InterviewFormat;
  linkedApplicationId?: string;
};
