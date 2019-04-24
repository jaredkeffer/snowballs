import React from 'react';
import { Image, StyleSheet, RefreshControl } from 'react-native';
import { H2, Content, Container, Button, Tab, Tabs, TabHeading, View, Text, Spinner, Icon } from 'native-base';

import { Analytics, Auth } from 'aws-amplify';
import SearchBar from 'react-native-searchbar'
import Features from '../util/features';
import ArticlePreview from '../components/ArticlePreview';
import { CarouselWrapper } from '../components/CarouselWrapper';
import { colors, wp, viewportHeight, viewportWidth } from '../styles/index.style';

const photos = [
  {subtitle: 'This is a subtitle for the ages about this city', title:'Venice, Italy', key:'15', source:'https://www.tours-italy.com/application/files/cache/319f9463c2e5b582dc9f00ac7a50b5d2.jpg'},
  {subtitle: 'This is a subtitle about this city aka Venice, Italy', title:'Tokyo, Japan', key:'13', source:'https://cdn.cnn.com/cnnnext/dam/assets/170606110126-tokyo-skyline.jpg'},
  {subtitle: 'This is an unbelievably simple and great subtitle for the ages about this city', title:'San Francisco, CA', key:'14', source:'https://www.sftravel.com/sites/sftraveldev.prod.acquia-sites.com/files/SanFrancisco_0.jpg'},
  {subtitle: 'This is an unbelievably simple and great subtitle for the ages about this city', title:'New York City, NY', key:'1', source:'https://cdn.shopify.com/s/files/1/1629/2509/products/1304_NYC_Skyline_2048x@2x.jpg?v=1488902880'},
];
const photos2 = {
  articles: [
    {subtitle: 'This is a subtitle for the ages about this city', title:'New York City, NY', key:'1', source:'https://cdn.shopify.com/s/files/1/1629/2509/products/1304_NYC_Skyline_2048x@2x.jpg?v=1488902880', experience_id: 'test-exp-2'},
    {subtitle: 'This is a subtitle about this city aka Venice, Italy', title:'Venice, Italy', key:'15', source:'https://www.tours-italy.com/application/files/cache/319f9463c2e5b582dc9f00ac7a50b5d2.jpg'},
    {subtitle: 'This is an unbelievably simple and great subtitle for the ages about this city, This is an unbelievably simple and great subtitle for the ages about this city', title:'Tokyo, Japan', key:'113', source:'https://cdn.cnn.com/cnnnext/dam/assets/170606110126-tokyo-skyline.jpg'},
    {subtitle: 'This is a very short subtitle', title:'San Juan Los Cabo, Mexico', key:'13', source:'http://www.ironman.com/~/media/25a5695f4228433bbd7fdc3763b80008/los%20cabos%2004.jpg?w=1600&h=980&c=1'},
  ]
};

export default class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showSearchBar: false,
      featuredContent: photos2,
      refreshing: false,
    };
    this.toggleSearch = this.toggleSearch.bind(this);
    this._onRefresh = this._onRefresh.bind(this);
  }

  componentDidMount() {
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

  _onRefresh = () => {
    this.setState({refreshing: true});
    setTimeout(() => {
      this.setState({refreshing: false});
    }, 300);
  }

  render() {
    let { featuredContent, refreshing } = this.state;

    return (
      <View style={styles.container}>
        {/* Search Bar */}
        <SearchBar
          ref={(ref) => this.searchBar = ref}
          data={photos}
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
                  refreshing={refreshing}
                  onRefresh={this._onRefresh}
                />
              }>
                {/* Featured Content */}
                {featuredContent &&
                  <View style={{paddingBottom: 10}}>
                    <H2 style={{ color: '#383838', fontWeight: '500', paddingVertical: 10, textAlign: 'center', fontStyle: 'italic'}}>Cities</H2>
                    {featuredContent.articles.map((content) => {
                      console.log(content);
                      return <ArticlePreview
                        key={content.key}
                        title={content.title}
                        img={content.source}
                        subtitle={content.subtitle}
                        content={content}
                        onPress={this.props.navigation.navigate}
                      />
                    })}
                  </View>
                }
                <View style={styles.container}>
                  <CarouselWrapper data={photos} title="Eat, Drink, & Explore" isDark={true}
                    paginate={true} navigate={this.props.navigation.navigate}/>
                </View>
                <View style={{padding: 16, backgroundColor: '#383838'}}>
                  <Text style={{color: '#787878', textAlign: 'center'}}>Thanks for using Odyssey!</Text>
                </View>
              </Content>
            </Tab>
            <Tab heading={
                <TabHeading>
                  <Icon name="ios-business" style={styles.tabIcon} />
                  <Text style={styles.tabText}>Experiences</Text>
                </TabHeading>
              }
            >
              {/* <View style={styles.container}>
              <CarouselWrapper data={photos2} title={'Featured Experiences'}
              paginate={true} navigate={this.props.navigation.navigate}/>
            </View> */}
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
