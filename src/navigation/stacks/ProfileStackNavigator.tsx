import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { ReactElement } from 'react';
import { DesignReferenceScreen } from '../../screens/profile/design-reference.screen';
import { ProfileOverviewScreen } from '../../screens/profile/profile-overview.screen';
import type { ProfileStackParamList } from '../types';
import { TabSceneContainer } from '../components/tab-scene-container';

const Stack = createNativeStackNavigator<ProfileStackParamList>();

export function ProfileStackNavigator(): ReactElement {
  return (
    <TabSceneContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="ProfileOverview">
        <Stack.Screen name="ProfileOverview" component={ProfileOverviewScreen} />
        <Stack.Screen name="DesignReference" component={DesignReferenceScreen} />
      </Stack.Navigator>
    </TabSceneContainer>
  );
}
