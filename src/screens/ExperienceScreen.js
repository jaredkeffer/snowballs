import React from 'react';
import { Container, Content, View, Text, Card, CardItem, Body, Icon, Right, Spinner } from 'native-base';
import HeaderImageScrollView, { TriggeringView } from 'react-native-image-header-scroll-view';

import * as Animatable from 'react-native-animatable';

import MetaExperienceView from '../components/MetaExperienceView';
import api from '../api';

import layout from '../constants/Layout';

export default class ExperienceScreen extends React.Component {

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
    this._loadData(this.id);
  }

  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Odyssey Experience', // TODO: Fix this to be dynamic
      headerBackTitle: ' ',
    };
  };

  _loadData = async (experienceId, refreshCache) => {
    console.log('loading experience for: ', this.id);
    let experience = await api.getExperienceDetails(experienceId, refreshCache);

    this.setState({loading: false});
    this.setState({experience: experience});
    return experience;
  }

  render() {
    const { loading, experience } = this.state;
    if (loading || !experience) return <Container><Spinner color="grey"/></Container>
    return (
      <HeaderImageScrollView
        maxHeight={150}
        minHeight={50}
        maxOverlayOpacity={0.6}
        minOverlayOpacity={0.35}
        headerImage={{uri: experience.img}}
        fadeOutForeground
        renderForeground={() => (
          <View style={{ height: 150, justifyContent: "center", alignItems: "center" }} >
            <Text style={{color: 'white', fontSize: 34, fontWeight: '800'}}>
              {experience.name}
            </Text>
          </View>
        )}
        renderFixedForeground={() => (
          <Animatable.View
            style={{opacity: 0, paddingTop: 16,}}
            ref={navTitleView => {
              this.navTitleView = navTitleView;
            }}>
            <Text style={{color: 'white', fontSize: 20, fontWeight: '400', textAlign: 'center',}}>
            {experience.name}
            </Text>
          </Animatable.View>
      )}>
        <TriggeringView
          onBeginHidden={() => this.navTitleView.fadeIn(200)}
          onDisplay={() => this.navTitleView.fadeOut(100)}
        >
          <Card>
            <CardItem>
              <Text>{experience.description}</Text>
            </CardItem>
          </Card>
          <Text>{JSON.stringify(experience)}</Text>
      </TriggeringView>
      </HeaderImageScrollView>
    );
  }
}
