import type { ReactElement } from 'react';
import { Alert, Linking, Switch, View } from 'react-native';
import { format, parseISO } from 'date-fns';
import { AlertCircle, Calendar, CheckCircle2, ExternalLink, Link2Off } from 'lucide-react-native';
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

function ConnectionStatusPill(props: { connected: boolean }): ReactElement {
  const { theme } = useAppTheme();
  const connected = props.connected;

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        gap: 4,
        borderRadius: 999,
        paddingHorizontal: theme.space.sm,
        paddingVertical: 4,
        backgroundColor: connected ? 'rgba(16, 185, 129, 0.12)' : theme.colors.surfaceElevated,
        borderWidth: 1,
        borderColor: connected ? 'rgba(16, 185, 129, 0.35)' : theme.colors.borderMuted,
      }}
    >
      {connected ? (
        <CheckCircle2 size={12} color={theme.colors.success} />
      ) : (
        <Link2Off size={12} color={theme.colors.textMuted} />
      )}
      <Typography
        variant="caption"
        style={{
          fontWeight: '700',
          color: connected ? theme.colors.success : theme.colors.textMuted,
        }}
      >
        {connected ? 'Connected' : 'Not connected'}
      </Typography>
    </View>
  );
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
          <Button
            label="View billing on web"
            variant="secondary"
            block
            onPress={() => void openBillingOnWeb()}
          />
        </Card>
      ) : null}

      <Card style={{ gap: theme.space.lg }}>
        <View style={{ flexDirection: 'row', gap: theme.space.md, alignItems: 'flex-start' }}>
          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: theme.radii.lg,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: `${theme.colors.accent}18`,
            }}
          >
            <Calendar size={20} color={theme.colors.accent} />
          </View>
          <View style={{ flex: 1, gap: theme.space.sm }}>
            <View style={{ gap: theme.space.xs }}>
              <Typography variant="bodySmall" style={{ fontWeight: '700' }}>
                Google Calendar
              </Typography>
              <Typography variant="caption" muted>
                Mirror upcoming interviews to your primary Google Calendar.
              </Typography>
            </View>
            <ConnectionStatusPill connected={props.status.connected} />
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
              backgroundColor: theme.colors.surfaceElevated,
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
          <View
            style={{
              borderWidth: 1,
              borderColor: theme.colors.borderMuted,
              borderRadius: theme.radii.lg,
              padding: theme.space.md,
              backgroundColor: theme.colors.surfaceElevated,
            }}
          >
            <Typography variant="caption" muted>
              Connect once to keep interview times in sync with the calendar app on your phone or
              desktop. Reminders stay in JobTrackr only.
            </Typography>
          </View>
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

        {!props.status.connected ? (
          <Button
            label="Connect Google Calendar"
            variant="primary"
            block
            disabled={!props.canUseCalendar || isBusy}
            loading={isBusy}
            onPress={() => void handleConnect()}
          />
        ) : (
          <View style={{ flexDirection: 'row', gap: theme.space.sm }}>
            <Button
              label="Sync now"
              variant="secondary"
              disabled={isBusy}
              loading={syncMutation.isPending}
              onPress={() => void handleSync()}
              style={{ flex: 1 }}
            />
            <Button
              label="Disconnect"
              variant="outline"
              disabled={isBusy}
              loading={disconnectMutation.isPending}
              onPress={() => void handleDisconnect()}
              style={{ flex: 1 }}
            />
          </View>
        )}
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
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              gap: theme.space.md,
              borderTopWidth: 1,
              borderTopColor: theme.colors.borderMuted,
              paddingTop: theme.space.md,
            }}
          >
            <View style={{ flex: 1, gap: theme.space.xs }}>
              <Typography variant="bodySmall" style={{ fontWeight: '600' }}>
                Auto-sync interviews
              </Typography>
              <Typography variant="caption" muted>
                New and updated upcoming interviews sync automatically.
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

      <Card style={{ gap: theme.space.sm, backgroundColor: theme.colors.surfaceElevated }}>
        <Typography variant="bodySmall" style={{ fontWeight: '700' }}>
          How Google sync works
        </Typography>
        <Typography variant="caption" muted>
          Only upcoming interviews are exported. After connecting, run a manual sync once or leave
          auto-sync enabled for new interviews.
        </Typography>
        <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: theme.space.xs, marginTop: theme.space.xs }}>
          <ExternalLink size={14} color={theme.colors.textMuted} style={{ marginTop: 1 }} />
          <Typography variant="caption" muted style={{ flex: 1 }}>
            Sign-in opens in your browser and returns when connection completes.
          </Typography>
        </View>
      </Card>
    </View>
  );
}
