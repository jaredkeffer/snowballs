import React from 'react';
import { StyleSheet, TouchableOpacity, RefreshControl, Image } from 'react-native';
import { Button, Container, Content, View, Tab, Tabs, TabHeading, Text, Card, CardItem, Body, Icon, Right, Left, Spinner, ScrollableTab } from 'native-base';
import HeaderImageScrollView, { TriggeringView } from 'react-native-image-header-scroll-view';
import { WebBrowser } from 'expo';
import CityOverview from '../components/CityOverview';

import * as Animatable from 'react-native-animatable';
import LoadingSpinner from '../components/LoadingSpinner';

import api from '../api/index';

export default class CityScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    if (props.navigation.state.params.data) {
      this.state.city = {...props.navigation.state.params.data};
      this.id = this.state.city.experience_id
    }
    else if (props.navigation.state.params.experience_id) {
      this.id = props.navigation.state.params.experience_id;
      this.loadCityInfo();
    }
  }

  static navigationOptions = ({ navigation }) => {
    return {
      title: (navigation.state.params.data.city) ? navigation.state.params.data.city : 'Loading...',
      headerBackTitle: ' ',
    };
  };

  _onRefresh = () => {
    this.loadCityInfo(this.id, true);
  }

  loadCityInfo = async (id) => {
    this.setState({loading: true});
    console.log(`loading city overview with id ${id}`);
    let city = await api.getExperienceDetails(id, true);
    this.setState({city, loading: false});
  }

  _onRefreshExperiences = () => {
    this.loadExperiencesForCity(this.id, this.state.city.city, true);
  }

  loadExperiencesForCity = async (id, city) => {
    this.setState({expLoading: true});
    console.log(`loading ${city} experiences with id ${id}`);
    let experiences = await api.getFeaturedExperiencesForCity(id, city, true);
    this.setState({experiences, loading: false});
  }

  render() {
    const { city, loading, expLoading, experiences } = this.state;
    const { title, subtitle, img, city, type, overview, steps, details, country } = city;
    if (loading) return <Spinner color="#383838" />;
    return (
      <Tabs tabBarUnderlineStyle={{backgroundColor: '#383838'}} renderTabBar={()=> <ScrollableTab />} >
        <Tab heading={
            <TabHeading>
              <Icon name="ios-book" style={styles.tabIcon} />
              <Text style={styles.tabText}>Overview</Text>
            </TabHeading>
          }
        >
          <Content refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={this._onRefresh}
            />
          }>
            <CityOverview title={title || `${city}, ${country}`} overview={overview} details={details} img={img}/>
          </Content>
        </Tab>
        {/* <Tab heading={
            <TabHeading>
              <Icon name="ios-map" style={styles.tabIcon} />
              <Text style={styles.tabText}>Map</Text>
            </TabHeading>
          }
        >
          <View>
            <Text>{subtitle}</Text>
          </View>
        </Tab> */}
        <Tab heading={
            <TabHeading>
              <Icon name="md-compass" style={styles.tabIcon} />
              <Text style={styles.tabText}>Experiences</Text>
            </TabHeading>
          }
        >
          <Content refreshControl={
            <RefreshControl
              refreshing={expLoading}
              onRefresh={this._onRefreshExperiences}
            />
          }>
            {experiences.map((content) => {
              return <ContentPreview
                key={content.title}
                title={content.title}
                img={content.img}
                content={content}
                subtitle={content.subtitle}
                onPress={this.props.navigation.navigate}
              />
            })}
          </Content>
        </Tab>
      </Tabs>
    );
  }
}

const styles = StyleSheet.create({
tabIcon: {color: '#383838', fontSize: 22},
tabText: {color: '#383838',},
});
