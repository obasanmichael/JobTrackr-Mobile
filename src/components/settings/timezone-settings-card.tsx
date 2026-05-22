import { Clock } from 'lucide-react-native';
import { useMemo, useState, type ReactElement } from 'react';
import { Modal, Pressable, ScrollView, View } from 'react-native';
import { Button, Card, Typography } from '../ui';
import {
  buildTimezoneOptions,
  formatTimezoneLabel,
  getDeviceTimezone,
} from '../../lib/timezones';
import { updateUserProfileRequest } from '../../services/users.service';
import { parseAxiosApiError } from '../../services/api';
import { showErrorFeedback, showSuccessFeedback } from '../../lib/feedback';
import { useAuthStore } from '../../store/auth.store';
import { useAppTheme } from '../../theme';

export function TimezoneSettingsCard(): ReactElement {
  const { theme } = useAppTheme();
  const user = useAuthStore((s) => s.user);
  const refreshUser = useAuthStore((s) => s.refreshUser);
  const deviceTimezone = getDeviceTimezone();
  const savedTimezone = user?.timezone ?? deviceTimezone;
  const [timezoneDraft, setTimezoneDraft] = useState<string | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const timezone = timezoneDraft ?? savedTimezone;

  const options = useMemo(() => buildTimezoneOptions(timezone), [timezone]);
  const dirty = user?.timezone == null || timezone !== user.timezone;

  async function handleSave(): Promise<void> {
    setSaving(true);
    try {
      await updateUserProfileRequest({ timezone });
      await refreshUser();
      setTimezoneDraft(null);
      showSuccessFeedback('Timezone updated');
    } catch (error) {
      const parsed = parseAxiosApiError(error);
      showErrorFeedback(parsed?.message ?? 'Could not update timezone.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card style={{ gap: theme.space.md }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.space.sm }}>
        <Clock size={18} color={theme.colors.textMuted} strokeWidth={2} />
        <Typography variant="label">Timezone</Typography>
      </View>
      <Typography variant="caption" muted style={{ marginTop: -theme.space.sm }}>
        Used for reminders, interviews, and scheduled notifications.
      </Typography>

      <Pressable
        accessibilityRole="button"
        onPress={() => setPickerOpen(true)}
        style={{
          borderWidth: 1,
          borderColor: theme.colors.borderMuted,
          borderRadius: theme.radii.md,
          paddingHorizontal: theme.space.md,
          paddingVertical: theme.space.md,
          backgroundColor: theme.colors.surface,
        }}
      >
        <Typography variant="bodySmall">{formatTimezoneLabel(timezone)}</Typography>
      </Pressable>

      {!user?.timezone ? (
        <Typography variant="caption" muted>
          No timezone saved yet. Your device default is {formatTimezoneLabel(deviceTimezone)}.
        </Typography>
      ) : null}

      <Button
        label={saving ? 'Saving…' : 'Save timezone'}
        block
        loading={saving}
        disabled={!dirty}
        onPress={() => void handleSave()}
      />

      <Modal
        visible={pickerOpen}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setPickerOpen(false)}
      >
        <View style={{ flex: 1, backgroundColor: theme.colors.background, padding: theme.space.lg }}>
          <Typography variant="label">Select timezone</Typography>
          <ScrollView style={{ marginTop: theme.space.md }}>
            {options.map((option) => {
              const selected = option === timezone;
              return (
                <Pressable
                  key={option}
                  accessibilityRole="button"
                  onPress={() => {
                    setTimezoneDraft(option);
                    setPickerOpen(false);
                  }}
                  style={{
                    paddingVertical: theme.space.md,
                    borderBottomWidth: 1,
                    borderBottomColor: theme.colors.borderMuted,
                  }}
                >
                  <Typography
                    variant="bodySmall"
                    color={selected ? theme.colors.accent : theme.colors.textPrimary}
                  >
                    {formatTimezoneLabel(option)}
                    {option === deviceTimezone ? ' · device' : ''}
                  </Typography>
                </Pressable>
              );
            })}
          </ScrollView>
          <Button
            label="Close"
            variant="secondary"
            block
            onPress={() => setPickerOpen(false)}
            style={{ marginTop: theme.space.md }}
          />
        </View>
      </Modal>
    </Card>
  );
}
