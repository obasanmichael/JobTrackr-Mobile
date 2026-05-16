import type { CompositeScreenProps } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { ReactElement } from 'react';
import { useEffect, useState } from 'react';
import { Alert, Pressable, View } from 'react-native';
import { Button, LoadingState, Screen, Typography } from '../../components/ui';
import type { ApplicationStatus } from '../../constants/application-status';
import { APPLICATION_STATUSES, STATUS_LABELS } from '../../constants/application-status';
import { UI_SCAFFOLD_BYPASS_AUTHENTICATION } from '../../config/ui-scaffold';
import { parseAxiosApiError } from '../../services/api';
import { getMockApplicationById } from '../../fixtures/mock-applications';
import { useDomainQueriesEnabled } from '../../hooks/use-domain-queries-enabled';
import type { ApplicationsStackParamList, BottomTabParamList } from '../../navigation/types';
import { useApplicationDetailQuery, useUpdateApplicationMutation } from '../../query/jt-queries';
import { useAppTheme } from '../../theme';

type Props = CompositeScreenProps<
  NativeStackScreenProps<ApplicationsStackParamList, 'UpdateApplicationStatus'>,
  BottomTabScreenProps<BottomTabParamList>
>;

export function UpdateApplicationStatusScreen({ navigation, route }: Props): ReactElement {
  const { theme } = useAppTheme();
  const scaffold = UI_SCAFFOLD_BYPASS_AUTHENTICATION;
  const apiOn = useDomainQueriesEnabled();
  const applicationId = route.params.applicationId;

  const mock = scaffold ? getMockApplicationById(applicationId) : undefined;
  const remote = useApplicationDetailQuery(apiOn && !scaffold, applicationId);

  const [selected, setSelected] = useState<ApplicationStatus>('APPLIED');

  const patch = useUpdateApplicationMutation(applicationId);

  useEffect(() => {
    const next = scaffold ? mock?.status ?? 'APPLIED' : remote.data?.status ?? 'APPLIED';
    setSelected(next);
  }, [applicationId, mock?.status, remote.data?.status, scaffold]);

  const subtitle = scaffold
    ? `Fixture palette · navigation id ${applicationId}`
    : apiOn
      ? `PATCH /applications/:id sends uppercase enums exactly like Nest validates.`
      : 'Authenticate with EXPO_PUBLIC_API_URL configured to persist status.';

  const persist = (): void => {
    if (!apiOn || scaffold) {
      Alert.alert('Read-only scaffold', 'Turn off scaffold and sign in against the API to save changes.');
      return;
    }
    patch.mutate(
      { status: selected },
      {
        onSuccess: () => navigation.goBack(),
        onError: (error) => {
          const normalized = parseAxiosApiError(error);
          Alert.alert(
            'Status did not persist',
            normalized?.message ?? 'Unexpected backend error while updating.',
          );
        },
      },
    );
  };

  const boot = apiOn && !scaffold && remote.isPending;

  if (boot) {
    return (
      <Screen scroll>
        <LoadingState message="Fetching application..." />
      </Screen>
    );
  }

  return (
    <Screen scroll>
      <Typography variant="hero">Update status</Typography>
      <Typography variant="bodySmall" muted style={{ marginTop: theme.space.sm }}>
        {subtitle}
      </Typography>

      {apiOn && !scaffold && remote.isError ? (
        <Typography variant="caption" color={theme.colors.danger} style={{ marginTop: theme.space.sm }}>
          {(remote.error as Error)?.message ?? 'Unable to load application'}
        </Typography>
      ) : null}

      <Typography variant="caption" muted style={{ marginTop: theme.space.md }}>
        Tap a pill to preview the PATCH payload preview below.
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
        Payload preview
      </Typography>
      <Typography variant="body" color={theme.colors.accent} style={{ marginTop: theme.space.sm }}>
        {JSON.stringify({ status: selected })}
      </Typography>

      <Button
        label={patch.isPending ? 'Saving status…' : apiOn && !scaffold ? 'Save status' : 'Save (requires API session)'}
        variant="primary"
        block
        style={{ marginTop: theme.space.xl }}
        disabled={patch.isPending || !apiOn || scaffold}
        onPress={() => persist()}
      />
      <Typography variant="caption" muted style={{ marginTop: theme.space.sm }}>
        Status changes mint a Nest timeline entry automatically (`STATUS_CHANGE`).
      </Typography>
    </Screen>
  );
}
