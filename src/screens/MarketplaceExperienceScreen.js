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
        const { navigation } = this.props;
    
        this.refreshCache = (navigation.state.params)
          ? navigation.state.params.refreshCache
          : false;
    
          this.id = (navigation.state.params)
          ? navigation.state.params.experienceId
          : false;
    
        this.state = {
          loading: true,
        }
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
        if (cost <= 3) return <Text style={{color: '#bbb'}}><Text style={{color: '#383838'}}>$</Text>$$</Text>;
        if (cost <= 6) return <Text style={{color: '#bbb'}}><Text style={{color: '#383838'}}>$$</Text>$</Text>;
        return <Text style={{color: '#383838'}}>$$$</Text>;
    }

    _showWeb = async (url) => {
    let result = await WebBrowser.openBrowserAsync(url);
    }

    render() {
        let { loading, experience, showWeb } = this.state;
        if (!experience) return <LoadingSpinner />;

        return (
          <View style={styles.screen}>
            <View style={styles.container}>
              <Image style={styles.container} source={{uri: experience.img}}></Image>
              <View style={styles.container}>
                <View header bordered style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                  <Text style={{color: 'black'}}>${experience.cost}</Text>
                  <Text>{experience.duration} hrs<Text style={{color: '#aaa'}}></Text></Text>
                </View>
              </View>
            </View>
            <View style={styles.container}>
              <View>
                <View>
                  <Text style={styles.centerText}>What You'll Do</Text>
                  {experience.toDo && experience.toDo > 0  && experience.toDo.map((content) => {
                    return 
                      <Text style={styles.rightText}>{content.toDo}</Text>
                    })}  
                </View>
                <View>
                  <Text style={styles.centerText}>What's Included</Text>
                  {experience.included && experience > 0  && experience.included.map((content) => {
                    return 
                      <Text style={styles.rightText}>{content.included}</Text>
                    })}  
                </View>
                <View>
                  <Text style={styles.centerText}>What's Included</Text>
                  {experience.toBring && experience > 0  && experience.toBring.map((content) => {
                    return 
                      <Text style={styles.rightText}>{content.toBring}</Text>
                    })}  
                </View>
              </View>
            </View>
            <View>
              <Button style={styles.bookButton}>
                <Text>Book Now</Text>
              </Button>
            </View>
          </View>
        );
    }
}

const styles = StyleSheet.create({
    screen: {
      flex: 1,
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    contentContainer: {
        // alignItems: 'center',
        // paddingTop: 30,
    },
    carouselContainer: {
        alignItems: 'center',
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
    bookButton: {
      justifyContent: 'center',
      alignSelf: 'center',
      position: 'absolute',
      bottom: 5,
    },
    });
      