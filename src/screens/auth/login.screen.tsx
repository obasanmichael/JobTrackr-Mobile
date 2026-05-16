import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { ReactElement } from 'react';
import { Button, Screen, Typography } from '../../components/ui';
import type { AuthStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

export function LoginScreen({ navigation }: Props): ReactElement {
  return (
    <Screen scroll edges={['top', 'bottom', 'left', 'right']}>
      <Typography variant="hero" style={{ marginBottom: 8 }}>
        Welcome back
      </Typography>
      <Typography variant="subtitle" muted>
        UI shell · wire auth controller + API here.
      </Typography>
      <Button label="Continue to Register" variant="secondary" style={{ marginTop: 24 }} onPress={() => navigation.navigate('Register')} />
      <Typography variant="caption" muted style={{ marginTop: 24 }}>
        Form fields deliberately omitted until validation contracts are shared with web/client.
      </Typography>
    </Screen>
  );
}
