import React from 'react';
import { StyleSheet, TouchableOpacity, RefreshControl, Image } from 'react-native';
import { Button, Container, Content, View, Text, Card, CardItem, Body, Icon, Right, Left, Spinner } from 'native-base';
import HeaderImageScrollView, { TriggeringView } from 'react-native-image-header-scroll-view';
import * as WebBrowser from 'expo-web-browser';

import * as Animatable from 'react-native-animatable';
import LoadingSpinner from '../components/LoadingSpinner';

import api from '../api/index';

export default class ArticleScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    if (props.navigation.state.params.content) {
      this.state.content = {...props.navigation.state.params.content};
      this.id = this.state.content.experience_id
    }
    else if (props.navigation.state.params.experience_id) {
      this.id = props.navigation.state.params.experience_id;
      this.loadData();
    }
  }

  static navigationOptions = ({ navigation }) => {
    return {
      title: (navigation.state.params.content.city) ? navigation.state.params.content.city : 'Loading...',
      headerBackTitle: ' ',
    };
  };

  _onRefresh = () => {
    this.loadData(this.id, true);
  }

  loadData = async (id) => {
    this.setState({loading: true});
    console.log(`loading article with id ${id}`);
    let content = await api.getExperienceDetails(id, true);
    this.setState({content, loading: false});
    return content;
  }

  render() {
    const { content: { title, subtitle, img, city, type, overview, steps, details }, loading } = this.state;
    const { duration, location } = details;
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
          {!loading && type == 'article' &&
            <View>
              <Card>
                <CardItem header bordered style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                  <Body>
                    <Text style={{color: 'black', fontWeight: '500'}}>{location.start} to {location.end}</Text>
                    <Text style={{color: '#787878', fontWeight: '500'}}>{duration.start} - {duration.end}</Text>
                  </Body>
                </CardItem>
                { (typeof(overview) !== String) && overview.map((ov) =>
                    <CardItem transparent style={{paddingHorizontal: 6}} key={ov}><Text style={{lineHeight:22}}>{ov}</Text></CardItem>)}
                { (typeof(overview) === String) && <Text>{overview}</Text> }

                {/* Steps */}
                { steps.map((step, index) => {
                    return (
                      <Card key={index}>
                        <CardItem header style={{justifyContent: 'space-between'}}>
                          <Body>
                            <Text style={{fontWeight: 'bold'}}>{step.title}</Text>
                            <Text style={{fontStyle: 'italic', color: '#787878'}}>{step.address}</Text>
                          </Body>
                          {step.url &&
                            <TouchableOpacity onPress={async () => await WebBrowser.openBrowserAsync(step.url)}>
                              <Icon style={{color: "#787878", fontSize: 20}} name="ios-link"/>
                            </TouchableOpacity>
                          }
                        </CardItem>
                        {step.img &&
                          <CardItem>
                            <Image source={{uri: step.img}} style={{flex: 1, height: 125}}/>
                          </CardItem>
                        }
                        {step.text &&
                        <CardItem>
                          <Body>
                            <Text style={{lineHeight:22}}>{step.text}</Text>
                          </Body>
                        </CardItem>
                      }
                      </Card>
                    )
                  })
                }
              </Card>
            </View>}
      </TriggeringView>
      </HeaderImageScrollView>
    );
  }
}
