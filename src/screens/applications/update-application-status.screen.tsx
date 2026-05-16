import type { CompositeScreenProps } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { ReactElement } from 'react';
import { useMemo, useState } from 'react';
import { Pressable, View } from 'react-native';
import { Screen, Typography } from '../../components/ui';
import type { ApplicationStatus } from '../../constants/application-status';
import { APPLICATION_STATUSES, STATUS_LABELS } from '../../constants/application-status';
import { getMockApplicationById } from '../../fixtures/mock-applications';
import type { ApplicationsStackParamList, BottomTabParamList } from '../../navigation/types';
import { useAppTheme } from '../../theme';

type Props = CompositeScreenProps<
  NativeStackScreenProps<ApplicationsStackParamList, 'UpdateApplicationStatus'>,
  BottomTabScreenProps<BottomTabParamList>
>;

export function UpdateApplicationStatusScreen({ route }: Props): ReactElement {
  const { theme } = useAppTheme();

  const initial = useMemo(() => {
    return getMockApplicationById(route.params.applicationId)?.status ?? ('APPLIED' satisfies ApplicationStatus);
  }, [route.params.applicationId]);

  const [selected, setSelected] = useState<ApplicationStatus>(initial);

  return (
    <Screen scroll>
      <Typography variant="hero">Update status</Typography>
      <Typography variant="bodySmall" muted style={{ marginTop: theme.space.sm }}>
        Fixture id · {route.params.applicationId}
      </Typography>
      <Typography variant="caption" muted style={{ marginTop: theme.space.md }}>
        Tap a chip · mutation payloads must send uppercase enums exactly as Nest expects (PRD §12).
      </Typography>

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: theme.space.sm, marginTop: theme.space.xl }}>
        {APPLICATION_STATUSES.map((status) => {
          const active = selected === status;
          return (
            <Pressable
              key={status}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
              onPress={() => setSelected(status)}
              style={{
                paddingHorizontal: theme.space.md,
                paddingVertical: theme.space.sm,
                borderRadius: theme.radii.pill,
                borderWidth: active ? 2 : 1,
                borderColor: active ? theme.colors.accent : theme.colors.borderMuted,
                backgroundColor: active ? theme.colors.accentMuted : theme.colors.surfaceElevated,
              }}
            >
              <Typography variant="caption" style={{ fontWeight: '600', color: theme.colors.textPrimary }}>
                {STATUS_LABELS[status]}
              </Typography>
            </Pressable>
          );
        })}
      </View>

      <Typography variant="label" style={{ marginTop: theme.space.xl }}>
        Payload preview (UI-only)
      </Typography>
      <Typography variant="body" color={theme.colors.accent} style={{ marginTop: theme.space.sm }}>
        {selected}
      </Typography>
    </Screen>
  );
}
