import React from 'react';
import { View, TouchableWithoutFeedback, Keyboard, Image } from 'react-native';
import { Auth, I18n, JS } from 'aws-amplify';
import { Button, Container, Content, Form, Item, Input, Label, Text, Toast, Root, Spinner } from 'native-base';
import AuthPiece from './AuthPiece';
import { LinkCell } from '../AmplifyUI';


export default class SignUp extends AuthPiece {
  constructor(props) {
    super(props);

    this._validAuthStates = ['signUp'];

    this.state = {
      email: null,
      confirmEmail: null,
      password: null,
      confirmPassword: null,
      phoneNumber: null,
    };
    this.signUp = this.signUp.bind(this);
  }

  signUpFields = [
    {name: 'name', required: true, label: 'Full Name'},
    {name: 'email', required: true, label: 'Email', keyboardType: 'email-address'},
    {name: 'confirmEmail', required: true, label: 'Confirm Email', keyboardType: 'email-address'},
    {name: 'password', required: true, label: 'Password', password: true},
    {name: 'confirmPassword', required: true, label: 'Confirm Password', password: true},
    {name: 'phoneNumber', required: true, label: 'Phone Number', keyboardType: 'phone-pad'},
  ];

  inputs = [];

  validateEmail = (email) => {
    let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  isValid() {
    const invalids = [];
    this.signUpFields.map(el => {
      if (el.required && !this.state[el.name]) {
        el.invalid = true;
        invalids.push(el.label);
      } else {
        el.invalid = false;
      }
    });

    let numErrors = 0;

    if (invalids.length === 0) {
      const { name, email, confirmEmail, password, confirmPassword, phoneNumber } = this.state;

      if (name.length < 3 || !name.includes(' ')){
        this.error('Please enter your full name');
        numErrors += 1;
        if (numErrors > 2) return false;
      }

      if (email !== confirmEmail) {
        this.error('Emails do not match');
        numErrors += 1;
        if (numErrors > 2) return false;
      }

      if (!this.validateEmail(email)) {
        this.error('Please enter a valid email');
        numErrors += 1;
        if (numErrors > 2) return false;
      }

      if (password !== confirmPassword) {
        this.error('Passwords do not match');
        numErrors += 1;
        if (numErrors > 2) return false;
      }

      if (phoneNumber.match(/\d/g).length !== 10){
        this.error('Please enter a valid Phone Number');
        numErrors += 1;
        if (numErrors > 2) return false;
      }

    }
    else {
      this.error(`Please fill out: ${invalids.join(', ')}`);
      return false;
    }
    if (numErrors) return false;
    return true;
  }

  signUp() {
    Keyboard.dismiss();
    this.setState({loading: true});

    if (!this.isValid()) return;
    
    let { name, email, password, phoneNumber, } = this.state;

    let signupInfo = {
      username: email,
      password,

      attributes: {
        given_name: name,
        email,
        phone_number: `+1${phoneNumber}`,
      }
    };

    Auth.signUp(signupInfo).then(data => {
      this.changeState('confirmSignUp', data.user.email);
    }).catch(err => {
      this.error(err)
      this.setState({loading: false});
    });
  }

  nextInput = (inputIndex) => {
    if (inputIndex < this.signUpFields.length) {
      this.inputs[inputIndex]._root.focus();
      return
    }
    Keyboard.dismiss();
  }

  showComponent(theme) {
    const { name, email, confirmEmail, password, confirmPassword, phoneNumber, loading } = this.state;

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
                  {this.signUpFields.map((field, index) => {
                    return (
                      <Item floatingLabel last key={field.name}>
                        <Label>{field.label}</Label>
                        <Input
                          keyboardAppearance="dark"
                          autoCorrect={false}
                          autoCapitalize="none"
                          onChangeText={text => {
                            if (field.password) this.setState({[field.name]: text})
                            else this.setState({[field.name]: text.toLowerCase()})
                          }}
                          required={true}
                          secureTextEntry={field.password}
                          keyboardType={field.keyboardType ? field.keyboardType : 'default'}
                          returnKeyType={(index + 1 == this.signUpFields.length) ? 'done': 'next'}
                          blurOnSubmit={false}
                          getRef={input => {this.inputs[index] = input;}}
                          onSubmitEditing={() => this.nextInput(index + 1)}
                        />
                      </Item>
                    )
                  })}
                </Form>
                <View style={{paddingTop:10}}>
                  <Button block success bordered
                    onPress={this.signUp}
                    disabled={!name || !email || !confirmEmail || !password || !confirmPassword || !phoneNumber || loading}
                  >
                    {loading && <Spinner color="white" />}
                    <Text>{I18n.get('Sign Up').toUpperCase()}</Text>
                  </Button>
                </View>
                <View style={theme.sectionFooter}>
                  <LinkCell theme={linkCellTheme} onPress={() => this.changeState('forgotPassword')}>
                    {I18n.get('Forgot Password')}
                  </LinkCell>
                  <LinkCell theme={linkCellTheme} onPress={() => this.changeState('signIn')}>
                    {I18n.get('Return to Sign In')}
                  </LinkCell>
                </View>
              </Content>
            </Container>
          </View>
        </TouchableWithoutFeedback>
      </Root>
    );
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
