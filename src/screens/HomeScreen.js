import React from 'react';
import { Image, StyleSheet, RefreshControl } from 'react-native';
import { H2, H3, Content, Container, Button, Tab, Tabs, TabHeading, View, Text, Spinner, Icon } from 'native-base';

import { Analytics, Auth } from 'aws-amplify';
import SearchBar from 'react-native-searchbar'
import Features from '../util/features';
import CityPreview from '../components/CityPreview';
import ContentPreview from '../components/ContentPreview';
import { CarouselWrapper } from '../components/CarouselWrapper';
import { colors, wp, viewportHeight, viewportWidth } from '../styles/index.style';
import api from '../api/index'

export default class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showSearchBar: false,
      refreshingPlaces: false,
      refreshingExperiences: false,
    };
    this.toggleSearch = this.toggleSearch.bind(this);
    this._onRefreshPlaces = this._onRefreshPlaces.bind(this);
    this._onRefreshExperiences = this._onRefreshExperiences.bind(this);
    this.loadContent = this.loadContent.bind(this);
  }

  componentDidMount() {
    this.loadContent();
    this.props.navigation.setParams({ toggleSearch: this.toggleSearch });
    this.props.navigation.setParams({ showSearchBar: false });
  }

  toggleSearch = () => {
    let { showSearchBar } = this.state;

    if (showSearchBar) this.searchBar.hide();
    else this.searchBar.show();
    this.props.navigation.setParams({ showSearchBar: !showSearchBar });
    this.setState({showSearchBar: !showSearchBar});
  }

  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;
    return {
      title: "Odyssey",
      headerBackTitle: 'Back',
      headerRight: (
        <Button transparent onPress={params.toggleSearch}>
          {Features.HomeScreen.searchBar && <Icon name="md-search"/>}
        </Button>
      ),
    }
  };

  _handleResults = () => {
    console.log(`handleResults ${this.searchBar.getValue()}`);
  }

  loadContent = () => {
    this._onRefreshPlaces();
    this._onRefreshExperiences();
  }

  _onRefreshExperiences = async () => {
    this.setState({refreshingExperiences: true});

    const experiences = await api.getFeaturedExperiences(true);
    this.setState({experiences});

    this.setState({refreshingExperiences: false});
  }

  _onRefreshPlaces = async () => {
    this.setState({refreshingPlaces: true});

    const featuredContent = await api.getFeaturedContent(true);
    this.setState({articles: featuredContent.articles, cities: featuredContent.cities});

    this.setState({refreshingPlaces: false});
  }

  render() {
    let { articles, cities, experiences, refreshingExperiences, refreshingPlaces } = this.state;
    return (
      <View style={styles.container}>
        {/* Search Bar */}
        <SearchBar
          ref={(ref) => this.searchBar = ref}
          data={cities}
          onSubmitEditing={this._handleResults}
          hideBack
          iOSPadding={false}
          onBlur={this.toggleSearch}
          keyboardAppearance="dark"
          autoCapitalize="words"
          placeholder="Search for a city or experience"
          fontSize={18}
        />
        <Container style={[styles.container, {backgroundColor: '#eee'}]}>
          <Tabs tabBarUnderlineStyle={{backgroundColor: '#383838'}}>
            <Tab heading={
                <TabHeading>
                  <Icon name="md-map" style={styles.tabIcon} />
                  <Text style={styles.tabText}>Places</Text>
                </TabHeading>
              }
            >
              <Content refreshControl={
                <RefreshControl
                  refreshing={refreshingPlaces}
                  onRefresh={this._onRefreshPlaces}
                />
              }>
                {/* Featured Content */}
                { cities &&
                  <View style={{paddingBottom: 10}}>
                    <H2 style={{ color: '#383838', fontWeight: '500', paddingVertical: 10, paddingTop: 20, textAlign: 'center', }}>Featured Cities</H2>
                    {cities.map((city) => {
                      return <CityPreview
                        key={city.experience_id}
                        img={city.img}
                        data={city}
                        city={city.city}
                        country={city.country}
                        onPress={this.props.navigation.navigate}
                      />
                    })}
                  </View>
                }
                { articles &&
                  <View style={styles.container}>
                    <CarouselWrapper data={articles} title="Eat, Drink, & Explore" isDark={false}
                      paginate={true} navigate={this.props.navigation.navigate}
                      subtitle="Articles featuring different activites and 'tours' in cities from around the world"/>
                  </View>
                }
                <View style={{padding: 16,}}>
                  <Text style={{color: '#787878', textAlign: 'center'}}>Thanks for using Odyssey!</Text>
                </View>
              </Content>
            </Tab>
            <Tab heading={
                <TabHeading>
                  <Icon name="md-compass" style={styles.tabIcon} />
                  <Text style={styles.tabText}>Experiences</Text>
                </TabHeading>
              }
            >
              <Content refreshControl={
                <RefreshControl
                  refreshing={refreshingExperiences}
                  onRefresh={this._onRefreshExperiences}
                />
              }>
              {/* TODO: Make this its own component something like ContentPreviewList or something */}
                {experiences && experiences.length > 0  && experiences.map((content) => {
                  return <ContentPreview
                    key={content.experience_id}
                    title={content.name}
                    city={content.city}
                    img={content.img}
                    name={content.name}
                    slot={content.slot}
                    category={content.category}
                    duration={content.duration}
                    id={content.experience_id}
                    description={content.description}
                    onPress={this.props.navigation.navigate}
                  />
                })}
                {(!experiences || experiences.length === 0) &&
                  <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                    <Text style={{padding: 20, textAlign: 'center', fontSize: 18}}>
                      We could not get featured experiences
                    </Text>
                    <Icon name="md-arrow-down" />
                    <Text style={{paddingHorizontal: 20, textAlign: 'center', fontSize: 18}}>
                      Please pull down to refresh
                    </Text>
                  </View>
                }
              </Content>
            </Tab>
          </Tabs>
        </Container>
      </View>
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
  majorIcon: {color: '#383838', fontSize: 55},
  containerDark: {
    flex: 1,
    backgroundColor: '#303844',
  },
  instaImage: {
    height: viewportHeight / 2,
    width: viewportWidth,
    marginTop: 10
  }
});
