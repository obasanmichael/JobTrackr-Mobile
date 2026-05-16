import type { CompositeScreenProps } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { ReactElement } from 'react';
import { Screen, Typography } from '../../components/ui';
import type { ApplicationsStackParamList, BottomTabParamList } from '../../navigation/types';
import { useAppTheme } from '../../theme';

type Props = CompositeScreenProps<
  NativeStackScreenProps<ApplicationsStackParamList, 'UpdateApplicationStatus'>,
  BottomTabScreenProps<BottomTabParamList>
>;

export function UpdateApplicationStatusScreen({ route }: Props): ReactElement {
  const { theme } = useAppTheme();
  return (
    <Screen scroll>
      <Typography variant="hero">Update status</Typography>
      <Typography variant="body" muted style={{ marginTop: theme.space.sm }}>
        ApplicationId: {route.params.applicationId}
      </Typography>
      <Typography variant="caption" muted style={{ marginTop: theme.space.md }}>
        Picker wiring + mutations land with API integration · keep payloads aligned with NestJS DTOs.
      </Typography>
    </Screen>
  );
}
