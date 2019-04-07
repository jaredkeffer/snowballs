import React from 'react';
import { StyleSheet, ImageBackground } from 'react-native';
import { Container, Header, Content, Tab, Tabs, View, Text, Spinner } from 'native-base';

import ActionButton from 'react-native-action-button';
import { CarouselWrapper } from '../components/CarouselWrapper';
import ItinerariesList from '../components/ItinerariesList';
import ItineraryAPI from '../api/itineraries';
import api from '../api';

import layout from '../constants/Layout';

export default class ViewItineraryScreen extends React.Component {

  constructor(props) {
    super(props);
    const { navigation } = this.props;
    this.refreshCache = (navigation.state.params)
      ? navigation.state.params.refreshCache
      : false;

    this.state = {
      refreshing: true,
      itinerary: (navigation.state.params)
      ? navigation.state.params.itinerary
      : {}
    }

    this._loadData();
  }

  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.state.params.itinerary.title
    };
  };

  _loadData = () => {
    console.log('loading view itinerary data');
    // TODO: eventually this will be driven off of our experience ids, and i think we will want to load them here
  }

  render() {

    let { itinerary } = this.state;

    return (
      <Container>
        <Content>
          <ImageBackground style={{height: 150}} imageStyle={{opacity: 0.8}}
            source={{uri: itinerary.img}}>
            <Text style={{padding: 20, textAlign: 'center', color: 'black', fontSize: 24}}>
              {itinerary.title}
            </Text>
          </ImageBackground>
        </Content>
      </Container>
    );
  }
}
