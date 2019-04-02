import React from 'react';
import { StyleSheet, } from 'react-native';
import { Container, Header, Content, Tab, Tabs, View, Text, Spinner, } from 'native-base';

import ActionButton from 'react-native-action-button';
import { CarouselWrapper } from '../components/CarouselWrapper';
import ItinerariesList from '../components/ItinerariesList';
import ItineraryAPI from '../api/itineraries';
import UsersAPI from '../api/users';

import layout from '../constants/Layout';

export default class ConciergeScreen extends React.Component {

  constructor(props) {
    super(props);
    this.refreshCache = (this.props.navigation.state.params)
      ? this.props.navigation.state.params.refreshCache
      : false;
    this.state = {};
  }

  static navigationOptions = {
    title: "Concierge",
    headerBackTitle: 'Cancel',
  };

  _onPressItem = (itineraryItem) => {
    console.log(itineraryItem.title);
    // START HERE ----
    // TODO: go to view itinerary page, and pass in the id of the itinerary viewed
  };

  _newItineraryBtnPressed = () => {
    this.props.navigation.navigate('NewItinerary');
  }

  _loadData = () => {
    // TODO: add api call here and then return an object  of the filtered lists
    // 1. get itineraries by user id
    // // TODO: update dynamo with GSI for user id (and date? as range key)
    let data = {
      upcoming: this.data,
      recommended: this.data,
      past: this.data,
    }
    return data;
  }

  /*
  started hashing out what an actual itinerary day might include..
  this list data will be returned from the itineraries dynamo table. it will be inside a higher level object that also
  includes metadata
  */
  data = [
    {
      img: 'https://images.unsplash.com/photo-1528770017924-5c8ab2dfa829?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1000&q=80',
      title: 'NYC Itinerary',
      subtitle: 'some text is going to go here',
      key: 'nyc_itin',
      created_date: '1/1/2019',
      dates: {
        start: 1553574422291,
        end: 1553599422291,
      }
    },
    {
      img: 'https://images.unsplash.com/photo-1527838832700-5059252407fa?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1000&q=80',
      title: 'Istanbul',
      subtitle: 'some text is going to go here',
      key: 'istanbul_itin',
      created_date: '2/2/2019',
      dates: {
        start: 1553574422291,
        end: 1553599422291,
      },
      trip: {
        dayCount: 2,
        dailyItineraries: [
          {
            day: 0,
            date: '3/4/2019',
            experiences: [
              {metadata: {type: 'meal', name:'breakfast'}, expId: 'food-place-id-6'},
              {metadata: {type: 'museum',}, expId: 'experienceId-4'},
              {metadata: {type: 'meal', name:'lunch'}, expId: 'food-place-id-5'},
              {metadata: {type: 'park',}, expId: 'experienceId-5'},
              {metadata: {type: 'meal', name:'dinner'}, expId: 'food-place-id-8'},
              {metadata: {type: 'adventure',}, expId: 'experienceId-6'},
            ],
          },
          {
            day: 1,
            date: '3/5/2019',
            experiences: [
              {metadata: {type: 'meal', name:'breakfast'}, expId: 'food-place-id-6'},
              {metadata: {type: 'museum',}, expId: 'experienceId-4'},
              {metadata: {type: 'meal', name:'lunch'}, expId: 'food-place-id-5'},
              {metadata: {type: 'park',}, expId: 'experienceId-5'},
              {metadata: {type: 'meal', name:'dinner'}, expId: 'food-place-id-8'},
              {metadata: {type: 'adventure',}, expId: 'experienceId-6'},
            ],
          },
        ]
      }
    }
  ];

  render() {
    let { upcoming, recommended, past } = this._loadData();
    return (
      <Container>
        <Tabs tabBarUnderlineStyle={{backgroundColor: '#383838'}}>
          <Tab heading="Upcoming" activeTextStyle={{color: '#383838'}}>
            {/* {loadingUpcoming && <Spinner color="#383838" />} */}
            <ItinerariesList data={upcoming} onPressItem={this._onPressItem} />
          </Tab>
          <Tab heading="Recommended" activeTextStyle={{color: '#383838'}}>
            <ItinerariesList data={recommended} onPressItem={this._onPressItem} />
          </Tab>
          <Tab heading="History" activeTextStyle={{color: '#383838'}}>
            <ItinerariesList data={past} onPressItem={this._onPressItem} />
          </Tab>
        </Tabs>
        <ActionButton
          buttonColor="#00a820"
          onPress={this._newItineraryBtnPressed} />
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
