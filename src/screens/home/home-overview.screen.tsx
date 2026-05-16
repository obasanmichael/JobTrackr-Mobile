import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { ReactElement } from 'react';
import { View } from 'react-native';
import { ApplicationCard } from '../../components/applications/application-card';
import { InterviewCard } from '../../components/interviews/interview-card';
import { ReminderCard } from '../../components/reminders/reminder-card';
import { Button, Card, Screen, Typography } from '../../components/ui';
import { MOCK_APPLICATION_ENTITY_ID } from '../../constants/mock-navigation';
import { MOCK_APPLICATIONS } from '../../fixtures/mock-applications';
import { MOCK_INTERVIEWS } from '../../fixtures/mock-interviews';
import { MOCK_REMINDERS } from '../../fixtures/mock-reminders';
import type { HomeStackParamList } from '../../navigation/types';
import { useAppTheme } from '../../theme';

type Props = NativeStackScreenProps<HomeStackParamList, 'HomeOverview'>;

export function HomeOverviewScreen({ navigation }: Props): ReactElement {
  const { theme } = useAppTheme();
  const nextInterview = MOCK_INTERVIEWS[0];
  const nextReminder = MOCK_REMINDERS.find((r) => !r.completed);
  const recentApps = MOCK_APPLICATIONS.slice(0, 2);

  return (
    <Screen scroll>
      <Typography variant="subtitle" muted style={{ marginBottom: theme.space.xs }}>
        Good afternoon
      </Typography>
      <Typography variant="hero" style={{ marginBottom: theme.space.sm }}>
        Dashboard
      </Typography>
      <Typography variant="subtitle" muted>
        Snapshot from fixtures · replace with dashboard API selectors.
      </Typography>

      <View style={{ flexDirection: 'row', gap: theme.space.md, marginTop: theme.space.xl }}>
        <Card style={{ flex: 1, alignItems: 'center', paddingVertical: theme.space.md }}>
          <Typography variant="hero">{MOCK_APPLICATIONS.length}</Typography>
          <Typography variant="caption" muted>
            Active apps
          </Typography>
        </Card>
        <Card style={{ flex: 1, alignItems: 'center', paddingVertical: theme.space.md }}>
          <Typography variant="hero">{MOCK_REMINDERS.filter((r) => !r.completed).length}</Typography>
          <Typography variant="caption" muted>
            Due soon
          </Typography>
        </Card>
      </View>

      <Typography variant="label" style={{ marginTop: theme.space.xl }}>
        Next interview
      </Typography>
      <View style={{ marginTop: theme.space.sm }}>
        {nextInterview ? <InterviewCard interview={nextInterview} /> : null}
      </View>

      <Typography variant="label" style={{ marginTop: theme.space.xl }}>
        Next reminder
      </Typography>
      <View style={{ marginTop: theme.space.sm }}>
        {nextReminder ? <ReminderCard reminder={nextReminder} /> : null}
      </View>

      <Typography variant="label" style={{ marginTop: theme.space.xl }}>
        Recent applications
      </Typography>
      <View style={{ marginTop: theme.space.sm, gap: theme.space.md }}>
        {recentApps.map((app) => (
          <ApplicationCard key={app.id} application={app} />
        ))}
      </View>

      <View style={{ marginTop: theme.space.xl, gap: theme.space.sm }}>
        <Button label="All interviews" variant="secondary" block onPress={() => navigation.navigate('InterviewList', {})} />
        <Button
          label="Interviews for primary fixture"
          variant="outline"
          block
          onPress={() =>
            navigation.navigate('InterviewList', { linkedApplicationId: MOCK_APPLICATION_ENTITY_ID })
          }
        />
      </View>
    </Screen>
  );
}
