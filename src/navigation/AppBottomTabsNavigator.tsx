import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import type { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';
import type { ReactElement } from 'react';
import type { BottomTabParamList } from './types';
import { FloatingBottomTabBar } from './components/FloatingBottomTabBar';
import { ApplicationsStackNavigator } from './stacks/ApplicationsStackNavigator';
import { HomeStackNavigator } from './stacks/HomeStackNavigator';
import { MoreStackNavigator } from './stacks/MoreStackNavigator';
import { QuickAddStackNavigator } from './stacks/QuickAddStackNavigator';
import { RemindersStackNavigator } from './stacks/RemindersStackNavigator';

const Tab = createBottomTabNavigator<BottomTabParamList>();

type BottomTabScreenOpts = BottomTabNavigationOptions & {
  tabBarAccessibilityHint?: string;
};

const tabOptionsFactory =
  (): Record<keyof BottomTabParamList, BottomTabScreenOpts> =>
    ({
      Home: {
        tabBarLabel: 'Home',
        title: 'Home',
        tabBarAccessibilityHint: 'Opens the Home dashboard tab.',
      },
      Applications: {
        tabBarLabel: 'Applications',
        title: 'Applications',
        tabBarAccessibilityHint: 'Opens your applications list.',
      },
      QuickAdd: {
        tabBarLabel: 'Add',
        title: 'Quick add',
        tabBarAccessibilityLabel: 'Quick add',
        tabBarAccessibilityHint: 'Opens quick add for a new application.',
      },
      Reminders: {
        tabBarLabel: 'Reminders',
        title: 'Reminders',
        tabBarAccessibilityHint: 'Opens reminders.',
      },
      More: {
        tabBarLabel: 'More',
        title: 'More',
        tabBarAccessibilityLabel: 'More',
        tabBarAccessibilityHint: 'Opens Discover settings and workspaces.',
      },
    });

export function AppBottomTabsNavigator(): ReactElement {
  const tabOptions = tabOptionsFactory();
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
      }}
      tabBar={(props) => <FloatingBottomTabBar {...props} />}
    >
      <Tab.Screen name="Home" component={HomeStackNavigator} options={tabOptions.Home} />
      <Tab.Screen name="Applications" component={ApplicationsStackNavigator} options={tabOptions.Applications} />
      <Tab.Screen name="QuickAdd" component={QuickAddStackNavigator} options={tabOptions.QuickAdd} />
      <Tab.Screen name="Reminders" component={RemindersStackNavigator} options={tabOptions.Reminders} />
      <Tab.Screen name="More" component={MoreStackNavigator} options={tabOptions.More} />
    </Tab.Navigator>
  );
}
