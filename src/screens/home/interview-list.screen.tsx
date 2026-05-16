import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { ReactElement } from 'react';
import { useMemo } from 'react';
import { View } from 'react-native';
import { CalendarDays } from 'lucide-react-native';
import { InterviewCard } from '../../components/interviews/interview-card';
import { EmptyState, Screen, Typography } from '../../components/ui';
import { MOCK_INTERVIEWS } from '../../fixtures/mock-interviews';
import type { HomeStackParamList } from '../../navigation/types';
import { useAppTheme } from '../../theme';

type Props = NativeStackScreenProps<HomeStackParamList, 'InterviewList'>;

export function InterviewListScreen({ route }: Props): ReactElement {
  const { theme } = useAppTheme();
  const linked = route.params.linkedApplicationId;

  const rows = useMemo(() => {
    if (!linked) return MOCK_INTERVIEWS;
    return MOCK_INTERVIEWS.filter((i) => i.linkedApplicationId === linked);
  }, [linked]);

  return (
    <Screen scroll>
      <Typography variant="hero" style={{ marginBottom: theme.space.sm }}>
        Interviews
      </Typography>
      <Typography variant="subtitle" muted>
        Route reachable from Home without a fifth tab · filtered when launched with an application anchor.
      </Typography>
      <Typography
        variant="caption"
        color={linked ? theme.colors.accent : theme.colors.textMuted}
        style={{ marginTop: theme.space.sm }}
      >
        {linked ? `Filtered to application id · ${linked}` : 'Showing full fixture list'}
      </Typography>

      <View style={{ marginTop: theme.space.xl, gap: theme.space.md }}>
        {rows.length === 0 ? (
          <EmptyState
            icon={CalendarDays}
            title="No interviews scheduled"
            description="Once integration lands, this filters server-side by application."
          />
        ) : (
          rows.map((i) => <InterviewCard key={i.id} interview={i} />)
        )}
      </View>
    </Screen>
  );
}
