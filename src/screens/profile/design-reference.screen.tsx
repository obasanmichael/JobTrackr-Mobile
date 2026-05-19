import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { ReactElement } from 'react';
import { Screen, Typography } from '../../components/ui';
import { DesignKitPanel } from '../dev/design-kit-panel';
import type { MoreStackParamList } from '../../navigation/types';
import { useAppTheme } from '../../theme';

type Props = NativeStackScreenProps<MoreStackParamList, 'DesignReference'>;

export function DesignReferenceScreen(_props: Props): ReactElement {
  const { theme } = useAppTheme();

  if (__DEV__) {
    return (
      <Screen scroll edges={['left', 'right', 'bottom']}>
        <DesignKitPanel />
      </Screen>
    );
  }

  return (
    <Screen scroll edges={['left', 'right', 'bottom']}>
      <Typography variant="hero">Design reference</Typography>
      <Typography variant="subtitle" muted style={{ marginTop: theme.space.sm }}>
        This screen is only available in internal development builds.
      </Typography>
    </Screen>
  );
}
