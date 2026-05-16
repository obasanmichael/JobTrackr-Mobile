import type { CompositeScreenProps } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { ReactElement } from 'react';
import { View } from 'react-native';
import { Button, Card, Screen, Typography } from '../../components/ui';
import type { ApplicationsStackParamList, BottomTabParamList } from '../../navigation/types';
import { useAppTheme } from '../../theme';

type Props = CompositeScreenProps<
  NativeStackScreenProps<ApplicationsStackParamList, 'ApplicationDetail'>,
  BottomTabScreenProps<BottomTabParamList>
>;

export function ApplicationDetailScreen({ navigation, route }: Props): ReactElement {
  const { theme } = useAppTheme();

  const openInterviewContext = (): void => {
    navigation.navigate('Home', {
      screen: 'InterviewList',
      params: { linkedApplicationId: route.params.applicationId },
    });
  };

  return (
    <Screen scroll>
      <Typography variant="subtitle" muted style={{ marginBottom: theme.space.xs }}>
        Application
      </Typography>
      <Typography variant="hero" style={{ marginBottom: theme.space.md }}>
        Acme Corp
      </Typography>
      <Card style={{ marginBottom: theme.space.lg, gap: theme.space.sm }}>
        <Typography variant="caption" muted>
          Route param `applicationId`:
        </Typography>
        <Typography variant="body" color={theme.colors.accent}>
          {route.params.applicationId}
        </Typography>
      </Card>
      <View style={{ gap: theme.space.sm }}>
        <Button
          label="Update status (push)"
          variant="primary"
          block
          onPress={() =>
            navigation.navigate('UpdateApplicationStatus', { applicationId: route.params.applicationId })
          }
        />
        <Button
          label="Add timeline note"
          variant="secondary"
          block
          onPress={() =>
            navigation.navigate('AddTimelineNote', { applicationId: route.params.applicationId })
          }
        />
        <Button
          label="View interviews (jump to Home tab)"
          variant="ghost"
          block
          onPress={openInterviewContext}
        />
      </View>
    </Screen>
  );
}
