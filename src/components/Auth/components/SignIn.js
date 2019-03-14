import React from 'react';
import { View, TouchableWithoutFeedback, Keyboard, Image } from 'react-native';
import { Auth, I18n, Logger, JS } from 'aws-amplify';
import AuthPiece from './AuthPiece';
import { AmplifyButton, FormField, LinkCell, Header } from '../AmplifyUI';
import { Button, Container, Content, Form, Item, Input, Label, Text, Toast, Root } from 'native-base';

const logger = new Logger('SignIn');

export default class SignIn extends AuthPiece {
    constructor(props) {
      super(props);

      this._validAuthStates = ['signIn', 'signedOut', 'signedUp'];
      this.state = {
        username: null,
        password: null,
        showToast: false,
      };

      this.checkContact = this.checkContact.bind(this);
      this.signIn = this.signIn.bind(this);
    }

    signIn() {
      const { username, password } = this.state;

      this.setState({loading: true});
      logger.debug('Sign In for ' + username);

      Keyboard.dismiss();

      Auth.signIn(username, password).then(user => {
        logger.debug(user);
        const requireMFA = user.Session !== null;
        if (user.challengeName === 'SMS_MFA') {
          this.changeState('confirmSignIn', user);
        } else if (user.challengeName === 'NEW_PASSWORD_REQUIRED') {
          logger.debug('require new password', user.challengeParam);
          this.changeState('requireNewPassword', user);
        } else {
          this.checkContact(user);
        }
      }).catch(err => {
        this.setState({loading: false});
        console.log(Toast.toastInstance)
        Toast.show({
          text: err.message,
          buttonText: 'Close',
          duration: 8000,
          type: 'danger',
        });
      });
    }

    showComponent(theme) {
      const { username, password, loading } = this.state;
      return (
        <Root>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View style={{flex: 1, width: '100%', paddingHorizontal: 20}}>
              <View style={{flex:1, flexDirection: 'row',}}>
                <View style={{flex:1}}>
                  <Image style={{width: 75, height: 75}} source={require('../../../assets/images/icon.png')}/>
                </View>
                <View style={{flex:4, justifyContent:'center'}}>
                  <Text style={{textAlign:'center', fontSize: 24}}>Welcome to Odyssey!</Text>
                </View>
              </View>
              <Container style={{flex:8}}>
                <Content>
                  <Form>
                    <Item floatingLabel last>
                      <Label>Username</Label>
                      <Input
                        autoCorrect={false}
                        autoCapitalize="none"
                        onChangeText={text => this.setState({username: text})}
                        required={true}
                      />
                    </Item>
                    <Item floatingLabel last style={{marginBottom: 20}}>
                      <Label>Password</Label>
                      <Input
                        autoCorrect={false}
                        autoCapitalize="none"
                        onChangeText={text => this.setState({password: text})}
                        required={true}
                        secureTextEntry={true}
                      />
                    </Item>
                  </Form>
                  <View style={{paddingTop:0}}>
                    <Button block success bordered
                      onPress={this.signIn}
                      disabled={!username || !password || loading}>
                      <Text>{I18n.get('Sign In').toUpperCase()}</Text>
                    </Button>
                  </View>
                  <View style={theme.sectionFooter}>
                    <LinkCell theme={theme} onPress={() => this.changeState('forgotPassword')}>
                      {I18n.get('Forgot Password')}
                    </LinkCell>
                    <LinkCell theme={theme} onPress={() => this.changeState('signUp')}>
                      {I18n.get('Sign Up')}
                    </LinkCell>
                  </View>
                </Content>
              </Container>
            </View>
          </TouchableWithoutFeedback>
        </Root>
      )
    }
}
