import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';
import ConciergeScreen from '../screens/ConciergeScreen';
import MarketplaceScreen from '../screens/MarketplaceScreen';
import ExploreLocalScreen from '../screens/ExploreLocalScreen';
import SettingsScreen from '../screens/SettingsScreen';
import PreferencesScreen from '../screens/PreferencesScreen';

const HomeStack = createStackNavigator({
  Home: HomeScreen,
});

HomeStack.navigationOptions = {
  tabBarLabel: 'Home',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? 'ios-home' : 'md-home'}
    />
  ),
};

const ConciergeStack = createStackNavigator({
  Concierge: ConciergeScreen,
});

ConciergeStack.navigationOptions = {
  tabBarLabel: 'Book',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ?
      `ios-checkmark-circle${focused ? '':'-outline'}` : 'md-checkmark-circle'}
    />
  ),
};

const MarketplaceStack = createStackNavigator({
  Marketplace: MarketplaceScreen,
});

MarketplaceStack.navigationOptions = {
  tabBarLabel: 'Marketplace',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? 'ios-link' : 'md-link'}
    />
  ),
};

const ExploreLocalStack = createStackNavigator({
  Settings: ExploreLocalScreen,
});

ExploreLocalStack.navigationOptions = {
  tabBarLabel: 'Local',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? 'ios-locate' : 'md-map'}
    />
  ),
};

const SettingsStack = createStackNavigator({
  Settings: SettingsScreen,
  Preferences: PreferencesScreen,
});

SettingsStack.navigationOptions = {
  tabBarLabel: 'Settings',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? 'ios-options' : 'md-options'}
    />
  ),
};


export default createBottomTabNavigator({
  HomeStack,
  ConciergeStack,
  // MarketplaceStack,
  // ExploreLocalStack,
  SettingsStack,
});
