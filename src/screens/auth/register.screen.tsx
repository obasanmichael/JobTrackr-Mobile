import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { ReactElement } from 'react';
import { Button, Screen, Typography } from '../../components/ui';
import type { AuthStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'Register'>;

export function RegisterScreen({ navigation }: Props): ReactElement {
  return (
    <Screen scroll edges={['top', 'bottom', 'left', 'right']}>
      <Typography variant="hero" style={{ marginBottom: 8 }}>
        Create account
      </Typography>
      <Typography variant="subtitle" muted>
        Placeholder onboarding — replace with `/auth/register` flow + policy links.
      </Typography>
      <Button label="Back to Login" variant="ghost" style={{ marginTop: 24 }} onPress={() => navigation.navigate('Login')} />
    </Screen>
  );
}
