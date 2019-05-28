import React from 'react';
import { StyleSheet, } from 'react-native';
import { Container, Content, Tab, Tabs, TabHeading, View, Text, Spinner, Icon, } from 'native-base';

import ActionButton from 'react-native-action-button';
import { CarouselWrapper } from '../components/CarouselWrapper';
import ItinerariesList, { EmptyScreen } from '../components/ItinerariesList';
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
      recommended: [],
      past: [],
    };

    let rawData = await api.getItinerariesWithDetails(refreshCache);

    if (rawData && rawData.length) {
      rawData.sort((a, b) => {
        let realA = (a.dates && a.dates.start) ? a.dates.start : (a.body && a.body['4']) ? a.body['4'].start : undefined;
        let realB = (b.dates && b.dates.start) ? b.dates.start : (b.body && b.body['4']) ? b.body['4'].start : undefined;
        return realA > realB;
      });

      let now = new Date();

      data = {
        // saving for later
        // current: rawData.itineraries.filter((itinerary) => {
        //   let endIsBeforeNow = now.getTime() > itinerary.dates.end
        //       startAfterNow  = now.getTime() < itinerary.dates.start;
        //   if (endIsBeforeNow) return false;
        //   return true;
        // }),
        upcoming: rawData.filter((itinerary) => {
            if (!itinerary.dates || !itinerary.dates.end) return true;
            let endIsBeforeNow = now.getTime() > itinerary.dates.end;
            if (endIsBeforeNow) return false;
            return true;
          }),
        recommended: rawData.recommended,
        past: rawData.filter((itinerary) => {
            if (!itinerary.dates || !itinerary.dates.end) return false;
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
    console.log(data)
    return data;
  }

  render() {
    let { upcoming, recommended, past } = this.state.itineraries;
    return (
      <Container>
        <Tabs tabBarUnderlineStyle={{backgroundColor: '#383838'}}>
          <Tab heading={
              <TabHeading>
                <Icon name="md-timer" style={styles.tabIcon} />
                <Text style={styles.tabText}>Itineraries</Text>
              </TabHeading>
            }
          >
            {/* {loadingUpcoming && <Spinner color="#383838" />} */}
            <ItinerariesList
              data={upcoming}
              onPressItem={this._onPressItem}
              refreshing={this.state.refreshing}
              onRefresh={() => this._loadData(true, true)}/>
          </Tab>
          {recommended && recommended.length > 0 &&
            <Tab heading="Recommended" activeTextStyle={{color: '#383838'}}>
              <ItinerariesList
                data={recommended}
                onPressItem={this._onPressItem}
                refreshing={this.state.refreshing}
                onRefresh={this._loadData}/>
            </Tab>
          }
          <Tab heading={
              <TabHeading>
                <Icon name="md-photos" style={styles.tabIcon} />
                <Text style={styles.tabText}>History</Text>
              </TabHeading>
            }
          >
            {past && past.length > 0 &&
              <ItinerariesList
                data={past}
                onPressItem={this._onPressItem}
                refreshing={this.state.refreshing}
                onRefresh={() => this._loadData(true, true)}
              />
            }
            {past && past.length === 0 &&
              <Content>
                <EmptyScreen msg="This is where you will find itineraries for trips that you have completed." />
              </Content>
            }
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
  tabIcon: {color: '#383838', fontSize: 22},
  tabText: {color: '#383838',},
});
