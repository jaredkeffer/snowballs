import React from 'react';
import { StyleSheet, } from 'react-native';
import { Container, Header, Content, Tab, Tabs, View, Text, Spinner, } from 'native-base';

import ActionButton from 'react-native-action-button';
import { CarouselWrapper } from '../components/CarouselWrapper';
import ItinerariesList from '../components/ItinerariesList';
import ItineraryAPI from '../api/itineraries';
import api from '../api';

import layout from '../constants/Layout';

export default class ConciergeScreen extends React.Component {

  constructor(props) {
    super(props);
    this.refreshCache = (this.props.navigation.state.params)
      ? this.props.navigation.state.params.refreshCache
      : false;
    this.state = {
      itineraries:{},
      refreshing: true,
    };
    this._loadData(true);
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

  _loadData = async (setState) => {
    console.log('loading data');
    let rawData = await api.getUserItineraries(true);

    // LOOK INTO: update dynamo with GSI for user id (and date? as range key)
    let data = {
      upcoming: rawData.itineraries,
      recommended: rawData.itineraries,
      past: rawData.itineraries,
    };

    if (setState) {
      this.setState({itineraries: data});
      this.setState({refreshing: false});
    }

    return data;
  }

  render() {
    let { upcoming, recommended, past } = this.state.itineraries;
    return (
      <Container>
        <Tabs tabBarUnderlineStyle={{backgroundColor: '#383838'}}>
          <Tab heading="Upcoming" activeTextStyle={{color: '#383838'}}>
            {/* {loadingUpcoming && <Spinner color="#383838" />} */}
            <ItinerariesList
              data={upcoming}
              onPressItem={this._onPressItem}
              refreshing={this.state.refreshing}
              onRefresh={this._loadData}/>
          </Tab>
          <Tab heading="Recommended" activeTextStyle={{color: '#383838'}}>
            <ItinerariesList
              data={recommended}
              onPressItem={this._onPressItem}
              refreshing={this.state.refreshing}
              onRefresh={this._loadData}/>
          </Tab>
          <Tab heading="History" activeTextStyle={{color: '#383838'}}>
            <ItinerariesList
              data={past}
              onPressItem={this._onPressItem}
              refreshing={this.state.refreshing}
              onRefresh={this._loadData}/>
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
