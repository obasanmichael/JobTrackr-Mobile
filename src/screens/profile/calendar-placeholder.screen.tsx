import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { ReactElement } from 'react';
import { Calendar } from 'lucide-react-native';
import type { MoreStackParamList } from '../../navigation/types';
import { EmptyState, Screen, Typography } from '../../components/ui';
import { useAppTheme } from '../../theme';

type Props = NativeStackScreenProps<MoreStackParamList, 'CalendarPlaceholder'>;

export function CalendarPlaceholderScreen(_props: Props): ReactElement {
  const { theme } = useAppTheme();
  return (
    <Screen scroll edges={['left', 'right', 'bottom']}>
      <Typography variant="hero">Calendar</Typography>
      <Typography variant="bodySmall" muted style={{ marginTop: theme.space.sm }}>
        Google Calendar OAuth and selective sync ships in Phase V2E alongside interview exports—the same roadmap as web.
      </Typography>
      <EmptyState
        icon={Calendar}
        title="Calendar integration coming soon"
        description="You will connect Google Calendar from here once the OAuth flow endpoints are deployed."
      />
    </Screen>
  );
}
