import React from 'react';
import { View, TouchableWithoutFeedback, Keyboard, Image} from 'react-native';
import { Auth, I18n, Logger } from 'aws-amplify';
import { H3, Button, Container, Content, Form, Item, Input, Label, Text, Toast, Root } from 'native-base';

import AuthPiece from './AuthPiece';
import { LinkCell } from '../AmplifyUI';

const logger = new Logger('ForgotPassword');

export default class ForgotPassword extends AuthPiece {
  constructor(props) {
    super(props);

    this._validAuthStates = ['forgotPassword'];
    this.state = { delivery: null };

    this.send = this.send.bind(this);
    this.submit = this.submit.bind(this);

  }
  componentWillReceiveProps({authData}) {
    this.setState({ emailOrPhone: authData });
  }

  send() {
    const { emailOrPhone } = this.state;
    if (!emailOrPhone) {
      this.error('Plesae enter email or phone number');
      return;
    }
    Auth.forgotPassword(emailOrPhone)
      .then(data => {
        logger.debug(data)
        this.setState({ delivery: data.CodeDeliveryDetails });
      })
      .catch(err => this.error(err));
  }

  verify = () => {
    const { password, confirmPassword } = this.state;

    if ( password !== confirmPassword ){
      return false;
    }
    return true;
  }

  submit() {
    const { emailOrPhone, code, password, confirmPassword } = this.state;
    if (!this.verify()) {
      this.error('Passwords do not match');
      return;
    }
    Auth.forgotPasswordSubmit(emailOrPhone, code, password)
      .then(data => {
        logger.debug(data);
        this.changeState('signIn');
      })
      .catch(err => this.error(err));
  }

  forgotBody() {
    return (
      <View style={{flex:1}}>
        <Item floatingLabel last>
          <Label>Email</Label>
          <Input
            keyboardAppearance="dark"
            autoCorrect={false}
            autoCapitalize="none"
            onChangeText={text => this.setState({emailOrPhone: text.toLowerCase()})}
            required={true}
            returnKeyType="done"
            onSubmitEditing={this.send}
            keyboardType="email-address"
            value={this.state.emailOrPhone}
          />
        </Item>
        <View style={{paddingTop:20}}>
          <Button block success bordered
            onPress={this.send}
            disabled={!this.state.emailOrPhone}>
            <Text>{I18n.get('Send').toUpperCase()}</Text>
          </Button>
        </View>
      </View>
    )
  }

  submitBody() {
    let next = () => {
      this.password._root.focus();
    }
    let next2 = () => {
      this.confirmPassword._root.focus();
    }
    return (
      <View style={{flex:1}}>
        <H3 style={{color: 'grey'}}>Check your email for a code to help you reset your password</H3>
        <Item floatingLabel last>
          <Label>Enter confirmation code</Label>
          <Input
            keyboardAppearance="dark"
            autoCorrect={false}
            autoCapitalize="none"
            onChangeText={(text) => this.setState({ code: text })}
            required={true}
            returnKeyType="done"
            keyboardType="number-pad"
            onSubmitEditing={next}
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
            returnKeyType="next"
            getRef={input => {this.password = input;}}
            onSubmitEditing={next2}
          />
        </Item>
        <Item floatingLabel last>
          <Label>Confirm Password</Label>
          <Input
            keyboardAppearance="dark"
            autoCorrect={false}
            autoCapitalize="none"
            onChangeText={text => this.setState({confirmPassword: text})}
            required={true}
            secureTextEntry={true}
            returnKeyType="done"
            getRef={input => {this.confirmPassword = input;}}
            onSubmitEditing={(!this.state.emailOrPhone || !!this.state.password || !this.state.confirmPassword || loading) ? Keyboard.dismiss : this.signIn}
          />
        </Item>
        <View style={{paddingTop:20}}>
          <Button block success bordered
            onPress={this.submit}
            disabled={!this.state.emailOrPhone}>
            <Text>{I18n.get('Submit').toUpperCase()}</Text>
          </Button>
        </View>
      </View>
    )
  }

  showComponent(theme) {
    const { emailOrPhone, password, loading } = this.state;
    return (
      <Root>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View style={{flex: 1, width: '100%', paddingHorizontal: 20}}>
            <View style={{flex:1, flexDirection: 'row',}}>
              <View style={{flex:1}}>
                <Image style={{resizeMode:'contain', width: 75, height: 75}} source={require('../../../assets/images/icon.png')}/>
              </View>
              <View style={{flex:4, justifyContent:'center'}}>
                <Text style={{textAlign:'center', fontSize: 24}}>Forgot Password</Text>
              </View>
            </View>
            <Container style={{flex:8}}>
              <Content>
                <Form>
                  { !this.state.delivery && this.forgotBody() }
                  { this.state.delivery && this.submitBody() }
                </Form>
                <View style={theme.sectionFooter}>
                  <LinkCell theme={linkCellTheme} onPress={() => this.changeState('signIn')}>
                    {I18n.get('Back to Sign In')}
                  </LinkCell>
                  <LinkCell theme={linkCellTheme} onPress={() => this.changeState('signUp')}>
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
