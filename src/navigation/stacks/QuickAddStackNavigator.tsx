import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { ReactElement } from 'react';
import { QuickAddApplicationScreen } from '../../screens/applications/quick-add-application.screen';
import type { QuickAddStackParamList } from '../types';
import { TabSceneContainer } from '../components/tab-scene-container';

const Stack = createNativeStackNavigator<QuickAddStackParamList>();

export function QuickAddStackNavigator(): ReactElement {
  return (
    <TabSceneContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="QuickAddApplication">
        <Stack.Screen name="QuickAddApplication" component={QuickAddApplicationScreen} />
      </Stack.Navigator>
    </TabSceneContainer>
  );
}
