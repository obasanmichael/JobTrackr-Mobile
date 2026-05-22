import type { ReactElement } from 'react';
import { Alert, Linking, Switch, View } from 'react-native';
import { format, parseISO } from 'date-fns';
import { AlertCircle, Calendar, ExternalLink } from 'lucide-react-native';
import { getWebBillingUrl } from '../../constants/web-app-env';
import type { CalendarStatusApi } from '../../types/calendar.dto';
import {
  fetchCalendarConnectUrlForOAuth,
  useDisconnectCalendarMutation,
  usePatchCalendarSettingsMutation,
  useSyncCalendarInterviewsMutation,
} from '../../query/jt-queries';
import { openGoogleCalendarOAuthSession } from '../../lib/calendar-oauth';
import { showErrorFeedback, showSuccessFeedback } from '../../lib/feedback';
import { parseAxiosApiError } from '../../services/api';
import { useAppTheme } from '../../theme';
import { Button, Card, Typography } from '../ui';

function formatWhen(value: string | null | undefined): string | null {
  if (!value) {
    return null;
  }

  try {
    return format(parseISO(value), "MMM d, yyyy 'at' h:mm a");
  } catch {
    return value;
  }
}

type Props = {
  status: CalendarStatusApi;
  canUseCalendar: boolean;
  onStatusChange?: () => void;
};

