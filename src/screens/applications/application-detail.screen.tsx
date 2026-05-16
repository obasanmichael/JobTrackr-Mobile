import type { CompositeScreenProps } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { ReactElement } from 'react';
import { View } from 'react-native';
import { InterviewCard } from '../../components/interviews/interview-card';
import { ReminderCard } from '../../components/reminders/reminder-card';
import { StatusBadge } from '../../components/applications/status-badge';
import { Button, Card, ErrorState, Screen, Typography } from '../../components/ui';
import { MOCK_INTERVIEWS } from '../../fixtures/mock-interviews';
import { MOCK_REMINDERS } from '../../fixtures/mock-reminders';
import { getMockApplicationById } from '../../fixtures/mock-applications';
import type { ApplicationsStackParamList, BottomTabParamList } from '../../navigation/types';
import { WORK_MODE_LABELS } from '../../constants/work-mode';
import { useAppTheme } from '../../theme';

type Props = CompositeScreenProps<
  NativeStackScreenProps<ApplicationsStackParamList, 'ApplicationDetail'>,
  BottomTabScreenProps<BottomTabParamList>
>;

export function ApplicationDetailScreen({ navigation, route }: Props): ReactElement {
  const { theme } = useAppTheme();
  const app = getMockApplicationById(route.params.applicationId);

  const openInterviewContext = (): void => {
    navigation.navigate('Home', {
      screen: 'InterviewList',
      params: { linkedApplicationId: route.params.applicationId },
    });
  };

  if (!app) {
    return (
      <Screen scroll>
        <ErrorState
          title="Application not found"
          message="No fixture matches this id yet — generate fixtures from API payloads next."
          retryLabel="Go back"
          onRetry={() => navigation.goBack()}
        />
      </Screen>
    );
  }

  const relatedReminders = MOCK_REMINDERS.filter((r) => r.linkedApplicationId === app.id && !r.completed);
  const relatedInterviews = MOCK_INTERVIEWS.filter((i) => i.linkedApplicationId === app.id);

  const timelinePreview = [
    'Resume submitted · Feb 4',
    'Recruiter screen · cleared Feb 10',
    'Take-home invite · due Sun',
  ];

  return (
    <Screen scroll>
      <Typography variant="subtitle" muted style={{ marginBottom: theme.space.xs }}>
        Application
      </Typography>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: theme.space.md }}>
        <View style={{ flex: 1 }}>
          <Typography variant="hero">{app.companyName}</Typography>
          <Typography variant="subtitle" muted style={{ marginTop: theme.space.xs }}>
            {app.jobTitle}
          </Typography>
        </View>
        <StatusBadge status={app.status} />
      </View>

      <Card style={{ marginTop: theme.space.lg, gap: theme.space.sm }}>
        <Typography variant="label">Overview</Typography>
        <Typography variant="body">{WORK_MODE_LABELS[app.workMode]}</Typography>
        {app.location ? (
          <Typography variant="bodySmall" muted>
            {app.location}
          </Typography>
        ) : null}
        {app.salaryRange ? (
          <Typography variant="bodySmall" color={theme.colors.accent}>
            {app.salaryRange}
          </Typography>
        ) : null}
        {app.appliedLabel ? (
          <Typography variant="caption" muted>
            {app.appliedLabel}
          </Typography>
        ) : null}
        {app.deadlineLabel ? (
          <Typography variant="caption" style={{ fontWeight: '600', color: theme.colors.warning }}>
            {app.deadlineLabel}
          </Typography>
        ) : null}
      </Card>

      {app.notesPreview ? (
        <Card style={{ marginTop: theme.space.md, gap: theme.space.sm }}>
          <Typography variant="label">Notes</Typography>
          <Typography variant="bodySmall">{app.notesPreview}</Typography>
        </Card>
      ) : null}

      <Card style={{ marginTop: theme.space.md, gap: theme.space.sm }}>
        <Typography variant="label">Timeline preview</Typography>
        {timelinePreview.map((line) => (
          <Typography key={line} variant="caption" muted>
            · {line}
          </Typography>
        ))}
      </Card>

      {relatedReminders.length > 0 ? (
        <View style={{ marginTop: theme.space.lg, gap: theme.space.sm }}>
          <Typography variant="label">Related reminders</Typography>
          {relatedReminders.map((r) => (
            <ReminderCard key={r.id} reminder={r} />
          ))}
        </View>
      ) : null}

      {relatedInterviews.length > 0 ? (
        <View style={{ marginTop: theme.space.lg, gap: theme.space.sm }}>
          <Typography variant="label">Interviews</Typography>
          {relatedInterviews.map((i) => (
            <InterviewCard key={i.id} interview={i} />
          ))}
        </View>
      ) : null}

      <View style={{ marginTop: theme.space.xl, gap: theme.space.sm }}>
        <Button
          label="Update status"
          variant="primary"
          block
          onPress={() =>
            navigation.navigate('UpdateApplicationStatus', { applicationId: route.params.applicationId })
          }
        />
        <Button
          label="Add timeline note"
          variant="secondary"
          block
          onPress={() => navigation.navigate('AddTimelineNote', { applicationId: route.params.applicationId })}
        />
        <Button label="Interview context (Home tab)" variant="outline" block onPress={openInterviewContext} />
      </View>
    </Screen>
  );
}
