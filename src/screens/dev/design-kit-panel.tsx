import type { ReactElement } from 'react';
import { View, Pressable, ScrollView } from 'react-native';
import { StatusBadge } from '../../components/applications/status-badge';
import { Button, Card, EmptyState, LoadingState, TextField, Typography } from '../../components/ui';
import { APPLICATION_STATUSES } from '../../constants/application-status';
import { useAppTheme } from '../../theme';
import type { ThemePreference } from '../../theme';

const preferenceOptions: { key: ThemePreference; label: string }[] = [
  { key: 'system', label: 'Auto' },
  { key: 'light', label: 'Light' },
  { key: 'dark', label: 'Dark' },
];

/**
 * Typography + primitives gallery for visual QA — mounted from Profile → Design reference.
 * Kept intentionally free of routing concerns so navigators remain thin orchestration layers.
 */
export function DesignKitPanel(): ReactElement {
  const { theme, preference, setPreference } = useAppTheme();

  return (
    <View style={{ gap: theme.space.lg }}>
      <View style={{ marginBottom: theme.space.sm }}>
        <Typography variant="label" style={{ marginBottom: theme.space.sm }}>
          Components
        </Typography>
        <Typography variant="hero">Style reference</Typography>
        <Typography variant="subtitle" muted>
          How common UI pieces look with your current appearance setting.
        </Typography>
      </View>

      <Typography variant="label">Appearance</Typography>
      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          backgroundColor: theme.colors.surface,
          padding: theme.space.xs,
          borderRadius: theme.radii.pill,
          borderWidth: 1,
          borderColor: theme.colors.borderMuted,
          alignSelf: 'flex-start',
        }}
      >
        {preferenceOptions.map(({ key, label }) => {
          const active = preference === key;
          return (
            <Pressable
              key={key}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
              onPress={() => setPreference(key)}
              style={{
                paddingVertical: theme.space.sm,
                paddingHorizontal: theme.space.lg,
                borderRadius: theme.radii.pill,
                backgroundColor: active ? theme.colors.accentMuted : 'transparent',
              }}
            >
              <Typography variant="caption" color={active ? theme.colors.accent : theme.colors.textSecondary}>
                {label}
              </Typography>
            </Pressable>
          );
        })}
      </View>

      <Typography variant="label">Application status</Typography>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: theme.space.sm }}>
        {APPLICATION_STATUSES.map((s) => (
          <View key={s} style={{ marginRight: theme.space.sm }}>
            <StatusBadge status={s} />
          </View>
        ))}
      </ScrollView>

      <Typography variant="label">Loading & empty</Typography>
      <Card style={{ gap: theme.space.md }}>
        <LoadingState message="Updating…" />
        <EmptyState title="Nothing to show yet" description="Pull to refresh or add something new." />
      </Card>

      <Typography variant="label">Titles & body copy</Typography>
      <Card style={{ gap: theme.space.md }}>
        <Typography variant="title">Senior Product Engineer — Acme</Typography>
        <Typography variant="body">Interview tomorrow · Fully remote · $180–205k</Typography>
        <Typography variant="caption" muted>
          Updated 2 hours ago · Offer stage
        </Typography>
      </Card>

      <Typography variant="label">Buttons</Typography>
      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: theme.space.md,
        }}
      >
        <Button label="Primary" variant="primary" onPress={() => undefined} />
        <Button label="Secondary" variant="secondary" onPress={() => undefined} />
        <Button label="Outline" variant="outline" onPress={() => undefined} />
        <Button label="Danger" variant="danger" onPress={() => undefined} />
        <Button label="Ghost" variant="ghost" onPress={() => undefined} />
        <Button label="Loading…" variant="primary" loading onPress={() => undefined} />
      </View>

      <Typography variant="label">Form field</Typography>
      <Card>
        <TextField label="Work email" placeholder="you@company.com" autoCapitalize="none" keyboardType="email-address" />
      </Card>
    </View>
  );
}
