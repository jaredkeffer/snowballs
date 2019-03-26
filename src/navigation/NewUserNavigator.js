import React from 'react';
import { createSwitchNavigator } from 'react-navigation';

import PreferencesScreen from '../screens/PreferencesScreen';
import ThankYouScreen from '../screens/ThankyouScreen';
import CreateItineraryScreen from '../screens/CreateItineraryScreen';
import ReviewItineraryScreen from '../screens/ReviewItineraryScreen';

export default NewUserNavigator = createSwitchNavigator({
  Preferences: PreferencesScreen,
  ThankYou: ThankYouScreen,
  CreateItinerary: CreateItineraryScreen,
  ReviewItinerary: ReviewItineraryScreen,
},{
  initialRouteName: 'Preferences',
});

NewUserNavigator.navigationOptions = {

};
