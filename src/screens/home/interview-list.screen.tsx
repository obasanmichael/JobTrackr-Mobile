import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { ReactElement } from 'react';
import { Screen, Typography } from '../../components/ui';
import type { HomeStackParamList } from '../../navigation/types';
import { useAppTheme } from '../../theme';

type Props = NativeStackScreenProps<HomeStackParamList, 'InterviewList'>;

export function InterviewListScreen({ route }: Props): ReactElement {
  const { theme } = useAppTheme();
  const linked = route.params.linkedApplicationId;

  return (
    <Screen scroll>
      <Typography variant="hero" style={{ marginBottom: theme.space.sm }}>
        Interviews
      </Typography>
      <Typography variant="subtitle" muted>
        List + calendar affordances arrive with integration. This route is reachable without a fifth tab via Home.
      </Typography>
      <Typography
        variant="caption"
        color={linked ? theme.colors.accent : theme.colors.textMuted}
        style={{ marginTop: theme.space.lg }}
      >
        {linked
          ? `Linked application hint (routing only): ${linked}`
          : 'Opened without a contextual application anchor.'}
      </Typography>
    </Screen>
  );
}
