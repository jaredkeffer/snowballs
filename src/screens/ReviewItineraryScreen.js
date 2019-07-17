import React, { Component } from 'react';
import { Button, Container, Content, Thumbnail, Body, Icon, H1, H2, H3, View, Text, Card, CardItem, Textarea, Toast, Left, Right } from 'native-base';
import { Alert, SafeAreaView, StatusBar, StyleSheet, Image, TouchableOpacity, Keyboard, Modal } from 'react-native';
import { SkypeIndicator } from 'react-native-indicators';
import { I18n } from 'aws-amplify';
import DateRangePicker from '../components/DateRangePicker';
import {calculateTripLengthInDays, calculateDailyPrice, calculateTotalPrice, intToMoney, pricePerDay} from '../util/Payments';
import { DATA_TYPE } from '../constants/DataTypes';


import stripe from 'tipsi-stripe'
import api from '../api/index';

import layout from '../constants/Layout';
const payBtnText = 'Confirm and Pay for Itinerary';

export default class CreateItineraryScreen extends Component {
  constructor(props){
    super(props);
    const { steps, values } = this.props.navigation.state.params;
    this.setupStripe();
    this.state = {
      loading: false,
      paymentModalVisible: false,
    };
    steps.forEach(val => { this.state[val.id] = val.value });
  }

  static navigationOptions = {
    title: "Review Itinerary",
    headerLeft: null,
  };

  setupStripe = async () => {
    // setup stripe
    return await stripe.setOptions({
      publishableKey: 'pk_test_8Kp8WpwdyIDBttGYvaKxh2ul00KWNj1WJq',
      merchantId: 'merchant.com.odysseytechnologyinc.odyssey.app.dev.id',
    });
  }

  setPaymentModalVisible = (paymentModalVisible) => {
    this.setState({paymentModalVisible});
  }


