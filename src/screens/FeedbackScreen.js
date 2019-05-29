import React from 'react';
import { Picker } from 'react-native';
import { H1, H3, Container, Content, Button, View, Text, Radio, Left, Right, ListItem } from 'native-base';
import api from '../api';

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
  }

  renderOptions = (price, count) => {
    let label = count ? `\$${price}/day or \$${price*count} total` : `\$${price}/day`;
    return <Picker.Item label={label} value={price} key={label}/>
  }

  _valueChange = (itemValue, itemIndex) => this.setState({selectedPrice: itemValue});

  submit = async (itineraryId) => {
    let response = await api.submitItineraryFeedback(itineraryId, {willingToPayPerDay: this.state.selectedPrice});
    this.props.navigation.navigate('Concierge', {refreshCache: true});
  }

  render() {
    const { itinerary_id, dayCount } = this.props.navigation.state.params;
    const { selectedPrice, optionsList } = this.state;
    return (
      <Container>
        <Content style={{padding: 10}}>
          <H3>Thank You for confirming your itinerary!</H3>
          <H3 style={{paddingTop: 10}}>Last thing: How much would you be willing to pay for this itinerary?</H3>
          <Picker selectedValue={selectedPrice} onValueChange={this._valueChange}>
            {optionsList.map(option => this.renderOptions(option.pricePerDay, dayCount))}
          </Picker>
          <Button bordered success block onPress={() => this.submit(itinerary_id)}>
            <Text>Submit</Text>
          </Button>
        </Content>
      </Container>
    );
  }
}
