import React from 'react';
import { ExpoConfigView } from '@expo/samples';
import { Body, Content, Container, Text, View, Button, Card, CardItem, Left, Icon } from 'native-base';
import { Auth, Cache } from 'aws-amplify';

export default class SettingsScreen extends React.Component {
  static navigationOptions = {
    title: 'Settings',
    headerBackTitle: 'Cancel',
  };

  signOut = async () => {
    Auth.signOut()
      .then( async () => {
        await Cache.clear();
        this.props.screenProps.onStateChange('signedOut', null)
      })
      .catch(err => console.log(err));
  }

  render() {

    return (
      <Container>
        <Content>
          <Card>
            <CardItem header bordered style={{justifyContent: 'center', backgroundColor: '#f8f8f8'}}>
              <Icon active name="md-person" />
              <Text style={{color: '#383838'}}>Account Settings</Text>
            </CardItem>
            <CardItem button onPress={this.signOut}>
              <Icon active name="md-log-out" />
              <Text>Sign Out</Text>
             </CardItem>
            <CardItem button onPress={() => this.props.navigation.navigate('Preferences')}>
              <Icon active name="md-switch" />
              <Text>Edit User Preferences</Text>
             </CardItem>
           </Card>
           {/* // TODO: add Feedback button here  */}
           <Card style={{paddingVertical: 20}}>
             <Body>
               <Text style={{lineHeight: 22, color: '#787878'}}>
                 Thank you for using Odyssey!
               </Text>
               <Text style={{lineHeight: 22, color: '#787878', paddingTop: 10}}>
                 Odyssey is an Odyssey Technology Inc. application. All rights reserved © {(new Date()).getFullYear()}
               </Text>
             </Body>
           </Card>
        </Content>
      </Container>
    );
  }
}
