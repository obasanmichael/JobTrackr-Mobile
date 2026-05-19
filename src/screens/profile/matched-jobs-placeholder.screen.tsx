import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { ReactElement } from 'react';
import { Sparkles } from 'lucide-react-native';
import type { ProfileStackParamList } from '../../navigation/types';
import { EmptyState, Screen, Typography } from '../../components/ui';
import { useAppTheme } from '../../theme';

type Props = NativeStackScreenProps<ProfileStackParamList, 'MatchedJobsPlaceholder'>;

export function MatchedJobsPlaceholderScreen(_props: Props): ReactElement {
  const { theme } = useAppTheme();
  return (
    <Screen scroll>
      <Typography variant="hero">Matched jobs</Typography>
      <Typography variant="bodySmall" muted style={{ marginTop: theme.space.sm }}>
        AI-ranked recommendations grounded in your candidate profile land in Phase V2B once matching endpoints ship—parity with web.
      </Typography>
      <EmptyState
        icon={Sparkles}
        title="Matching is preview-only"
        description="Upload your resume first so scoring and rationale stay ready once the workspace wires matching endpoints."
      />
    </Screen>
  );
}
