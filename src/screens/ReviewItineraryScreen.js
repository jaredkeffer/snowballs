import React, { Component } from 'react';
import { Button, Container, Content, Thumbnail, Body, Icon, H1, H2, H3, View, Text, Card, CardItem, Textarea, Toast, Left, Right } from 'native-base';
import { Alert, SafeAreaView, StatusBar, StyleSheet, Image, TouchableOpacity, Keyboard, Modal, Button as Btn } from 'react-native';
import { SkypeIndicator } from 'react-native-indicators';
import { I18n } from 'aws-amplify';
import DateRangePicker from '../components/DateRangePicker';
import {calculateTripLengthInDays, calculateTripPrice, calculateTotalPrice,
  intToMoney, defaultPricePerDay, getPublishableKey, getMerchantId } from '../util/Payments';
import { DATA_TYPE } from '../constants/DataTypes';

import stripe from 'tipsi-stripe'
import api from '../api/index';

const XDate = require('xdate');

import layout from '../constants/Layout';
const payBtnText = 'Confirm and Pay for Itinerary';

const AlertBtn = ({nav}) => (
  <Btn
    title="Discard"
    onPress={() => {
      Alert.alert(
        'Discard Itinerary',
        'Are you sure you want to cancel this itinerary?',
        [
          {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          {
            text: 'Discard',
            onPress: () => nav.navigation.navigate('Concierge'),
            style: 'destructive',
          },
        ],
        {cancelable: true},
      );
    }}
  />
);

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

  static navigationOptions = (props) => ({
    title: "Review Itinerary",
    headerLeft: null,
    headerRight: <AlertBtn nav={props}/>,
  });

  setupStripe = async () => {
    // setup stripe
    const publishableKey = getPublishableKey();
    const merchantId = getMerchantId();
    return await stripe.setOptions({ publishableKey, merchantId });
  }

  setPaymentModalVisible = (paymentModalVisible) => {
    if (paymentModalVisible) {
      this.setState({loadingPrice: true});
      this.setState({paymentModalVisible});
      api.getItineraryPricePerDay().then(pricePerDay => {
        this.setState({pricePerDay});

        const start = this.state['4']['start'];
        const end = this.state['4']['end'];
        const tripLengthDays = calculateTripLengthInDays(start, end);
        this.setState({tripLengthDays});

        const tripPrice = calculateTripPrice(tripLengthDays, pricePerDay);
        this.setState({tripPrice});
        this.setState({loadingPrice: false});
      }).catch(err => {
        // if there is no internet or something goes wrong default to defaultPricePerDay
        this.setState({pricePerDay: defaultPricePerDay, loadingPrice: false});

        const start = this.state['4']['start'];
        const end = this.state['4']['end'];
        const tripLengthDays = calculateTripLengthInDays(start, end);
        this.setState({tripLengthDays});

        const tripPrice = calculateTripPrice(tripLengthDays, defaultPricePerDay);
        this.setState({tripPrice});
        this.setState({paymentModalVisible});
      });
    } else {
      this.setState({paymentModalVisible});
    }
  }

  modal = () => {
    const { qAndA } = this.extractData();
    const { tripLengthDays, tripPrice, paymentModalVisible, pricePerDay, loadingPrice, disabledPayBtns } = this.state;
    let nativePayEnabled = this.checkNativePay();
    console.log('tripPrice from model', tripPrice);

    let disabledBtnStyle = nativePayEnabled ? {} : {backgroundColor: '#ccc'};

    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={paymentModalVisible}
      >
        <SafeAreaView style={{flex:1, padding: 12,}}>
        <Container style={{backgroundColor: 'rgba(0,0,0,0.4)'}}>
          <Content contentContainerStyle={{ justifyContent: 'center', flex: 1 }}>
            {loadingPrice && <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
              <SkypeIndicator color='#fff' size={75}/>
              <Text style={{color: '#fff', marginBottom: 200}}>Loading...</Text>
            </View>}
            {!loadingPrice && <Card>
              <CardItem header>
                <Left>
                  <Thumbnail source={require('../assets/images/icon.png')} />
                  <Body>
                    <Text style={{fontSize: 30}}>Review Payment</Text>
                    {qAndA && <Text note style={{fontSize: 24}}>{qAndA['2']} Trip</Text>}
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
                  onPress={() => this.submit(false)} disabled={disabledPayBtns}>
                  <Text style={{fontSize: 20}}>Credit Card</Text>
                </Button>
                <Button dark style={[{flex:1, justifyContent: 'center', marginHorizontal: 4}, disabledBtnStyle]}
                  onPress={() => this.submit(true)} disabled={!nativePayEnabled || disabledPayBtns}>
                  <Text style={{fontSize: 20}}> Pay</Text>
                </Button>
              </CardItem>
              <Text note style={{padding: 10}}>*All payments are securely processed using Stripe</Text>
            </Card>}
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
      if (qAndA[val.id] && !qAndA[val.id].start) qAndA[val.id] = qAndA[val.id].trim();
    });

    return { qAndA };
  }

  submit = async (useNativePay) => {
    console.log('submitting new itinerary');
    this.setState({loading: true, submitting: !useNativePay, disabledPayBtns: true});
    if (!useNativePay) this.setPaymentModalVisible(false);

    const { navigation } = this.props;
    const applePayEnabled = this.checkNativePay();

    const { qAndA } = this.extractData();
    const { tripLengthDays, tripPrice, pricePerDay } = this.state;

    const items = [{
      label: `${tripLengthDays} Day Trip X $${pricePerDay}/day`,
      amount: intToMoney(tripPrice),
    }];
    items.push({
      label: 'Odyssey',
      amount: intToMoney(tripPrice),
    });

    // show review payment modal here
    let error = false;
    let token, userCancelled;
    try {
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
    } catch (e) {
      error = true;
      console.log(e);
    }

    if (token && !error) {
      const response = await api.createNewItinerary(qAndA, token, tripPrice)
        .catch(error => {
          console.log(error);
        });
      if (response.error) {
        this.setState({loading: false, submitting: false, disabledPayBtns: false});
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
        this.setState({loading: false, paymentModalVisible: false, disabledPayBtns: false});
        navigation.navigate('ThankYou', thankyouObj);
      }
    } else {
      this.setState({loading: false, submitting: false, disabledPayBtns: false});
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

  dateChange = (id, start, end) => {
    console.log(id, start, end);
    this.setState({[id]: {end, start}});
  }

  checkNativePay = async () => {
    return await stripe.canMakeNativePayPayments();
  }

  render() {
    const { steps } = this.props.navigation.state.params;
    const { loading, submitting, disabledPayBtns } = this.state;

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
                {steps.map((step, index) => {
                  const stepValueId = String(index);

                  if (index <= 1 && step.message.includes('thanks for using Odyssey!')){
                    const splitUpMessage = step.message.split('\n');
                    step.message = splitUpMessage[splitUpMessage.length - 1];
                  }
                  if (step.id === '3') {
                    return <CardItem key={'itin'+index}>
                      <Text style={{fontSize: 22}}>When are you going?</Text>
                    </CardItem>;
                  }
                  if (index % 2 == 0) {
                    if (step.id === '4') {
                      // TODO: make this the date picker
                       return (
                         <Card key={'itin'+index} transparent>
                           {console.log('yup: ', this.state[stepValueId].start.toString('yyyy-MM-dd'), this.state[stepValueId].end.toString('yyyy-MM-dd'))}
                           <DateRangePicker
                             initialRange={[(new XDate(step.value.start)).toString('yyyy-MM-dd'), (new XDate(step.value.end)).toString('yyyy-MM-dd')]}
                             onSuccess={(s, e) => this.dateChange(stepValueId,s,e)}
                             style={styles.calendar}
                             height={layout.window.height / 1.5}
                             width={layout.window.width}
                           />
                           <CardItem note bordered style={{justifyContent: 'center', flexDirection: 'column'}}>
                             <Text>{new XDate(this.state[stepValueId].start).toString('MMM dd, yyyy')} - {new XDate(this.state[stepValueId].end).toString('MMM dd, yyyy')}</Text>
                             <Text note>*Single day trips are not currenlty supported*</Text>
                           </CardItem>
                         </Card>
                       );
                    }
                    return (
                      <Card key={'itin'+index} transparent>
                        <CardItem bordered>
                          <Textarea
                            style={{flex:1}}
                            bordered
                            placeholder="Type Here..."
                            keyboardAppearance="dark"
                            returnKeyType="done"
                            onSubmitEditing={() => Keyboard.dismiss()}
                            rowSpan={2}
                            value={this.state[stepValueId] || ''}
                            onChangeText={(text) => this.textChange(text, stepValueId)}
                          />
                        </CardItem>
                      </Card>
                    );
                  }
                  return (
                      <CardItem key={'itin'+index}>
                        <Text style={{fontSize: 22}}>{step.message}</Text>
                      </CardItem>
                  );
                })}
              </Content>
            </View>
            <View style={{flex: 0, padding: 4}}>
              {/* <Button bordered success block onPress={this.submit} */}
              <Button success block onPress={() => this.setPaymentModalVisible(true)}
                disabled={loading || this.state['2'].trim() === ''}>
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
