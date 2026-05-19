import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import type { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';
import type { ReactElement } from 'react';
import type { BottomTabParamList } from './types';
import { FloatingBottomTabBar } from './components/FloatingBottomTabBar';
import { ApplicationsStackNavigator } from './stacks/ApplicationsStackNavigator';
import { HomeStackNavigator } from './stacks/HomeStackNavigator';
import { ProfileStackNavigator } from './stacks/ProfileStackNavigator';
import { QuickAddStackNavigator } from './stacks/QuickAddStackNavigator';
import { RemindersStackNavigator } from './stacks/RemindersStackNavigator';

const Tab = createBottomTabNavigator<BottomTabParamList>();

const tabOptionsFactory =
  (): Record<keyof BottomTabParamList, BottomTabNavigationOptions> =>
    ({
      Home: { tabBarLabel: 'Home', title: 'Home' },
      Applications: { tabBarLabel: 'Applications', title: 'Applications' },
      QuickAdd: { tabBarLabel: 'Add', title: 'Quick add', tabBarAccessibilityLabel: 'Quick add' },
      Reminders: { tabBarLabel: 'Reminders', title: 'Reminders' },
      Profile: { tabBarLabel: 'Settings', title: 'Settings', tabBarAccessibilityLabel: 'Settings' },
    }) as const;

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
      <Tab.Screen name="Profile" component={ProfileStackNavigator} options={tabOptions.Profile} />
    </Tab.Navigator>
  );
}
