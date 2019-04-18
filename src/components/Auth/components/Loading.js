import React from 'react';
import { View, Image, Text } from 'react-native';
import { I18n } from 'aws-amplify';
import AuthPiece from './AuthPiece';
import { Header } from '../AmplifyUI';

export default class Loading extends AuthPiece {
  constructor(props) {
    super(props);

    this._validAuthStates = ['loading'];
  }

  showComponent(theme) {
    return (
      <View style={{flex: 1, alignItems: 'center', textAlign: 'center'}}>
        <Image style={{width: '100%'}} source={require('../../../assets/images/icon.png')}/>
        <Text>Loading Odyssey...</Text>
      </View>
    )
  }
}
