import React from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';

import MainTabNavigator from './MainTabNavigator';
import NewUserNavigator from './NewUserNavigator';

export default createAppContainer(createSwitchNavigator({
  // You could add another route here for authentication.
  // Read more at https://reactnavigation.org/docs/en/auth-flow.html
  Main: MainTabNavigator,
  NewUser: NewUserNavigator,
}, {
  initialRouteName: 'Main',
},
));

export const FirstAppLogin = createAppContainer(createSwitchNavigator({
  // You could add another route here for authentication.
  // Read more at https://reactnavigation.org/docs/en/auth-flow.html
  Main: MainTabNavigator,
  NewUser: NewUserNavigator,
}, {
  initialRouteName: 'NewUser',
},
));
