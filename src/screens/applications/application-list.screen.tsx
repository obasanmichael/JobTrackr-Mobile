import type { CompositeScreenProps } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { ReactElement } from 'react';
import { View } from 'react-native';
import { Button, Card, Screen, Typography } from '../../components/ui';
import { MOCK_APPLICATION_ENTITY_ID } from '../../constants/mock-navigation';
import type { ApplicationsStackParamList, BottomTabParamList } from '../../navigation/types';
import { useAppTheme } from '../../theme';

type Props = CompositeScreenProps<
  NativeStackScreenProps<ApplicationsStackParamList, 'ApplicationList'>,
  BottomTabScreenProps<BottomTabParamList>
>;

export function ApplicationListScreen({ navigation }: Props): ReactElement {
  const { theme } = useAppTheme();
  return (
    <Screen scroll>
      <Typography variant="hero">Applications</Typography>
      <Typography variant="subtitle" muted style={{ marginTop: theme.space.xs }}>
        Search, filters, and pull-to-refresh ship with data hooks.
      </Typography>
      <View style={{ marginTop: theme.space.xl }}>
        <Card style={{ gap: theme.space.sm }}>
          <Typography variant="title">Acme Corp — Staff Engineer</Typography>
          <Typography variant="caption" muted>
            Status · Remote · Salary TBD · ID {MOCK_APPLICATION_ENTITY_ID}
          </Typography>
          <Button
            label="Open detail (routing shell)"
            variant="secondary"
            onPress={() =>
              navigation.navigate('ApplicationDetail', { applicationId: MOCK_APPLICATION_ENTITY_ID })
            }
          />
        </Card>
      </View>
    </Screen>
  );
}
