import React, { Component } from 'react';
import { Button, Container, Content, H1, H2, H3, View, Text, Card, CardItem, Textarea, Toast } from 'native-base';
import { Alert, SafeAreaView, StatusBar, StyleSheet, TouchableOpacity, Keyboard } from 'react-native';
import { I18n } from 'aws-amplify';
import DateRangePicker from '../components/DateRangePicker';
import {calculateTripLengthInDays, calculateDailyPrice, calculateTotalPrice, intToMoney, pricePerDay} from '../util/Payments';

import stripe from 'tipsi-stripe'
import api from '../api/index';

import layout from '../constants/Layout';
const payBtnText = 'Confirm Itinerary and Pay';

export default class CreateItineraryScreen extends Component {

  constructor(props){
    super(props);
    const { steps, values } = this.props.navigation.state.params;
    this.setupStripe();
    this.state = {};
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

  submit = async () => {
    console.log('submitting new itinerary');
    this.setState({loading: true});

    // pop up payment method selector
    // then dismiss after selected


    const { navigation } = this.props;
    const applePayEnabled = await stripe.canMakeApplePayPayments();

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

    const items = [{
      label: `${tripLengthDays} Day Trip X $${pricePerDay}/day`,
      amount: intToMoney(tripPrice),
    }];
    items.push({
      label: 'Odyssey',
      amount: intToMoney(calculateTotalPrice(tripPrice, 0)),
    });

    let token, userCancelled;
    if (applePayEnabled) {
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
      const response = await api.createNewItinerary(qAndA, token).catch(error => {
        console.log(error);
      });
      if (response.error) {

        this.setState({loading: false});
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
        navigation.navigate('ThankYou', thankyouObj);
      }
    } else {
      this.setState({loading: false});
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
    return await stripe.canMakeApplePayPayments();
  }

  render() {
    const { steps } = this.props.navigation.state.params;

    return (
      <SafeAreaView style={styles.container}>
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
              <Button bordered success block onPress={this.submit}
                disabled={this.state.loading}>
                <Text>{payBtnText}</Text>
              </Button>
            </View>
          </View>
        </Container>
      </SafeAreaView>
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
