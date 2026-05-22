import { Bell } from 'lucide-react-native';
import { useEffect, useState, type ReactElement } from 'react';
import { Switch, View } from 'react-native';
import { Button, Card, TextField, Typography } from '../ui';
import {
  getNotificationPreferencesRequest,
  updateNotificationPreferencesRequest,
  type NotificationCategories,
} from '../../services/notification-preferences.service';
import { parseAxiosApiError } from '../../services/api';
import { showErrorFeedback, showSuccessFeedback } from '../../lib/feedback';
import { useAppTheme } from '../../theme';

function leadMinutesFromSelection(oneHour: boolean, oneDay: boolean): number[] {
  const values: number[] = [];
  if (oneHour) values.push(60);
  if (oneDay) values.push(1440);
  return values.length > 0 ? values : [60];
}

export function NotificationsSettingsCard(): ReactElement {
  const { theme } = useAppTheme();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState<NotificationCategories | null>(null);
  const [draft, setDraft] = useState<NotificationCategories | null>(null);
  const [reminderOneHour, setReminderOneHour] = useState(true);
  const [reminderOneDay, setReminderOneDay] = useState(false);
  const [interviewOneHour, setInterviewOneHour] = useState(true);
  const [interviewOneDay, setInterviewOneDay] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      try {
        const prefs = await getNotificationPreferencesRequest();
        if (cancelled) return;
        setSaved(prefs.categories);
        setDraft(prefs.categories);
        setReminderOneHour(prefs.categories.reminders.leadMinutes.includes(60));
        setReminderOneDay(prefs.categories.reminders.leadMinutes.includes(1440));
        setInterviewOneHour(prefs.categories.interviews.leadMinutes.includes(60));
        setInterviewOneDay(prefs.categories.interviews.leadMinutes.includes(1440));
      } catch (error) {
        if (!cancelled) {
          const parsed = parseAxiosApiError(error);
          showErrorFeedback(parsed?.message ?? 'Could not load notification preferences.');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  const dirty =
    draft &&
    saved &&
    JSON.stringify({
      ...draft,
      reminders: {
        ...draft.reminders,
        leadMinutes: leadMinutesFromSelection(reminderOneHour, reminderOneDay),
      },
      interviews: {
        ...draft.interviews,
        leadMinutes: leadMinutesFromSelection(interviewOneHour, interviewOneDay),
      },
    }) !== JSON.stringify(saved);

  async function handleSave(): Promise<void> {
    if (!draft) return;
    const score = draft.matches.minMatchScore;
    if (!Number.isInteger(score) || score < 0 || score > 100) {
      showErrorFeedback('Match score must be a whole number between 0 and 100.');
      return;
    }

    setSaving(true);
    try {
      const categories = {
        ...draft,
        reminders: {
          ...draft.reminders,
          leadMinutes: leadMinutesFromSelection(reminderOneHour, reminderOneDay),
        },
        interviews: {
          ...draft.interviews,
          leadMinutes: leadMinutesFromSelection(interviewOneHour, interviewOneDay),
        },
      };
      const updated = await updateNotificationPreferencesRequest({ categories });
      setSaved(updated.categories);
      setDraft(updated.categories);
      showSuccessFeedback('Notification preferences saved');
    } catch (error) {
      const parsed = parseAxiosApiError(error);
      showErrorFeedback(parsed?.message ?? 'Could not save notification preferences.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card style={{ gap: theme.space.md }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.space.sm }}>
        <Bell size={18} color={theme.colors.textMuted} strokeWidth={2} />
        <Typography variant="label">Notifications</Typography>
      </View>
      <Typography variant="caption" muted style={{ marginTop: -theme.space.sm }}>
        Control alerts for job matches, reminders, and interviews.
      </Typography>

      {loading || !draft ? (
        <Typography variant="caption" muted>
          Loading preferences…
        </Typography>
      ) : (
        <>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="bodySmall" style={{ fontWeight: '600' }}>
              Match alerts
            </Typography>
            <Switch
              value={draft.matches.enabled}
              onValueChange={(enabled) =>
                setDraft({ ...draft, matches: { ...draft.matches, enabled } })
              }
            />
          </View>

          <TextField
            label="Minimum match score"
            keyboardType="number-pad"
            value={String(draft.matches.minMatchScore)}
            onChangeText={(value) =>
              setDraft({
                ...draft,
                matches: { ...draft.matches, minMatchScore: Number(value) || 0 },
              })
            }
          />

          <Typography variant="bodySmall" style={{ fontWeight: '600', marginTop: theme.space.sm }}>
            Reminders
          </Typography>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="caption">Enabled</Typography>
            <Switch
              value={draft.reminders.enabled}
              onValueChange={(enabled) =>
                setDraft({ ...draft, reminders: { ...draft.reminders, enabled } })
              }
            />
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="caption">1 hour before</Typography>
            <Switch value={reminderOneHour} onValueChange={setReminderOneHour} />
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="caption">1 day before</Typography>
            <Switch value={reminderOneDay} onValueChange={setReminderOneDay} />
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="caption">Email</Typography>
            <Switch
              value={draft.reminders.channels.email}
              onValueChange={(email) =>
                setDraft({
                  ...draft,
                  reminders: {
                    ...draft.reminders,
                    channels: { ...draft.reminders.channels, email },
                  },
                })
              }
            />
          </View>

          <Typography variant="bodySmall" style={{ fontWeight: '600', marginTop: theme.space.sm }}>
            Interviews
          </Typography>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="caption">Enabled</Typography>
            <Switch
              value={draft.interviews.enabled}
              onValueChange={(enabled) =>
                setDraft({ ...draft, interviews: { ...draft.interviews, enabled } })
              }
            />
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="caption">1 hour before</Typography>
            <Switch value={interviewOneHour} onValueChange={setInterviewOneHour} />
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="caption">1 day before</Typography>
            <Switch value={interviewOneDay} onValueChange={setInterviewOneDay} />
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="caption">Email</Typography>
            <Switch
              value={draft.interviews.channels.email}
              onValueChange={(email) =>
                setDraft({
                  ...draft,
                  interviews: {
                    ...draft.interviews,
                    channels: { ...draft.interviews.channels, email },
                  },
                })
              }
            />
          </View>

          <Button
            label={saving ? 'Saving…' : 'Save preferences'}
            block
            loading={saving}
            disabled={!dirty}
            onPress={() => void handleSave()}
          />
        </>
      )}
    </Card>
  );
}
