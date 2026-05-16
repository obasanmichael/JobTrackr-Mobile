import type { CompositeScreenProps } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { ReactElement } from 'react';
import { Screen, Typography } from '../../components/ui';
import type { ApplicationsStackParamList, BottomTabParamList } from '../../navigation/types';
import { useAppTheme } from '../../theme';

type Props = CompositeScreenProps<
  NativeStackScreenProps<ApplicationsStackParamList, 'AddTimelineNote'>,
  BottomTabScreenProps<BottomTabParamList>
>;

export function AddTimelineNoteScreen({ route }: Props): ReactElement {
  const { theme } = useAppTheme();
  return (
    <Screen scroll>
      <Typography variant="hero">Add note</Typography>
      <Typography variant="body" muted style={{ marginTop: theme.space.sm }}>
        ApplicationId: {route.params.applicationId}
      </Typography>
      <Typography variant="caption" muted style={{ marginTop: theme.space.md }}>
        Mirror web timeline validation (Zod) before enabling submit.
      </Typography>
    </Screen>
  );
}
