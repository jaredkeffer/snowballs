import React, { Component } from 'react';
import { Alert, Platform, SafeAreaView, StatusBar, StyleSheet, TextInput, TouchableOpacity, } from 'react-native';
import { Button, Text, View} from 'native-base';
import { Cache } from 'aws-amplify';
import ChatBot from 'react-native-chatbot';
import DateRangePicker from '../components/DateRangePicker';
import LoadingSpinner from '../components/LoadingSpinner';
import { formattedSteps } from '../constants/Questions';
import api from '../api/index';

import layout from '../constants/Layout';

const XDate = require('xdate');
const oneWeek =  (6.048 * 10**8) * (5/7);

export default class CreateItineraryScreen extends Component {

  constructor(props){
    super(props);
    this.state = {
      loading: true,
    };

    this._loadData();
  }

  static navigationOptions = {
    title: "Create Itinerary",
  };

  _loadData = async () => {
    const questions = await api.getItineraryQuestions();
    this.setState({loading: false, questions});
  }

  handleEnd = (result) => {
    const {steps, values} = result;
    this.props.navigation.navigate('ReviewItinerary', {steps, values});
  }

  skip = () => {
    console.log('skipping initial itinerary creation');
    const { navigation } = this.props;
    navigation.navigate('Home');
  }

  render() {
    const { botName, showChatBot, welcomeMessage, loading, questions } = this.state;
    if (loading) return <LoadingSpinner />;

    const { navigation } = this.props;
    let steps = formattedSteps(questions);

    let allowSkip = (navigation.state && navigation.state.params) ? navigation.state.params.allowSkip : false;

    return (
      <SafeAreaView style={styles.container}>
        {allowSkip &&
          <Button transparent info block onPress={this.skip} style={{paddingTop: 24, height: 62, justifyContent: "flex-end"}}>
            <Text style={{fontSize: 20}}>Skip</Text>
          </Button>
        }
        <ChatBot
          steps={steps}
          avatarStyle={{display: 'none'}}
          botDelay={250}
          userDelay={20}
          hideUserAvatar={true}
          keyboardVerticalOffset={(Platform.OS === 'ios') ? 62 : 0}
          userBubbleColor="#0099ff"
          userFontColor='#fff'
          botBubbleColor="#eee"
          botFontColor='#000'
          scrollViewProps={{style: {backgroundColor: '#fff', paddingTop: (allowSkip) ? 14 : 4,}}}
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
