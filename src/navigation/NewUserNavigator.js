import React from 'react';
import { createSwitchNavigator } from 'react-navigation';

import PreferencesScreen from '../screens/PreferencesScreen';

export default NewUserNavigator = createSwitchNavigator({
  Preferences: PreferencesScreen,
},{
  initialRouteName: 'Preferences',
});

NewUserNavigator.navigationOptions = {

};
