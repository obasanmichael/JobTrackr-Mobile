import type { ReactElement } from 'react';
import { View, Pressable } from 'react-native';
import { Button, Card, TextField, Typography } from '../../components/ui';
import { useResponsive } from '../../layout';
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
  const responsive = useResponsive();

  return (
    <View style={{ gap: theme.space.lg }}>
      <View style={{ marginBottom: theme.space.sm }}>
        <Typography variant="label" style={{ marginBottom: theme.space.sm }}>
          Design kit
        </Typography>
        <Typography variant="hero">Tokens & primitives</Typography>
        <Typography variant="subtitle" muted>
          Baseline typography, surfaces, buttons, inputs — QA light/dark and breakpoints here.
        </Typography>
        {__DEV__ && (
          <Typography variant="caption" muted style={{ marginTop: theme.space.sm }}>
            {responsive.breakpoint.toUpperCase()}
            {responsive.isTablet ? ' · tablet' : ''}
            {responsive.isLandscape ? ' · landscape' : ' · portrait'} ·{' '}
            {Math.round(responsive.width)}×{Math.round(responsive.height)}
          </Typography>
        )}
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

      <Typography variant="label">Typography scale</Typography>
      <Card style={{ gap: theme.space.md }}>
        <Typography variant="title">Senior Product Engineer — Acme</Typography>
        <Typography variant="body">Interview tomorrow · Fully remote · $180–205k</Typography>
        <Typography variant="caption" muted>
          Updated 2 hours ago · Offer stage
        </Typography>
      </Card>

      <Typography variant="label">Actions</Typography>
      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: theme.space.md,
        }}
      >
        <Button label="Primary" variant="primary" onPress={() => undefined} />
        <Button label="Secondary" variant="secondary" onPress={() => undefined} />
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
