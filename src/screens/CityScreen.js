import React from 'react';
import { StyleSheet, TouchableOpacity, RefreshControl, Image } from 'react-native';
import { Button, Container, Content, View, Text, Card, CardItem, Body, Icon, Right, Left, Spinner } from 'native-base';
import HeaderImageScrollView, { TriggeringView } from 'react-native-image-header-scroll-view';
import { WebBrowser } from 'expo';

import * as Animatable from 'react-native-animatable';
import LoadingSpinner from '../components/LoadingSpinner';

import api from '../api/index';

export default class CityScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    if (props.navigation.state.params.data) {
      this.state.data = {...props.navigation.state.params.data};
      this.id = this.state.data.experience_id
    }
    else if (props.navigation.state.params.experience_id) {
      this.id = props.navigation.state.params.experience_id;
      this.loadData();
    }
  }

  static navigationOptions = ({ navigation }) => {
    return {
      title: (navigation.state.params.data.city) ? navigation.state.params.data.city : 'Loading...',
      headerBackTitle: ' ',
    };
  };

  _onRefresh = () => {
    this.loadData(this.id, true);
  }

  loadData = async (id) => {
    this.setState({loading: true});
    console.log(`loading article with id ${id}`);
    let city = await api.getExperienceDetails(id, true);
    this.setState({city, loading: false});
    return city;
  }

  render() {
    const { data: { title, subtitle, img, city, type, overview, steps, details }, loading } = this.state;
    // const { duration, location } = details;
    return (
      <HeaderImageScrollView
        maxHeight={150}
        minHeight={50}
        maxOverlayOpacity={0.6}
        minOverlayOpacity={0.35}
        headerImage={{uri: img}}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={this._onRefresh}
          />
        }
        fadeOutForeground
        renderForeground={() => (
          <View style={{ height: 150, justifyContent: "center", alignItems: "center" }} >
            <Text style={{textAlign: 'center', color: 'white', fontSize: 34, fontWeight: '800'}}>
              {title}
            </Text>
            <Text style={{textAlign: 'center', color: 'white', fontSize: 30, fontWeight: '700'}}>
              {city}
            </Text>
            {/* // TODO: We can put a map here like in the zillow app so that when you spwipe right then you see where it is */}
          </View>
        )}
        renderFixedForeground={() => (
          <Animatable.View
            style={{opacity: 0, paddingTop: 16,}}
            ref={navTitleView => {this.navTitleView = navTitleView;}}
          >
            <Text style={{color: 'white', fontSize: 20, fontWeight: '500', textAlign: 'center',}}>
            {title}
            </Text>
          </Animatable.View>
      )}>
        <TriggeringView
          onBeginHidden={() => this.navTitleView.fadeIn(200)}
          onDisplay={() => this.navTitleView.fadeOut(100)}
        >
          {loading && <Spinner color="#383838" />}
          {!loading &&
            <View>
              <Text>{title}</Text>
            </View>
          }
      </TriggeringView>
      </HeaderImageScrollView>
    );
  }
}
