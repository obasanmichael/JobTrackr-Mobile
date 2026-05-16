import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { ReactElement } from 'react';
import { Screen, Typography } from '../../components/ui';
import type { RemindersStackParamList } from '../../navigation/types';
import { useAppTheme } from '../../theme';

type Props = NativeStackScreenProps<RemindersStackParamList, 'RemindersOverview'>;

export function RemindersOverviewScreen(_props: Props): ReactElement {
  const { theme } = useAppTheme();
  return (
    <Screen scroll>
      <Typography variant="hero">Reminders</Typography>
      <Typography variant="subtitle" muted style={{ marginTop: theme.space.sm }}>
        Completion gestures + optimistic rows hook into reminders API later.
      </Typography>
    </Screen>
  );
}
