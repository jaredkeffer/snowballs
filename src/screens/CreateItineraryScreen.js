import React, { Component } from 'react';
import { Alert, Platform, SafeAreaView, StatusBar, StyleSheet, TextInput, Text, TouchableOpacity, View } from 'react-native';
import { Cache } from 'aws-amplify';
import ChatBot from 'react-native-chatbot';
import DateRangePicker from '../components/DateRangePicker';
import { steps } from '../constants/Questions';

import layout from '../constants/Layout';

const XDate = require('xdate');
const oneWeek =  (6.048 * 10**8) * (5/7);

export default class CreateItineraryScreen extends Component {
  state = {};

  constructor(props){
    super(props)
  }

  static navigationOptions = {
    title: "Create Itinerary",
  };

  render() {
    const { botName, showChatBot, welcomeMessage } = this.state;
    let s = steps();
    console.log(s);

    return (
      <SafeAreaView style={styles.container}>
        <ChatBot
          steps={s}
          avatarStyle={{display: 'none'}}
          botDelay={300}
          userDelay={50}
          hideUserAvatar={true}
          keyboardVerticalOffset={(Platform.OS === 'ios') ? 62 : 0}
          userBubbleColor="#363d7f"
          userFontColor='#fff'
          botBubbleColor="#ffeaa0"
          botFontColor='#000'
        />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: StatusBar.currentHeight,
  },
});
