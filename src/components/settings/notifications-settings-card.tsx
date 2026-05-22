import { Bell } from 'lucide-react-native';
import { useEffect, useState, type ReactElement } from 'react';
import { Switch, View } from 'react-native';
import { Button, Card, TextField, Typography } from '../ui';
import {
  getMatchAlertPreferencesRequest,
  updateMatchAlertPreferencesRequest,
} from '../../services/match-alert.service';
import { parseAxiosApiError } from '../../services/api';
import { showErrorFeedback, showSuccessFeedback } from '../../lib/feedback';
import { useAppTheme } from '../../theme';

export function NotificationsSettingsCard(): ReactElement {
  const { theme } = useAppTheme();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const [minMatchScore, setMinMatchScore] = useState('70');
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [savedEnabled, setSavedEnabled] = useState(false);
  const [savedMinMatchScore, setSavedMinMatchScore] = useState('70');
  const [savedEmailEnabled, setSavedEmailEnabled] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      try {
        const prefs = await getMatchAlertPreferencesRequest();
        if (cancelled) return;

        const email = prefs.channels?.email ?? true;
        const score = String(prefs.minMatchScore);
        setEnabled(prefs.enabled);
        setMinMatchScore(score);
        setEmailEnabled(email);
        setSavedEnabled(prefs.enabled);
        setSavedMinMatchScore(score);
        setSavedEmailEnabled(email);
      } catch (error) {
        if (!cancelled) {
          const parsed = parseAxiosApiError(error);
          showErrorFeedback(parsed?.message ?? 'Could not load notification preferences.');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  const dirty =
    enabled !== savedEnabled ||
    minMatchScore !== savedMinMatchScore ||
    emailEnabled !== savedEmailEnabled;

  async function handleSave(): Promise<void> {
    const score = Number(minMatchScore);
    if (!Number.isInteger(score) || score < 0 || score > 100) {
      showErrorFeedback('Match score must be a whole number between 0 and 100.');
      return;
    }

    setSaving(true);
    try {
      const updated = await updateMatchAlertPreferencesRequest({
        enabled,
        minMatchScore: score,
        channels: { email: emailEnabled, push: false },
      });
      setSavedEnabled(updated.enabled);
      setSavedMinMatchScore(String(updated.minMatchScore));
      setSavedEmailEnabled(updated.channels?.email ?? emailEnabled);
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
        Get notified when new jobs match your profile above a score threshold.
      </Typography>

      {loading ? (
        <Typography variant="caption" muted>
          Loading preferences…
        </Typography>
      ) : (
        <>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: theme.space.md,
            }}
          >
            <View style={{ flex: 1 }}>
              <Typography variant="bodySmall" style={{ fontWeight: '600' }}>
                Match alerts
              </Typography>
              <Typography variant="caption" muted>
                Turn on alerts for high-scoring job matches.
              </Typography>
            </View>
            <Switch value={enabled} onValueChange={setEnabled} />
          </View>

          <TextField
            label="Minimum match score"
            keyboardType="number-pad"
            value={minMatchScore}
            onChangeText={setMinMatchScore}
          />
          <Typography variant="caption" muted>
            Only jobs scoring at or above this threshold trigger alerts.
          </Typography>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: theme.space.md,
            }}
          >
            <View style={{ flex: 1 }}>
              <Typography variant="bodySmall" style={{ fontWeight: '600' }}>
                Email notifications
              </Typography>
              <Typography variant="caption" muted>
                Delivery is being rolled out. Preferences are saved now.
              </Typography>
            </View>
            <Switch value={emailEnabled} onValueChange={setEmailEnabled} />
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
