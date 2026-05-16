import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { ReactElement } from 'react';
import { View } from 'react-native';
import { Button, Screen, Typography } from '../../components/ui';
import type { ProfileStackParamList } from '../../navigation/types';
import { useAppTheme } from '../../theme';

type Props = NativeStackScreenProps<ProfileStackParamList, 'ProfileOverview'>;

export function ProfileOverviewScreen({ navigation }: Props): ReactElement {
  const { theme } = useAppTheme();
  return (
    <Screen scroll>
      <Typography variant="hero">Profile</Typography>
      <Typography variant="subtitle" muted style={{ marginTop: theme.space.sm }}>
        Account summary · logout · preferences ship alongside auth persistence.
      </Typography>
      {__DEV__ && (
        <View style={{ marginTop: theme.space.xl }}>
          <Button label="Design kit / primitives QA" variant="secondary" block onPress={() => navigation.navigate('DesignReference')} />
        </View>
      )}
    </Screen>
  );
}
