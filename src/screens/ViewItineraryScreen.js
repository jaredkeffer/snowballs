import React from 'react';
import { StyleSheet, ImageBackground } from 'react-native';
import { Container, Content, View, Text, Card, CardItem, Body  } from 'native-base';

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
    // console.log(itinerary);
    let start = new Date(itinerary.dates.start)
        end = new Date(itinerary.dates.end)
    console.log(start);
    console.log(end);
    return (
      <Container>
        <Content>
          <ImageBackground style={{justifyContent: 'center', height: 150, backgroundColor: 'black'}}
            source={{uri: itinerary.img}} imageStyle={{opacity: 0.8}}>
            <Text style={{textAlign: 'center', color: 'white', fontSize: 34, fontWeight: '800'}}>
              {itinerary.title}
            </Text>
            <Text style={{textAlign: 'center', color: 'white', fontSize: 24, fontWeight: '500'}}>
              {start.toLocaleDateString()} - {end.toLocaleDateString()}
            </Text>
          </ImageBackground>
          {/* Itinerary Overview */}
          <Card>
            <CardItem header>
              <Text>Overview</Text>
            </CardItem>
            <CardItem>
              <Body>
                <Text>
                  Itinerary description here
                </Text>
              </Body>
            </CardItem>
         </Card>
          {/* Days experiences in a tab view? */}
          {/* Days experiences in a list view */}
          {/* Days experiences in a carousel view? */}
          {/*  */}
        </Content>
      </Container>
    );
  }
}
