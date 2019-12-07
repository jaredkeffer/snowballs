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


export default class MarketplaceBookingScreen extends React.Component {
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

    render() {
        let { loading, experience, showWeb } = this.state;
        // if (!experience) return <LoadingSpinner />;

        return (
          <View>
            <View><Text>The button works!</Text></View> 
            <View><Text>{this.props.experience}</Text></View>
          </View>
           
        );
    }
}