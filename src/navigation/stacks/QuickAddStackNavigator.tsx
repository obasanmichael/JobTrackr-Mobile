import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { ReactElement } from 'react';

import { QuickAddApplicationScreen } from '../../screens/applications/quick-add-application.screen';
import { TabSceneContainer } from '../components/tab-scene-container';
import type { QuickAddStackParamList } from '../types';
import { useTabStackScreenOptions } from '../useTabStackScreenOptions';

const Stack = createNativeStackNavigator<QuickAddStackParamList>();

export function QuickAddStackNavigator(): ReactElement {
  const stackOptions = useTabStackScreenOptions();

  return (
    <TabSceneContainer>
      <Stack.Navigator screenOptions={stackOptions} initialRouteName="QuickAddApplication">
        {/* Tab root: single-screen stack — hero title lives in the form */}
        <Stack.Screen name="QuickAddApplication" component={QuickAddApplicationScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
    </TabSceneContainer>
  );
}
