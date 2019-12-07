import React from 'react';
// import { View, ScrollView, StyleSheet, Text } from 'react-native';
import SearchBar from 'react-native-searchbar';
import LoadingSpinner from '../components/LoadingSpinner';
import { CarouselWrapper } from '../components/CarouselWrapper';
import api from '../api/index'

import { StyleSheet, TouchableOpacity, RefreshControl, Image, ScrollView } from 'react-native';
import { Button, Container, Content, View, Text, Card, CardItem, Body, Icon, Right, Left, Spinner } from 'native-base';
import HeaderImageScrollView, { TriggeringView } from 'react-native-image-header-scroll-view';
import * as WebBrowser from 'expo-web-browser';
import * as Animatable from 'react-native-animatable';


export default class MarketplaceDetailScreen extends React.Component {
    constructor(props) {
      super(props);
      const { navigation, data } = this.props;
      
      this.refreshCache = (navigation.state.params)
        ? navigation.state.params.refreshCache
        : false;
  
        this.id = (navigation.state.params)
        ? navigation.state.params.experienceId
        : false;
  
      this.state = {
        loading: true,
      };
      this._onRefresh = this._onRefresh.bind(this);
      this._loadData = this._loadData.bind(this);
      this._goToBooking = this._goToBooking.bind(this);
    }
  
    componentDidMount() {
      console.log('this.id: ', this.id);
      this._loadData(this.id);
    }
    
    static navigationOptions = ({ navigation }) => {
        return {
            title: (navigation.state.params.title) ? navigation.state.params.title : 'Loading...',
            headerBackTitle: ' ',
        };
    };

    _onRefresh = () => {
        this.setState({loading: true});
        this._loadData(this.id, true);
    }

    _loadData = async (experienceId, refreshCache) => {
        console.log('loading experience for: ', this.id);

        let experience = await api.getExperienceDetails(experienceId, refreshCache);
        this.props.navigation.setParams({title: experience.city});

        this.setState({loading: false});
        this.setState({experience: experience});

        return experience;
    }

    showCost = (cost) => {
        if (cost <= 3) return <Text style={{color: '#bbb', fontSize: 20}}><Text style={{color: '#383838', fontSize: 20}}>$</Text>$$</Text>;
        if (cost <= 6) return <Text style={{color: '#bbb', fontSize: 20}}><Text style={{color: '#383838', fontSize: 20}}>$$</Text>$</Text>;
        return <Text style={{color: '#383838'}}>$$$</Text>;
    }

    _goToBooking = () => {
      let { experience } = this.state;
      // const { data: {title, subtitle, experience_id} } = this.props;
      // console.log(`You selected ${title}: ${experience_id}`);
      this.props.navigation.navigate('Booking', {experienceId: experience.id});
    }

    render() {
        let { loading, experience } = this.state;
        if (!experience) return <LoadingSpinner />;

        return (
          <View style={styles.container}>  
          <ScrollView 
            refreshControl={
              <RefreshControl
                refreshing={loading}
                onRefresh={this._onRefresh}
              />
            }>
            <View> 
              <Image style={styles.headerImage} source={{uri: experience.img}}></Image>
              
            </View>
            <View style={styles.overviewSection}>
                <Text style={styles.overviewBox}>{this.showCost(experience.cost)}</Text>
                <Text style={styles.overviewBox}>{experience.duration} hrs</Text>
              </View>
            <View style={styles.container, styles.detailSection}>
              <View>
                <Text style={styles.centerText}>What You'll Do</Text>
                <View style={styles.hr}></View>
                {experience.toDo && experience.toDo > 0  && experience.toDo.map((content) => {
                  return 
                    <Text style={styles.rightText}>{content.toDo}</Text>
                  })}  
              </View>
              <View>
                <Text style={styles.centerText}>What's Included</Text>
                <View style={styles.hr}></View>
                {experience.included && experience > 0  && experience.included.map((content) => {
                  return 
                    <Text style={styles.rightText}>{content.included}</Text>
                  })}  
              </View>
              <View>
                <Text style={styles.centerText}>What's Included</Text>
                <View style={styles.hr}></View>
                {experience.toBring && experience > 0  && experience.toBring.map((content) => {
                  return 
                    <Text style={styles.rightText}>{content.toBring}</Text>
                  })}  
              </View>
            </View>    
          </ScrollView>
          <View>
              <Button 
                style={styles.bookButton}
                onPress={this._goToBooking}
              >
                <Text>Book Now</Text>
              </Button>
            </View>
          </View> 
        );
    }
}

const styles = StyleSheet.create({
  container: {
      flex: 1,
      backgroundColor: '#fff',
  }, 
  centerText: {
    fontSize: 30,
    textAlign: 'left',
    alignSelf: 'center',
    justifyContent: 'center',
  },
  rightText: {
    textAlign: 'right',
  },
  headerImage: {
    height: '100%',
    width: '90%',
    alignSelf: 'center',
  },
  overviewSection: {
    justifyContent: 'space-between',
    width: '80%',
    flexDirection: 'row',
    alignSelf: 'center',
    marginTop: '5%', 
  },
  overviewBox: {
    fontSize: 20,
    backgroundColor: "#e0e0e0",
    borderWidth: 2,
    borderColor: '#000000',
    borderRadius: 10,
    textAlign: 'center',
    width: '20%', 
    overflow: 'hidden'
  },
  detailSection: {
    marginTop: '5%'
  },
  hr: {
    borderBottomColor: '#7a7a7a',
    borderBottomWidth: 1,
    width: '90%',
    alignSelf: 'center',
  },
  bookButton: {
    justifyContent: 'center',
    alignSelf: 'center',
    position: 'absolute',
    bottom: 5,
  },
});
      