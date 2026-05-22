import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { CommonActions } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { ReactElement } from 'react';
import { RefreshControl, View } from 'react-native';
import type { ScheduleEvent } from '../../domain/schedule-event.types';
import { GoogleCalendarSyncCard } from '../../components/calendar/google-calendar-sync-card';
import { ScheduleCalendar } from '../../components/calendar/schedule-calendar';
import { EmptyState, Screen, Typography } from '../../components/ui';
import { useDomainQueriesEnabled } from '../../hooks/use-domain-queries-enabled';
import { useBillingMeQuery, useCalendarStatusQuery } from '../../query/jt-queries';
import type { BottomTabParamList, MoreStackParamList } from '../../navigation/types';
import { useAppTheme } from '../../theme';

type Props = NativeStackScreenProps<MoreStackParamList, 'Calendar'>;

export function CalendarScreen({ navigation }: Props): ReactElement {
  const { theme } = useAppTheme();
  const apiOn = useDomainQueriesEnabled();
  const statusQuery = useCalendarStatusQuery(apiOn);
  const billingQuery = useBillingMeQuery(apiOn);

  const refreshing = statusQuery.isFetching || billingQuery.isFetching;
  const onRefresh = (): void => {
    void statusQuery.refetch();
    void billingQuery.refetch();
  };

  const canUseCalendar =
    billingQuery.data?.entitlements.some(
      (entry) => entry.featureKey === 'CALENDAR_SYNC' && entry.isEnabled,
    ) ?? false;

  function handleEventPress(event: ScheduleEvent): void {
    if (event.applicationId) {
      const tabNav = navigation.getParent<BottomTabNavigationProp<BottomTabParamList>>();
      tabNav?.dispatch(
        CommonActions.navigate({
          name: 'Applications',
          params: {
            screen: 'ApplicationDetail',
            params: { applicationId: event.applicationId },
          },
        }),
      );
      return;
    }

    const tabNav = navigation.getParent<BottomTabNavigationProp<BottomTabParamList>>();
    tabNav?.navigate('Reminders', { screen: 'RemindersOverview' });
  }

  if (!apiOn) {
    return (
      <Screen scroll edges={['left', 'right', 'bottom']}>
        <EmptyState
          title="Sign in required"
          description="Sign in to view your schedule and connect Google Calendar."
        />
      </Screen>
    );
  }

  return (
    <Screen
      scroll
      edges={['left', 'right', 'bottom']}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <Typography variant="bodySmall" muted style={{ marginTop: theme.space.sm }}>
        See interviews and reminders in one place, then optionally sync upcoming interviews to Google
        Calendar.
      </Typography>

      <View style={{ marginTop: theme.space.lg }}>
        <ScheduleCalendar enabled={apiOn} onEventPress={handleEventPress} />
      </View>

      <View style={{ marginTop: theme.space.xl }}>
        {statusQuery.isPending ? (
          <Typography variant="caption" muted>
            Loading Google Calendar status…
          </Typography>
        ) : statusQuery.isError ? (
          <Typography variant="caption" muted>
            Could not load Google Calendar status. Pull to refresh.
          </Typography>
        ) : statusQuery.data ? (
          <GoogleCalendarSyncCard
            status={statusQuery.data}
            canUseCalendar={canUseCalendar}
            onStatusChange={() => {
              void statusQuery.refetch();
            }}
          />
        ) : null}
      </View>
    </Screen>
  );
}
