/**
 * Navigator param lists (single source of truth for typed navigation).
 *
 * Naming: PascalCase keys match navigator `Screen` names; filenames use kebab-case `*.screen.tsx`.
 */
import type { NavigatorScreenParams } from '@react-navigation/native';

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
};

/** Home dashboard + interview list reachable without a fifth tab */
export type HomeStackParamList = {
  HomeOverview: undefined;
  InterviewList: { linkedApplicationId?: string };
  InterviewForm: InterviewFormParams;
  JobSearch: undefined;
  JobDetail: { jobId: string };
};

/** Applications hub + drilling screens */
export type ReminderFormParams = {
  reminderId?: string;
  applicationId?: string;
  headline?: string;
  recordTimeline?: boolean;
};

export type InterviewFormParams = {
  interviewId?: string;
  applicationId?: string;
  headline?: string;
  recordTimeline?: boolean;
};

export type ApplicationsStackParamList = {
  ApplicationList: undefined;
  ApplicationDetail: { applicationId: string };
  EditApplication: { applicationId: string };
  UpdateApplicationStatus: { applicationId: string };
  AddTimelineNote: { applicationId: string; headline?: string };
  ReminderForm: ReminderFormParams;
  InterviewForm: InterviewFormParams;
};

export type QuickAddStackParamList = {
  QuickAddApplication: undefined;
};

export type RemindersStackParamList = {
  RemindersOverview: undefined;
  ReminderForm: ReminderFormParams;
};

/** More hub (Discover/account entry) · settings · placeholders, replaces old Profile-only stack. */
export type MoreStackParamList = {
  MoreHub: undefined;
  /** Privacy policy, terms, support contact, account deletion, release checklist surface */
  LegalInformation: undefined;
  Settings: undefined;
  /** Typography/tokens QA surface, guarded in-screen when not in DEV */
  DesignReference: undefined;
  ResumeOverview: undefined;
  ResumeDetail: { resumeId: string };
  Calendar: undefined;
  Notifications: undefined;
  BillingPlaceholder: undefined;
  MatchedJobs: undefined;
  SubmitCareersPage: undefined;
  JobDetail: { jobId: string };
};

export type BottomTabParamList = {
  Home: NavigatorScreenParams<HomeStackParamList>;
  Applications: NavigatorScreenParams<ApplicationsStackParamList>;
  QuickAdd: NavigatorScreenParams<QuickAddStackParamList>;
  Reminders: NavigatorScreenParams<RemindersStackParamList>;
  More: NavigatorScreenParams<MoreStackParamList>;
};

export type RootStackParamList = {
  AuthFlow: NavigatorScreenParams<AuthStackParamList>;
  SignedInTabs: NavigatorScreenParams<BottomTabParamList>;
};
