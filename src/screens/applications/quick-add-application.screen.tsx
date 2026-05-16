import type { CompositeScreenProps } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { ReactElement } from 'react';
import { Screen, Typography } from '../../components/ui';
import type { QuickAddStackParamList, BottomTabParamList } from '../../navigation/types';
import { useAppTheme } from '../../theme';

type Props = CompositeScreenProps<
  NativeStackScreenProps<QuickAddStackParamList, 'QuickAddApplication'>,
  BottomTabScreenProps<BottomTabParamList>
>;

export function QuickAddApplicationScreen(_props: Props): ReactElement {
  const { theme } = useAppTheme();
  return (
    <Screen scroll>
      <Typography variant="hero">Quick add</Typography>
      <Typography variant="subtitle" muted style={{ marginTop: theme.space.sm }}>
        Fast capture optimised for thumbs — parity with desktop create flow minus advanced fields until V2.
      </Typography>
    </Screen>
  );
}
