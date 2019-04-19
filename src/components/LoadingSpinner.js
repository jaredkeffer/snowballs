import React, { PureComponent } from 'react';

import { Content, Thumbnail, Text, View, } from 'native-base';

export default class LoadingSpinner extends PureComponent {
  render() {
    return (
      <Content>
        <View style={{paddingTop: 30, alignItems: 'center'}}>
          <Text style={{textAlign: 'center', padding: 20}}>Loading...</Text>
          <Thumbnail style={{width: 75, height: 75}} source={require('../assets/images/black-logo-no-bg.png')}/>
        </View>
      </Content>
    )
  }
}