  modal = () => {
    const { qAndA, start, end, tripLengthDays, tripPrice, discounts } = this.extractData();
    let nativePayEnabled = this.checkNativePay();

    let disabledBtnStyle = nativePayEnabled ? {} : {backgroundColor: '#ccc'};

    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={this.state.paymentModalVisible}
      >
        <SafeAreaView style={{flex:1, padding: 12,}}>
        <Container style={{backgroundColor: 'rgba(0,0,0,0.4)'}}>
          <Content contentContainerStyle={{ justifyContent: 'center', flex: 1 }}>
            <Card>
              <CardItem header>
                <Left>
                  <Thumbnail source={require('../assets/images/icon.png')} />
                  <Body>
                    <Text style={{fontSize: 30}}>Review Payment</Text>
                    <Text note style={{fontSize: 24}}>{qAndA['2']} Trip</Text>
                  </Body>
                  <Icon
                    style={{fontSize: 30, color: '#bbb', padding: 4}}
                    name="md-close"
                    onPress={() => this.setPaymentModalVisible(false)}
                  />
                </Left>
              </CardItem>
              <CardItem>
                <Left>
                  <Text style={{fontSize: 24}}>Trip Length</Text>
                </Left>
                <Body>
                  <Text style={{fontSize: 24}}>{tripLengthDays} days</Text>
                </Body>
              </CardItem>
              <CardItem bordered>
                <Left>
                  <Text style={{fontSize: 24}}>Price/Day</Text>
                </Left>
                <Body>
                  <Text style={{fontSize: 24}}>${pricePerDay}</Text>
                </Body>
              </CardItem>
              { /*  // TODO: add discounts
                discounts &&
                <CardItem>
                  <Left>
                    <Text style={{fontSize: 24}}>Discounts</Text>
                  </Left>
                  <Body>
                    <Text style={{fontSize: 24}}>- ${discounts}</Text>
                  </Body>
                </CardItem>
              */}
              <CardItem bordered>
                <Left>
                  <Text style={{fontSize: 24}}>Total Price</Text>
                </Left>
                <Body>
                  <Text style={{fontSize: 24}}>${tripPrice}</Text>
                </Body>
              </CardItem>
              <CardItem header style={{justifyContent: 'center',}}>
                <Text note style={{fontSize: 24}}>Select Payment Method</Text>
              </CardItem>
              <CardItem style={{justifyContent: 'space-between',}} bordered>
                <Button dark bordered style={{flex:1, justifyContent: 'center', marginHorizontal: 4}}
                  onPress={() => this.submit(false)}>
                  <Text style={{fontSize: 20}}>Credit Card</Text>
                </Button>
                <Button dark style={[{flex:1, justifyContent: 'center', marginHorizontal: 4}, disabledBtnStyle]}
                  onPress={() => this.submit(true)} disabled={!nativePayEnabled}>
                  <Text style={{fontSize: 20}}> Pay</Text>
                </Button>
              </CardItem>
              <Text note style={{padding: 10}}>*All payments are securely processed using Stripe</Text>
            </Card>
          </Content>
        </Container>
        </SafeAreaView>
      </Modal>
    );
  }

  extractData = () => {
    const { navigation } = this.props;
    const { steps } = navigation.state.params;
    let qAndA = {};
    steps.forEach(val => {
      qAndA[val.id] = this.state[val.id] || val.message;
      if (qAndA[val.id] === "") delete qAndA[val.id];
    });

    // TODO: make this an api call to see what to charge the person maybe?
    // Or for now just let it be based off the number of days
    const start = qAndA['4']['start'];
    const end = qAndA['4']['end'];
    const tripLengthDays = calculateTripLengthInDays(start, end);
    const tripPrice = calculateDailyPrice(tripLengthDays);

    return { qAndA, start, end, tripLengthDays, tripPrice };
  }

  submit = async (useNativePay) => {
    console.log('submitting new itinerary');
    this.setState({loading: true, submitting: !useNativePay});
    if (!useNativePay) this.setPaymentModalVisible(false);

    const { navigation } = this.props;
    const applePayEnabled = this.checkNativePay();

    const { qAndA, start, end, tripLengthDays, tripPrice } = this.extractData();

    const items = [{
      label: `${tripLengthDays} Day Trip X $${pricePerDay}/day`,
      amount: intToMoney(tripPrice),
    }];
    items.push({
      label: 'Odyssey',
      amount: intToMoney(calculateTotalPrice(tripPrice, 0)),
    });

    // show review payment modal here

    let token, userCancelled;
    if (applePayEnabled && useNativePay) {
      console.log('requesting native pay with: ', items);
      token = await stripe.paymentRequestWithNativePay({}, items).catch(error => {
        userCancelled = error.message === 'Cancelled by user';
        if (!userCancelled) {
          Toast.show({
            text: 'There was an error paying for your itinerary. Please try again.',
            buttonText: 'Close',
            duration: 8000,
            type: 'danger',
          });
        }
      });
    } else  {
      console.log('apple pay NOT enabled');
      token = await stripe.paymentRequestWithCardForm().catch(error => {
        if (!useNativePay) this.setPaymentModalVisible(true);
        userCancelled = error.message === 'Cancelled by user';
        if (!userCancelled) {
          Toast.show({
            text: 'There was an error paying for your itinerary. Please try again.',
            buttonText: 'Close',
            duration: 8000,
            type: 'danger',
          });
        }
      });
    }
    // TODO: ANDROID WORK -- add android pay here

    if (token) {
      const response = await api.createNewItinerary(qAndA, token, tripPrice)
        .catch(error => {
          console.log(error);
        });
      if (response.error) {
        this.setState({loading: false, submitting: false});
        await stripe.cancelNativePayRequest();

        Toast.show({
          text: 'There was an error creating your itinerary.',
          buttonText: 'Close',
          duration: 8000,
          type: 'danger',
        });
      } else {
        let thankyouObj = {
          subtitle: 'We’re hard at work building your itinerary. We\'ll send you a notification in 48 hours or less once we\'re done. In the meantime, check out cool experiences on the home screen.',
          title: 'Itinerary Processing',
          nextScreen: 'Concierge',
          buttonText: 'Back to Itineraries',
          refreshCache: true,
        }
        await stripe.completeNativePayRequest();
        this.setState({loading: false, paymentModalVisible: false});
        navigation.navigate('ThankYou', thankyouObj);
      }
    } else {
      this.setState({loading: false, submitting: false});
      await stripe.cancelNativePayRequest();
      if (!userCancelled) Toast.show({
        text: 'There was an error paying for your itinerary. Please try again.',
        buttonText: 'Close',
        duration: 8000,
        type: 'danger',
      });
    }
  }

  textChange = (text, stepId) => {
    this.setState({[stepId]: text});
  }

  checkNativePay = async () => {
    return await stripe.canMakeNativePayPayments();
  }

  render() {
    const { steps } = this.props.navigation.state.params;
    const { loading, submitting } = this.state;

    return (
      <View style={{flex: 1}}>
      {this.modal()}
      {submitting &&
        <SafeAreaView style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <SkypeIndicator color='#383838' size={75}/>
          <Text style={{color: '#787878', marginBottom: 100}}>Processing Payment and Creating Itinerary</Text>
        </SafeAreaView>
      }
      {!submitting && <SafeAreaView style={styles.container}>
        <Container>
          <View style={{flex:1}}>
            <View style={{flex:10}}>
              <Content style={[styles.container]}>
                <Text style={styles.title}>Itinerary Summary</Text>
                {steps.map((step, index) => {

                  const stepValueId = String(index);

                  if (index <= 1 && step.message.includes('Hi! Thanks for using Odyssey!')){
                    const splitUpMessage = step.message.split('\n');
                    step.message = splitUpMessage[splitUpMessage.length - 1];
                  }
                  if (index % 2 == 0) {
                    if (step.id === '4') {
                      // TODO: make this the date picker
                       return (
                         <Card key={'itin'+index}>
                           <CardItem>
                             <Text>{(new Date(step.value.start)).toLocaleDateString()} - {(new Date(step.value.end)).toLocaleDateString()}</Text>
                           </CardItem>
                         </Card>
                       );
                    }
                    return (
                      <Card key={'itin'+index}>
                        <CardItem>
                          <Textarea
                            style={{flex:1}}
                            bordered
                            keyboardAppearance="dark"
                            returnKeyType="done"
                            onSubmitEditing={() => Keyboard.dismiss()}
                            rowSpan={3}
                            value={this.state[stepValueId] || ''}
                            onChangeText={(text) => this.textChange(text, stepValueId)}
                          />
                        </CardItem>
                      </Card>
                    );
                  }
                  return (
                    <Card key={'itin'+index} transparent>
                      <CardItem header>
                        <Text>{step.message}</Text>
                      </CardItem>
                    </Card>
                  );
                })}
              </Content>
            </View>
            <View style={{flex: 0, padding: 4}}>
              {/* <Button bordered success block onPress={this.submit} */}
              <Button success block onPress={() => this.setPaymentModalVisible(true)}
                disabled={loading}>
                <Text style={{fontWeight: 'bold'}}>{payBtnText}</Text>
              </Button>
            </View>
          </View>
        </Container>
      </SafeAreaView>}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 8,
    backgroundColor: '#fff',
    paddingTop: StatusBar.currentHeight,
  },
  title: {
    fontSize: 30,
    padding: 10,
  },
  answer: {
    padding: 12,
    fontSize: 16,
  },
  question: {
    marginTop: 8,
    fontSize: 16
  },
  hrView: {
    padding: 8,
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
  },
});
