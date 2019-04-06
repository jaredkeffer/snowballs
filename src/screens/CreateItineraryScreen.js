import React, { Component } from 'react';
import { Alert, Platform, SafeAreaView, StatusBar, StyleSheet, TextInput, TouchableOpacity, } from 'react-native';
import { Button, Text, View} from 'native-base';
import { Cache } from 'aws-amplify';
import ChatBot from 'react-native-chatbot';
import DateRangePicker from '../components/DateRangePicker';
import { formattedSteps } from '../constants/Questions';

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

  handleEnd = (result) => {
    const {renderedSteps, steps, values} = result;
    this.props.navigation.navigate('ReviewItinerary', {steps, values});
  }

  skip = () => {
    console.log('skipping initial itinerary creation');
    const { navigation } = this.props;
    navigation.navigate('Home');
  }

  render() {
    const { botName, showChatBot, welcomeMessage } = this.state;
    const { navigation } = this.props;
    let steps = formattedSteps();

    let allowSkip = (navigation.state && navigation.state.params) ? navigation.state.params.allowSkip : true;

    return (
      <SafeAreaView style={styles.container}>
        {allowSkip &&
          <Button transparent info block onPress={this.skip} >
            <Text>Skip</Text>
          </Button>
        }
        <ChatBot
          steps={steps}
          avatarStyle={{display: 'none'}}
          botDelay={300}
          userDelay={20}
          hideUserAvatar={true}
          keyboardVerticalOffset={(Platform.OS === 'ios') ? 62 : 0}
          userBubbleColor="#0099ff"
          userFontColor='#fff'
          botBubbleColor="#eee"
          botFontColor='#000'
          scrollViewProps={{style: {backgroundColor: '#fff', paddingTop: 4,}}}
          handleEnd={this.handleEnd}
          submitButtonColor="#383838"
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
