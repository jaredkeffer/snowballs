import React from 'react';
import { Cache } from 'aws-amplify';
import { Content, Button, H1, H2, H3 } from 'native-base';
import {ImageBackground, Image, View, SafeAreaView, StyleSheet, Text } from 'react-native';
import layout from '../constants/Layout';
import Preference from '../components/Preference';
import api from '../api';

export default class ThankYouScreen extends React.PureComponent {

  static navigationOptions = {
    title: "Thank You",
  };

  render() {
    let { title, subtitle, nextScreen, buttonText, refreshCache, screenOptions } = this.props.navigation.state.params;

    return (
      <SafeAreaView style={styles.container}>
        <Content style={[styles.container,]} contentContainerStyle={{ justifyContent: 'center', flex: 1 }}>
          <View style={{backgroundColor: 'transparent', alignItems:'center'}}>
            <Image style={{width: 180, height: 180,}} source={require('../assets/images/icon.png')}/>
            <Text style={{fontSize: 40, paddingHorizontal: 10}}>{title}</Text>
            <H3 style={{padding: 10, paddingVertical: 20}}>
              {subtitle}
            </H3>
            <Button block style={{backgroundColor: '#383838', marginHorizontal: 10}}
              onPress={() => this.props.navigation.navigate(nextScreen, {...screenOptions, refreshCache})}
            >
              <Text style={{color: 'white', fontSize: 16}}>{(buttonText) ? buttonText : 'Next'}</Text>
            </Button>
          </View>
        </Content>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
});
