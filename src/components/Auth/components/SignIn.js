import React from 'react';
import { ImageBackground, View, TouchableWithoutFeedback, Keyboard, Image } from 'react-native';
import { Auth, I18n, Logger, JS } from 'aws-amplify';
import { H3, Button, Container, Content, Form, Item, Input, Label, Text, Toast, Root } from 'native-base';

import AuthPiece from './AuthPiece';
import { LinkCell } from '../AmplifyUI';

const logger = new Logger('SignIn');

export default class SignIn extends AuthPiece {
    constructor(props) {
      super(props);

      this._validAuthStates = ['signIn', 'signedOut', 'signedUp'];
      this.state = {
        emailOrPhone: null,
        password: null,
      };

      this.checkContact = this.checkContact.bind(this);
      this.signIn = this.signIn.bind(this);
      this.password = {};
    }

    componentWillReceiveProps({ emailOrPhone, password }) {
      this.setState({ emailOrPhone, password });
    }

    signIn() {
      const { emailOrPhone, password } = this.state;

      this.setState({loading: true});
      logger.debug('Sign In for ' + emailOrPhone);

      Keyboard.dismiss();

      Auth.signIn(emailOrPhone, password).then(user => {
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
        if (err.name === 'UserNotConfirmedException') {
          this.changeState('confirmSignUp', emailOrPhone);
        }
        else {
          this.error(err);
        }
      });
    }

    nextInput = () => {
      this.password._root.focus();
    }

    showComponent(theme) {
      const { emailOrPhone, password, loading } = this.state;
      return (
        <Root>
          {/* <ImageBackground
            source={require('../../../assets/images/canal-venice-gondola.jpg')}
            style={{width: '100%', height: '100%'}}
            imageStyle={{opacity: 0.35}}
          > */}
          <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View style={{flex: 1, width: '100%', paddingHorizontal: 20}}>
              <View style={{flex:1, flexDirection: 'row',}}>
                <View style={{flex:1}}>
                  <Image style={{resizeMode:'contain', width: 75, height: 75}} source={require('../../../assets/images/icon.png')}/>
                </View>
                <View style={{flex:4, justifyContent:'center'}}>
                  <Text style={{textAlign:'center', fontSize: 24}}>Welcome to Odyssey!</Text>
                </View>
              </View>
              <Container style={{flex:8}}>
                <Content>
                  <Form>
                    <Item floatingLabel last>
                      <Label>Email</Label>
                      <Input
                        keyboardAppearance="dark"
                        autoCorrect={false}
                        autoCapitalize="none"
                        onChangeText={text => this.setState({emailOrPhone: text.toLowerCase()})}
                        required={true}
                        returnKeyType="next"
                        onSubmitEditing={this.nextInput}
                        keyboardType="email-address"
                      />
                    </Item>
                    <Item floatingLabel last>
                      <Label>Password</Label>
                      <Input
                        keyboardAppearance="dark"
                        autoCorrect={false}
                        autoCapitalize="none"
                        onChangeText={text => this.setState({password: text})}
                        required={true}
                        secureTextEntry={true}
                        returnKeyType="done"
                        getRef={input => {this.password = input;}}
                        onSubmitEditing={(!emailOrPhone || !password || loading) ? Keyboard.dismiss : this.signIn}
                      />
                    </Item>
                  </Form>
                  <View style={{paddingTop:20}}>
                    <Button block success bordered
                      onPress={this.signIn}
                      disabled={!emailOrPhone || !password || loading}>
                      <Text>{I18n.get('Sign In').toUpperCase()}</Text>
                    </Button>
                  </View>
                  <View style={theme.sectionFooter}>
                    <LinkCell theme={linkCellTheme} onPress={() => this.changeState('forgotPassword', emailOrPhone)}>
                      {I18n.get('Forgot Password')}
                    </LinkCell>
                    <LinkCell theme={linkCellTheme} onPress={() => this.changeState('signUp')}>
                      {I18n.get('Sign Up')}
                    </LinkCell>
                  </View>
                </Content>
              </Container>
            </View>
          </TouchableWithoutFeedback>
        {/* </ImageBackground> */}
        </Root>
      )
    }
}

let linkCellTheme = {
  sectionFooterLink: {
    fontSize: 14,
    color: '#202020',
    alignItems: 'baseline',
    textAlign: 'center'
  },
  cell: {
      flex: 1,
      width: '50%'
  },
}
