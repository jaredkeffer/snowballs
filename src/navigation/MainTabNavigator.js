import React from 'react';
import { Platform } from 'react-native';
import { Text } from 'native-base';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';
import ConciergeScreen from '../screens/ConciergeScreen';
import MarketplaceScreen from '../screens/MarketplaceScreen';
import ExploreLocalScreen from '../screens/ExploreLocalScreen';
import SettingsScreen from '../screens/SettingsScreen';
import PreferencesScreen from '../screens/PreferencesScreen';
import CreateItineraryScreen from '../screens/CreateItineraryScreen';
import ViewItineraryScreen from '../screens/ViewItineraryScreen';
import ReviewItineraryScreen from '../screens/ReviewItineraryScreen';
import ThankyouScreen from '../screens/ThankyouScreen';
import ExperienceScreen from '../screens/ExperienceScreen';
import ArticleScreen from '../screens/ArticleScreen';

const HomeStack = createStackNavigator({
  Home: HomeScreen,
  Experience: ExperienceScreen,
  Article: ArticleScreen,
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
  Experience: ExperienceScreen,
  ViewItinerary: ViewItineraryScreen,
  NewItinerary: CreateItineraryScreen,
  ReviewItinerary: ReviewItineraryScreen,
  ThankYou: ThankyouScreen,
});

ConciergeStack.navigationOptions = {
  tabBarLabel: 'Concierge',
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
},
{
  tabBarOptions: {
    activeTintColor: '#383838',
    inactiveTintColor: '#ccc',
  }
});
