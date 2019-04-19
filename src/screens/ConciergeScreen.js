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
    this._loadData(true, true);
  }

  static navigationOptions = {
    title: "Concierge",
    headerBackTitle: 'Back',
  };

  _onPressItem = (itineraryItem) => {
    console.log('navigating to', itineraryItem.title);
    this.props.navigation.navigate('ViewItinerary', {itinerary: itineraryItem});
  };

  _newItineraryBtnPressed = () => {
    this.props.navigation.navigate('NewItinerary');
  }

  _loadData = async (setState, refreshCache) => {
    console.log('loading data');

    let data = {
      upcoming: [],
      // saving for later
      // recommended: [],
      past: [],
    };

    let rawData = await api.getUserItineraries(refreshCache);

    if (rawData.itineraries && rawData.itineraries.length) {
      rawData.itineraries.sort((a, b) => a.dates.start > b.dates.start);

      let now = new Date();

      data = {
        // saving for later
        // current: rawData.itineraries.filter((itinerary) => {
        //   let endIsBeforeNow = now.getTime() > itinerary.dates.end
        //       startAfterNow  = now.getTime() < itinerary.dates.start;
        //   if (endIsBeforeNow) return false;
        //   return true;
        // }),
        upcoming: rawData.itineraries
          .filter((itinerary) => {
            let endIsBeforeNow = now.getTime() > itinerary.dates.end;
            if (endIsBeforeNow) return false;
            return true;
          }),
        recommended: rawData.itineraries,
        past: rawData.itineraries
          .filter((itinerary) => {
            let endIsBeforeNow = now.getTime() > itinerary.dates.end;
            if (endIsBeforeNow) return true;
            return false;
          }),
      };
    }
    if (setState) {
      this.setState({itineraries: data});
    }
    this.setState({refreshing: false});
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
          {/* <Tab heading="Recommended" activeTextStyle={{color: '#383838'}}>
            <ItinerariesList
              data={recommended}
              onPressItem={this._onPressItem}
              refreshing={this.state.refreshing}
              onRefresh={this._loadData}/>
          </Tab> */}
          <Tab heading="History" activeTextStyle={{color: '#383838'}}>
            <ItinerariesList
              data={past}
              onPressItem={this._onPressItem}
              refreshing={this.state.refreshing}
              onRefresh={this._loadData}/>
          </Tab>
        </Tabs>
        <ActionButton
          buttonColor="#383838"
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