export function GoogleCalendarSyncCard(props: Props): ReactElement {
  const { theme } = useAppTheme();
  const disconnectMutation = useDisconnectCalendarMutation();
  const settingsMutation = usePatchCalendarSettingsMutation();
  const syncMutation = useSyncCalendarInterviewsMutation();
  const lastSyncAt = formatWhen(props.status.lastSyncAt ?? null);

  const isBusy =
    disconnectMutation.isPending || settingsMutation.isPending || syncMutation.isPending;

  async function handleConnect(): Promise<void> {
    try {
      const authorizationUrl = await fetchCalendarConnectUrlForOAuth();
      const result = await openGoogleCalendarOAuthSession(authorizationUrl);
      if (result.ok) {
        showSuccessFeedback('Google Calendar connected');
        props.onStatusChange?.();
        return;
      }
      showErrorFeedback(result.message);
    } catch (error) {
      showErrorFeedback(parseAxiosApiError(error)?.message ?? 'Could not start Google sign-in.');
    }
  }

  async function handleDisconnect(): Promise<void> {
    try {
      await disconnectMutation.mutateAsync();
      showSuccessFeedback('Google Calendar disconnected');
      props.onStatusChange?.();
    } catch (error) {
      showErrorFeedback(parseAxiosApiError(error)?.message ?? 'Could not disconnect calendar.');
    }
  }

  async function handleSync(): Promise<void> {
    try {
      const result = await syncMutation.mutateAsync({});
      props.onStatusChange?.();
      if (result.syncedCount === 0 && result.failedCount === 0) {
        showSuccessFeedback('No upcoming interviews to sync.');
        return;
      }
      if (result.failedCount === 0) {
        showSuccessFeedback(
          `Synced ${result.syncedCount} interview${result.syncedCount === 1 ? '' : 's'} to Google Calendar.`,
        );
        return;
      }
      showErrorFeedback(
        `Synced ${result.syncedCount}, failed ${result.failedCount}. Check last sync error below.`,
      );
    } catch (error) {
      showErrorFeedback(parseAxiosApiError(error)?.message ?? 'Could not sync interviews.');
    }
  }

  async function handleToggleAutoSync(next: boolean): Promise<void> {
    try {
      await settingsMutation.mutateAsync({ autoSyncInterviews: next });
      showSuccessFeedback('Calendar settings updated');
      props.onStatusChange?.();
    } catch (error) {
      showErrorFeedback(parseAxiosApiError(error)?.message ?? 'Could not update calendar settings.');
    }
  }

  async function openBillingOnWeb(): Promise<void> {
    const url = getWebBillingUrl();
    if (!url) {
      Alert.alert(
        'Web billing unavailable',
        'Set EXPO_PUBLIC_WEB_APP_URL to open billing on the web app.',
      );
      return;
    }
    await Linking.openURL(url);
  }

  return (
    <View style={{ gap: theme.space.lg }}>
      {!props.canUseCalendar ? (
        <Card style={{ gap: theme.space.md, backgroundColor: 'rgba(245, 158, 11, 0.08)' }}>
          <Typography variant="bodySmall" style={{ fontWeight: '700' }}>
            Calendar sync is not on your plan
          </Typography>
          <Typography variant="caption" muted>
            Upgrade or switch to a plan that includes calendar sync to connect Google Calendar.
          </Typography>
          <Button label="View billing on web" variant="secondary" onPress={() => void openBillingOnWeb()} />
        </Card>
      ) : null}

      <Card style={{ gap: theme.space.md }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: theme.space.md }}>
          <View style={{ flex: 1, gap: theme.space.xs }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.space.sm }}>
              <Calendar size={18} color={theme.colors.textMuted} />
              <Typography variant="bodySmall" style={{ fontWeight: '700' }}>
                Google Calendar
              </Typography>
            </View>
            <Typography variant="caption" muted>
              Export upcoming interviews to your primary Google Calendar.
            </Typography>
          </View>
          <View
            style={{
              borderRadius: 999,
              paddingHorizontal: theme.space.sm,
              paddingVertical: 4,
              backgroundColor: props.status.connected ? 'rgba(16, 185, 129, 0.12)' : theme.colors.borderMuted,
            }}
          >
            <Typography variant="caption" style={{ fontWeight: '700' }}>
              {props.status.connected ? 'Connected' : 'Not connected'}
            </Typography>
          </View>
        </View>

        {props.status.connected ? (
          <View
            style={{
              borderWidth: 1,
              borderColor: theme.colors.borderMuted,
              borderRadius: theme.radii.lg,
              padding: theme.space.md,
              gap: theme.space.xs,
            }}
          >
            <Typography variant="bodySmall" style={{ fontWeight: '600' }}>
              {props.status.providerAccountEmail ?? 'Google account connected'}
            </Typography>
            <Typography variant="caption" muted>
              {lastSyncAt ? `Last sync: ${lastSyncAt}` : 'No interviews synced yet.'}
            </Typography>
          </View>
        ) : (
          <Typography variant="caption" muted>
            Connect Google Calendar to mirror upcoming interviews on your phone or desktop calendar app.
          </Typography>
        )}

        {props.status.lastError ? (
          <View
            style={{
              flexDirection: 'row',
              gap: theme.space.sm,
              borderWidth: 1,
              borderColor: 'rgba(239, 68, 68, 0.3)',
              backgroundColor: 'rgba(239, 68, 68, 0.08)',
              borderRadius: theme.radii.lg,
              padding: theme.space.md,
            }}
          >
            <AlertCircle size={16} color={theme.colors.danger} />
            <Typography variant="caption" style={{ flex: 1, color: theme.colors.danger }}>
              {props.status.lastError}
            </Typography>
          </View>
        ) : null}

        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: theme.space.sm }}>
          {!props.status.connected ? (
            <Button
              label="Connect Google Calendar"
              variant="primary"
              disabled={!props.canUseCalendar || isBusy}
              loading={isBusy}
              onPress={() => void handleConnect()}
            />
          ) : (
            <>
              <Button
                label="Sync upcoming interviews"
                variant="secondary"
                disabled={isBusy}
                loading={syncMutation.isPending}
                onPress={() => void handleSync()}
              />
              <Button
                label="Disconnect"
                variant="outline"
                disabled={isBusy}
                loading={disconnectMutation.isPending}
                onPress={() => void handleDisconnect()}
              />
            </>
          )}
        </View>
      </Card>

      {props.status.connected ? (
        <Card style={{ gap: theme.space.md }}>
          <View style={{ gap: theme.space.xs }}>
            <Typography variant="bodySmall" style={{ fontWeight: '700' }}>
              Sync settings
            </Typography>
            <Typography variant="caption" muted>
              Control which JobTrackr records are pushed to Google Calendar.
            </Typography>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: theme.space.md }}>
            <View style={{ flex: 1, gap: theme.space.xs }}>
              <Typography variant="bodySmall" style={{ fontWeight: '600' }}>
                Sync interviews
              </Typography>
              <Typography variant="caption" muted>
                When enabled, new and updated upcoming interviews sync to Google Calendar automatically.
              </Typography>
            </View>
            <Switch
              value={props.status.autoSyncInterviews}
              disabled={settingsMutation.isPending}
              onValueChange={(next) => void handleToggleAutoSync(next)}
            />
          </View>
        </Card>
      ) : null}

      <Card style={{ gap: theme.space.sm }}>
        <Typography variant="bodySmall" style={{ fontWeight: '700' }}>
          How Google sync works
        </Typography>
        <Typography variant="caption" muted>
          Only upcoming interviews are exported. Reminders stay in the JobTrackr schedule above. After
          connecting, use manual sync once or leave auto-sync on for new interviews.
        </Typography>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.space.xs, marginTop: theme.space.xs }}>
          <ExternalLink size={14} color={theme.colors.textMuted} />
          <Typography variant="caption" muted>
            OAuth completes in your browser and returns to the web calendar URL configured in your env.
          </Typography>
        </View>
      </Card>
    </View>
  );
}
