import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { ReactElement } from 'react';
import { View } from 'react-native';
import { Button, Card, Screen, Typography } from '../../components/ui';
import { MOCK_APPLICATION_ENTITY_ID } from '../../constants/mock-navigation';
import type { HomeStackParamList } from '../../navigation/types';
import { useAppTheme } from '../../theme';

type Props = NativeStackScreenProps<HomeStackParamList, 'HomeOverview'>;

export function HomeOverviewScreen({ navigation }: Props): ReactElement {
  const { theme } = useAppTheme();
  return (
    <Screen scroll>
      <Typography variant="hero" style={{ marginBottom: theme.space.sm }}>
        Home
      </Typography>
      <Typography variant="subtitle" muted>
        Summary cards · upcoming reminders · interviews will mount here once data layer exists.
      </Typography>
      <View style={{ marginTop: theme.space.xl, gap: theme.space.md }}>
        <Card>
          <Typography variant="subtitle">Next interview</Typography>
          <Typography variant="bodySmall" muted>
            Placeholder timeline row
          </Typography>
        </Card>
        <Button
          label="Open interviews (UI-only)"
          variant="secondary"
          block
          onPress={() =>
            navigation.navigate('InterviewList', { linkedApplicationId: MOCK_APPLICATION_ENTITY_ID })
          }
        />
      </View>
    </Screen>
  );
}
