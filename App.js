import React from 'react';
import { Platform, StatusBar, StyleSheet, View } from 'react-native';
import { Root } from "native-base";
import { AppLoading, Asset, Font, Icon } from 'expo';
import AppNavigator, { FirstAppLogin } from './src/navigation/AppNavigator';
import api from './src/api';

import {ConfirmSignUp, ForgotPassword, Loading, SignIn, SignUp} from './src/components/Auth/components';

import Amplify, { Cache } from 'aws-amplify';
import { withAuthenticator } from 'aws-amplify-react-native';
import awsmobile from './src/aws-exports';

Amplify.configure(awsmobile);

class App extends React.Component {
  state = {
    isLoadingComplete: false,
  };

  async firstLogin(refreshCache) {
    let userPreferences = await api.getUserPreferences(refreshCache);
    if (userPreferences && userPreferences.preferences) this.setState({first: false});
    else this.setState({first: true});
  }

  render() {
    if (!this.state.isLoadingComplete && !this.props.skipLoadingScreen) {
      return (
        <AppLoading
          startAsync={this._loadResourcesAsync}
          onError={this._handleLoadingError}
          onFinish={this._handleFinishLoading}
        />
      );
    } else {
      return (
        <Root>
          <View style={styles.container}>
            {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
            {this.state.first && (
              <FirstAppLogin screenProps={{...this.props}}/>
            )}
            {!this.state.first && (
              <AppNavigator screenProps={{...this.props}}/>
            )}
          </View>
        </Root>
      );
    }
  }

  // TODO: look into preloading images/user/dynamo items before page load.
  _loadResourcesAsync = async () => {
    return Promise.all([
      this.firstLogin(),
      Asset.loadAsync([
        require('./src/assets/images/icon.png'),
      ]),
      // Font.loadAsync({
      //   ...Icon.Ionicons.font,
      //   'space-mono': require('./src/assets/fonts/SpaceMono-Regular.ttf'),
      // }),
    ]);
  };

  _handleLoadingError = error => {
    // In this case, you might want to report the error to your error
    // reporting service, for example Sentry
    console.warn(error);
  };

  _handleFinishLoading = () => {
    this.setState({ isLoadingComplete: true });
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

// export default App;
export default withAuthenticator(App, false, [
  <SignIn />,
  <SignUp />,
  <ConfirmSignUp />,
  <ForgotPassword />,
  <Loading />,
]);
