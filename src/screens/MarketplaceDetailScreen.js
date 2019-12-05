import React from 'react';
// import { View, ScrollView, StyleSheet, Text } from 'react-native';
import SearchBar from 'react-native-searchbar';
import LoadingSpinner from '../components/LoadingSpinner';
import { CarouselWrapper } from '../components/CarouselWrapper';
import api from '../api/index'

import { StyleSheet, TouchableOpacity, RefreshControl, Image } from 'react-native';
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
        const { loading, experience, showWeb } = this.state;
        if (!experience) return <LoadingSpinner />;

        return (
            <HeaderImageScrollView
            maxHeight={150}
            minHeight={50}
            maxOverlayOpacity={0.6}
            minOverlayOpacity={0.35}
            headerImage={{uri: experience.img}}
            refreshControl={
              <RefreshControl
                refreshing={loading}
                onRefresh={this._onRefresh}
              />
            }
            fadeOutForeground
            renderForeground={() => (
              <View style={{ height: 150, justifyContent: "center", alignItems: "center" }} >
                <Text style={{color: 'white', fontSize: 34, fontWeight: '800'}}>
                  {experience.name}
                </Text>
                {/* We can put a map here like in the zillow app so that when you spwipe right then you see where it is */}
              </View>
            )}
            renderFixedForeground={() => (
              <Animatable.View
                style={{opacity: 0, paddingTop: 16,}}
                ref={navTitleView => {this.navTitleView = navTitleView;}}
              >
                <Text style={{color: 'white', fontSize: 20, fontWeight: '400', textAlign: 'center',}}>
                {experience.name}
                </Text>
              </Animatable.View>
          )}>
            <TriggeringView
              onBeginHidden={() => this.navTitleView.fadeIn(200)}
              onDisplay={() => this.navTitleView.fadeOut(100)}
            >
              {loading && <Spinner color="#383838" />}
              {!loading && experience.type !== 'article' &&
                <View>
                  <Card>
                    <CardItem header bordered style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                      <Text style={{color: 'black'}}>Overview</Text>
                      <Text>
                        <Text>{experience.duration} hrs<Text style={{color: '#aaa'}}> | </Text></Text>
                        {this.showCost(experience.cost)}
                      </Text>
                    </CardItem>
                    <CardItem>
                      <Text style={{lineHeight:22}}>{experience.description}</Text>
                    </CardItem>
                    <CardItem>
                      <Body style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                        {experience.category.length > 0 &&
                          <View style={{flexDirection: 'row'}}>
                            <Text>
                              <Text style={{fontWeight: '500'}}>Tags: </Text>
                            </Text>
                            {experience.category.map((type) => {
                              return (
                                <TouchableOpacity key={type} onPress={() => console.log(`pressed ${type} tag`)}>
                                  <Text style={{color: '#787878'}}>#{type.toLowerCase()} </Text>
                                  {/* <Text>{type} </Text> */}
                                </TouchableOpacity>
                              )
                            })}
                          </View>
                        }
                      </Body>
                    </CardItem>
                  </Card>
                  <Card>
                    <CardItem header bordered>
                      <Text style={{color: 'black'}}>Details</Text>
                    </CardItem>
                    <CardItem>
                      <Text style={{flex: 1, fontWeight: '500'}}>Time Slot:</Text>
                      <Text style={{flex: 2}}>{experience.slot}</Text>
                    </CardItem>
                    {experience.min_age !== undefined &&
                      <CardItem>
                        <Text style={{flex: 1, fontWeight: '500'}}>Age Range:</Text>
                        <Text style={{flex: 2}}>{experience.min_age}+</Text>
                      </CardItem>}
                    </Card>
                    {experience.website &&
                    <Card>
                      <CardItem style={{padding: 0}}>
                        <Body>
                          <Text style={{fontWeight: '500'}}>Experience Webiste: </Text>
                          <Button transparent dark onPress={() => this._showWeb(experience.website)}>
                            <Text style={{marginLeft: -16, fontSize: 16, color: '#383838'}}>{experience.website}</Text>
                          </Button>
                        </Body>
                      </CardItem>
                    </Card>}
                </View>}
          </TriggeringView>
          </HeaderImageScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    contentContainer: {
        // alignItems: 'center',
        // paddingTop: 30,
    },
    carouselContainer: {
        alignItems: 'center'
    }
    });
      