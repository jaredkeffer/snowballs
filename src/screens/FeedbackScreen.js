import React from 'react';
import { Alert, Picker, Image } from 'react-native';
import { H1, H3, Container, Content, Button, View, Text, Radio, Left, Right, ListItem, Toast } from 'native-base';
import { WebBrowser } from 'expo';
import api from '../api';

export const SURVEY_MONKEY_URL = 'https://www.surveymonkey.com/r/ZXG5TNN';

export default class FeedbackScreen extends React.Component {
  static navigationOptions = {
    title: 'Feedback',
    headerLeft: null,
  };

  state = {};

  constructor(props) {
    super(props);
    this.state.optionsList = [
      {pricePerDay: 20},
      {pricePerDay: 15},
      {pricePerDay: 10},
      {pricePerDay: 7},
      {pricePerDay: 5},
      {pricePerDay: 3},
    ];
    this.state.selectedPrice = this.state.optionsList[this.state.optionsList.length/2 - 1].pricePerDay
  }

  renderOptions = (price, count) => {
    let label = count ? `\$${price}/day or \$${price*count} total` : `\$${price}/day`;
    return <Picker.Item label={label} value={price} key={label}/>
  }

  _valueChange = (itemValue, itemIndex) => this.setState({selectedPrice: itemValue});

  submit = async (itineraryId) => {
    // in the future allow for different surveys
    // let user = await api.getUser();
    let response = await api.submitItineraryFeedback(itineraryId, {willingToPayPerDay: this.state.selectedPrice});
    Alert.alert('Helpful Hint:', 'When you finish the survey close the window by pressing "Done" in the top left corner.');
    // if (!user.surveyComplete) await this._showWeb(user.surveyURL || SURVEY_MONKEY_URL);
    await this._showWeb(SURVEY_MONKEY_URL);
    this.props.navigation.state.params.onGoBack(true, true);
    this.props.navigation.navigate('Concierge');
  }

  _showWeb = async (url) => {
    let result = await WebBrowser.openBrowserAsync(url);
  }

  render() {
    const { itinerary_id, dayCount } = this.props.navigation.state.params;
    const { selectedPrice, optionsList } = this.state;
    return (
      <Container>
        <Content style={{padding: 10}}>
          <View style={{flex:1, flexDirection: 'row'}}>
            <View style={{flex:1}}>
              <Image style={{resizeMode:'contain', width: 75, height: 75}} source={require('../assets/images/icon.png')}/>
            </View>
            <View style={{flex:4, justifyContent:'center'}}>
              <Text style={{textAlign:'center', fontSize: 24}}>Thanks for confirming your itinerary!</Text>
            </View>
          </View>
          <View style={{paddingTop: 10, paddingBottom:30}}>
            <H3 style={{padding: 8}}>You're one of our first customers!</H3>
            <H3 style={{padding: 8}}>It would be a huge help if you could answer the following quick questions.</H3>
            <H3 style={{padding: 8, fontWeight: 'bold'}}>1. How much would you be willing to pay for this itinerary?</H3>
            <Picker selectedValue={selectedPrice} onValueChange={this._valueChange}>
              {optionsList.map(option => this.renderOptions(option.pricePerDay, dayCount))}
            </Picker>
            <Button bordered success block onPress={() => this.submit(itinerary_id)}>
              <Text>Next</Text>
            </Button>
          </View>
        </Content>
      </Container>
    );
  }
}
