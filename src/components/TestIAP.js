import React from 'react';
import { Content, Container, Text, View, Button } from 'native-base';
// import * as InAppPurchases from 'expo-in-app-purchases';
import stripe from 'tipsi-stripe'

const steps = [
  {"message": "","metadata": undefined, "value": undefined,},
  {
    "id": "1",
    "message": "Hi there, thanks for using Odyssey! Let's get started building your itinerary. What city do you want to travel to?",
    "metadata": undefined,
    "value": undefined,
  },
  {
    "id": "2",
    "message": "Boston",
    "metadata": undefined,
    "value": "Boston",
  },
  {
    "id": "3",
    "message": "Awesome, let us know below what dates you plan to travel. It's okay if your plans aren't set in stone. We can adjust your itinerary later! When you're finished selecting the dates, press \"Done\"",
    "metadata": undefined,
    "value": undefined,
  },
  {
    "id": "4",
    "message": undefined,
    "metadata": undefined,
    "value":  {
      "end": "2019-07-17T03:59:20.379Z",
      "start": "2019-07-12T03:59:20.379Z",
    },
  },
  {
    "id": "5",
    "message": "How many times have you been there?",
    "metadata": undefined,
    "value": undefined,
  },
  {
    "id": "6",
    "message": "Twice",
    "metadata": undefined,
    "value": "Twice",
  },
  {
    "id": "7",
    "message": "How many people will you be traveling with?",
    "metadata": undefined,
    "value": undefined,
  },
  {
    "id": "8",
    "message": "3",
    "metadata": undefined,
    "value": "3",
  },
  {
    "id": "9",
    "message": "What kind of pace do you want to have?",
    "metadata": undefined,
    "value": undefined,
  },
  {
    "id": "10",
    "message": "Active",
    "metadata": undefined,
    "value": "Active",
  },
  {
    "id": "11",
    "message": "How much do you typically spend (per person) on a meal?",
    "metadata": undefined,
    "value": undefined,
  },
  {
    "id": "12",
    "message": "$41 - $50",
    "metadata": undefined,
    "value": "$41 - $50",
  },
  {
    "id": "13",
    "message": "Do you already have anything specific planned for this trip?",
    "metadata": undefined,
    "value": undefined,
  },
  {
    "id": "14",
    "message": "",
    "metadata": undefined,
    "value": "",
  },
  {
    "id": "15",
    "message": "Is there anything that you cannot miss on this trip? (For example: If you were traveling to Paris and you absolutely had to go the Eiffel Tower, you would put Eiffel Tower)",
    "metadata": undefined,
    "value": undefined,
  },
  {
    "id": "16",
    "message": "",
    "metadata": undefined,
    "value": "",
  },
  {
    "id": "17",
    "message": "Is there anything else about your travel preferences that you would like us to know? (Feel free to tell us anything and everything!)",
    "metadata": undefined,
    "value": undefined,
  },
  {
    "id": "18",
    "message": "",
    "metadata": undefined,
    "value": "",
  },
];

export default class TestIAP extends React.Component {
  static navigationOptions = {
    title: 'Test IAP',
    headerBackTitle: 'Cancel',
  };

  go = () => {
    this.props.navigation.navigate('ReviewItinerary', {steps, values: {}});
  }

  render() {
    return (
      <View>
        <Text>Testing In App Purchases</Text>
        <Button onPress={this.connect}>
          <Text>Connect</Text>
        </Button>
        <Text>Testing Apple Pay</Text>
        <Button onPress={this.go}>
          <Text>{'go to confirm itin'}</Text>
        </Button>
      </View>
    );
  }
}
