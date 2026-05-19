import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { ReactElement } from 'react';
import { CreditCard } from 'lucide-react-native';
import type { MoreStackParamList } from '../../navigation/types';
import { EmptyState, Screen, Typography } from '../../components/ui';
import { useAppTheme } from '../../theme';

type Props = NativeStackScreenProps<MoreStackParamList, 'BillingPlaceholder'>;

export function BillingPlaceholderScreen(_props: Props): ReactElement {
  const { theme } = useAppTheme();
  return (
    <Screen scroll edges={['left', 'right', 'bottom']}>
      <Typography variant="hero">Billing</Typography>
      <Typography variant="bodySmall" muted style={{ marginTop: theme.space.sm }}>
        Plans, entitlements, and billing history appear here once the backend exposes live data—matching the beta web dashboard.
      </Typography>
      <EmptyState
        icon={CreditCard}
        title="Beta access"
        description="JobTrackr is free during beta. Paid tiers and feature entitlements will surface here alongside usage limits."
      />
    </Screen>
  );
}
