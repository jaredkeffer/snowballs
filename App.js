import React from 'react';
import { Platform, StatusBar, StyleSheet } from 'react-native';
import { Root, View, Text } from "native-base";
import { AppLoading } from 'expo';
import { Asset } from 'expo-asset';
import { SkypeIndicator } from 'react-native-indicators';

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
        <View style={[styles.container, {justifyContent: 'center', alignItems: 'center'}]}>
          <SkypeIndicator color='#383838' size={75}/>
          <Text style={{color: '#787878', marginBottom: 50}}>Odyssey Technology Inc. All Rights Reserved.</Text>
          <AppLoading
            startAsync={this._loadResourcesAsync}
            onError={this._handleLoadingError}
            onFinish={this._handleFinishLoading}
          />
        </View>
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
    const images = [
      require('./src/assets/images/icon.png'),
      require('./src/assets/images/canal-venice-gondola.jpg'),
    ];
    const cacheImages = images.map((image) => {
      return Asset.fromModule(image).downloadAsync();
    });

    return Promise.all([
      // uncomment for production to add refresh on app load
      this.firstLogin(true),
      cacheImages,
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
