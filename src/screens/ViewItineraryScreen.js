import React from 'react';
import { RefreshControl, StyleSheet, ImageBackground } from 'react-native';
import { Container, Content, View, Text, Card, CardItem, Body, Icon, Right, Spinner } from 'native-base';
import HeaderImageScrollView, { TriggeringView } from 'react-native-image-header-scroll-view';

import * as Animatable from 'react-native-animatable';

import MetaExperienceView from '../components/MetaExperienceView';
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
        : {},
      showNavTitle: false
    }
    // if (!this.state.itinerary) this._loadData();
  }

  static navigationOptions = ({ navigation }) => {
    return {
      title: (navigation.state.params.itinerary.title)
        ? navigation.state.params.itinerary.title
        : 'Itinerary',

    };
  };

  toggleDay = (day, index) => {
    let { itinerary } = this.state;
    day.show = !day.show;
    itinerary.days[index] = day;

    this.setState({ itinerary });
  }

  _loadData = async (id, refreshCache) => {
    console.log('loading view itinerary data aka experiences');
    this.setState({loading: true});

    let data = await api.getUserItineraries(refreshCache);
    let itinerary = this._findItinerary(id, data);

    this.setState({itinerary});
    this.setState({loading: false});
  }

  _findItinerary = (id, data) => {
    let theItinerary;
    data.itineraries.some((itin) => {
      if (itin.itinerary_id == id) {
        theItinerary = itin;
        return true;
      }
    });
    return theItinerary;
  }

  _onRefresh = () => {
    this.setState({hasRefreshed: true});
    let id = (this.props.navigation.state.params.itinerary.itinerary_id)
    this._loadData(id, true);
  }

  render() {
    let { itinerary, loading, hasRefreshed } = this.state;

    if (!itinerary) return <Spinner color="#ccc" style={{marginTop: 20}} />

    let {img, title, days, dates, overview, } = itinerary;
    let start = new Date(dates.start)
        end = new Date(dates.end);

    return (
      <HeaderImageScrollView
        maxHeight={150}
        minHeight={50}
        headerImage={{uri: img}}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={this._onRefresh}
          />
        }
        fadeOutForeground
        renderForeground={() => (
          <View style={{ height: 150, justifyContent: 'center', alignItems: 'center', }} >
            <Text style={{color: 'white', fontSize: 34, fontWeight: '600'}}>
              {title}
            </Text>
            <Text style={{color: 'white', fontSize: 24, fontWeight: '500'}}>
              {start.toLocaleDateString()} - {end.toLocaleDateString()}
            </Text>
          </View>
        )}
        renderFixedForeground={() => (
          <Animatable.View
            style={{opacity: 0, paddingTop: 16,}}
            ref={navTitleView => {
              this.navTitleView = navTitleView;
          }}>
            <Text style={{color: 'white', fontSize: 20, fontWeight: '300', textAlign: 'center',}}>
              {start.toLocaleDateString()} - {end.toLocaleDateString()}
            </Text>
          </Animatable.View>
      )}>
        <TriggeringView
          onBeginHidden={() => this.navTitleView.fadeIn(200)}
          onDisplay={() => this.navTitleView.fadeOut(100)}
        >
        {loading && <Spinner color="#383838" />}
        {/* Itinerary Overview */}
        {!loading && overview && <Card transparent>
          <CardItem header>
            <Text>Overview</Text>
          </CardItem>
          <CardItem>
            <Body>
              <Text>{overview}</Text>
            </Body>
          </CardItem>
        </Card>}
        {/* Days: Apple Wallet Inspired */}
        { !loading && days && days.map((day, index) => {
          return (
            <Card key={day.day}>
              <CardItem button onPress={() => this.toggleDay(day, index)} style={{backgroundColor: '#f8f8f8',}}>
                <Body style={{justifyContent: 'center', flex: 1, flexDirection: 'row', paddingVertical: 2, }}>
                  <Text>Day {day.day + 1} :</Text><Text style={{color: '#383838'}}> {day.date}</Text>
                </Body>
                <Right>
                  <Icon style={{color: '#bbb'}} name={(day.show) ? 'md-close' : 'ios-arrow-down'}/>
                </Right>
              </CardItem>
              { day.show && day.description &&
                <CardItem>
                  <Text>{day.description}</Text>
                </CardItem>}
              { day.show &&
                <CardItem>
                  <Body>
                    {day.experiences.map((exp, index) =>
                      <MetaExperienceView
                        key={`${exp}-${index}`}
                        experienceId={exp}
                        refreshCache={hasRefreshed}
                        onPress={this.props.navigation.navigate} />)}
                  </Body>
                </CardItem>
              }
           </Card>
          )
        })}

        {!loading && !days &&
          <Card>
            <CardItem>
              <Text>
                It looks like your itinerary is still in the creation process! We'll send you a notification when it is ready.
              </Text>
            </CardItem>
          </Card>
        }
      </TriggeringView>
      </HeaderImageScrollView>
    );
  }
}
