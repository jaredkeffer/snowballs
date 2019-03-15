import React from 'react';
import { View, TouchableWithoutFeedback, Keyboard, Image } from 'react-native';
import { Auth, I18n, Logger } from 'aws-amplify';
import { LinkCell } from '../AmplifyUI';
import AuthPiece from './AuthPiece';
import { Button, Container, Content, Form, Item, Input, Label, Text, Toast, Root } from 'native-base';

const logger = new Logger('ConfirmSignUp');

export default class ConfirmSignUp extends AuthPiece {
  constructor(props) {
    super(props);

    this._validAuthStates = ['confirmSignUp'];
    this.state = {
      emailOrPhone: null,
      code: null,
      error: null
    };

    this.confirm = this.confirm.bind(this);
    this.resend = this.resend.bind(this);
  }

  confirm() {
    Keyboard.dismiss();
    this.setState({loading: true});
    const { emailOrPhone, code } = this.state;
    logger.debug('Confirm Sign Up for ' + emailOrPhone);
    Auth.confirmSignUp(emailOrPhone, code)
      .then(data => this.changeState('signedUp'))
      .catch(err => {
        this.setState({loading: false});
        this.error(err);
      });
  }

  resend() {
    Keyboard.dismiss();
    const { emailOrPhone } = this.state;
    logger.debug('Resend Sign Up for ' + emailOrPhone);
    Auth.resendSignUp(emailOrPhone).then(() => logger.debug('code sent')).catch(err => this.error(err));
    Toast.show({
      text: 'Resending email to ' + emailOrPhone,
      buttonText: 'Close',
      duration: 8000,
      type: 'info',
    });
  }

  componentWillReceiveProps(nextProps) {
    const emailOrPhone = nextProps.authData;
    this.setState({ emailOrPhone });
  }

  nextInput = () => {
    this.confCodeInput._root.focus();
  }

  showComponent(theme) {
    const { emailOrPhone, code, loading } = this.state;
    return (
      <Root>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View style={{flex: 1, width: '100%', paddingHorizontal: 20}}>
            <View style={{flex:1, flexDirection: 'row',}}>
              <View style={{flex:1}}>
                <Image style={{width: 75, height: 75}} source={require('../../../assets/images/icon.png')}/>
              </View>
              <View style={{flex:4, justifyContent:'center'}}>
                <Text style={{textAlign:'center', fontSize: 24}}>Confirm Email</Text>
              </View>
            </View>
            <Container style={{flex:8}}>
              <Content>
                <Form>
                  <Item floatingLabel last>
                    <Label>Email or Phone Number</Label>
                    <Input
                      keyboardAppearance="dark"
                      autoCorrect={false}
                      autoCapitalize="none"
                      onChangeText={text => this.setState({emailOrPhone: text.toLowerCase()})}
                      required={true}
                      returnKeyType="next"
                      onSubmitEditing={this.nextInput}
                      value={emailOrPhone}
                      keyboardType='email-address'
                    />
                  </Item>
                  <Item floatingLabel last>
                    <Label>Enter code here</Label>
                    <Input
                      keyboardAppearance="dark"
                      autoCorrect={false}
                      autoCapitalize="none"
                      onChangeText={text => this.setState({code: text})}
                      required={true}
                      returnKeyType="done"
                      getRef={input => {this.confCodeInput = input;}}
                      onSubmitEditing={(!emailOrPhone || loading) ? Keyboard.dismiss : this.confirm}
                      keyboardType='number-pad'
                    />
                  </Item>
                </Form>
                <View style={{paddingTop:20}}>
                  <Button block success bordered
                    onPress={this.confirm}
                    disabled={!emailOrPhone || !code || loading}>
                    <Text>{I18n.get('Confirm').toUpperCase()}</Text>
                  </Button>
                </View>
                <View style={theme.sectionFooter}>
                  <LinkCell theme={linkCellTheme} onPress={this.resend}>
                    {I18n.get('Resend code')}
                  </LinkCell>
                  <LinkCell theme={linkCellTheme} onPress={() => this.changeState('signIn')}>
                    {I18n.get('Back to Sign In')}
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
