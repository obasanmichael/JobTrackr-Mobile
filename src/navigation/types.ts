/**
 * Navigator param lists (single source of truth for typed navigation).
 *
 * Naming: PascalCase keys match navigator `Screen` names; filenames use kebab-case `*.screen.tsx`.
 */
import type { NavigatorScreenParams } from '@react-navigation/native';

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

/** Home dashboard + interview list reachable without a fifth tab */
export type HomeStackParamList = {
  HomeOverview: undefined;
  InterviewList: { linkedApplicationId?: string };
};

/** Applications hub + drilling screens */
export type ApplicationsStackParamList = {
  ApplicationList: undefined;
  ApplicationDetail: { applicationId: string };
  UpdateApplicationStatus: { applicationId: string };
  AddTimelineNote: { applicationId: string };
};

export type QuickAddStackParamList = {
  QuickAddApplication: undefined;
};

export type RemindersStackParamList = {
  RemindersOverview: undefined;
};

export type ProfileStackParamList = {
  ProfileOverview: undefined;
  /** Typography/tokens QA surface — guarded in-screen when not in DEV */
  DesignReference: undefined;
};

export type BottomTabParamList = {
  Home: NavigatorScreenParams<HomeStackParamList>;
  Applications: NavigatorScreenParams<ApplicationsStackParamList>;
  QuickAdd: NavigatorScreenParams<QuickAddStackParamList>;
  Reminders: NavigatorScreenParams<RemindersStackParamList>;
  Profile: NavigatorScreenParams<ProfileStackParamList>;
};

export type RootStackParamList = {
  AuthFlow: NavigatorScreenParams<AuthStackParamList>;
  SignedInTabs: NavigatorScreenParams<BottomTabParamList>;
};
