import React from 'react';
import { ExpoConfigView } from '@expo/samples';
import { ScrollView, Button, StyleSheet, View } from 'react-native';
import { Auth, Cache } from 'aws-amplify';

export default class SettingsScreen extends React.Component {
  static navigationOptions = {
    title: 'Settings',
    headerBackTitle: 'Cancel',
  };

  signOut = async () => {
    Auth.signOut()
        .then(() => this.props.screenProps.onStateChange('signedOut', null))
        .catch(err => console.log(err));
  }

  render() {

    return (
      <View style={styles.container}>
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
          <View style={styles.settingsContainer}>
            <Button style={styles.signOutBtn}
              onPress={this.signOut}
              title="Sign Out"
              color="#841584"/>
          </View>
          <View style={styles.settingsContainer}>
            <Button style={styles.signOutBtn}
              onPress={() => this.props.navigation.navigate('Preferences')}
              title="Edit Preferences"
              color="#841584"/>
          </View>
        </ScrollView>
      </View>
    );
  }
}

let styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  settingsContainer: {
    alignItems: 'center',
    marginTop: 50,
    marginBottom: 20,
  },
  signOutBtn: {
    alignItems: 'center',
    marginTop: 30,
  }
})
