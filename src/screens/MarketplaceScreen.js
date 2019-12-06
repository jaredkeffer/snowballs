import React from 'react';
import { ScrollView, StyleSheet, RefreshControl } from 'react-native';
import { H2, H3, Content, Container, Button, Tab, Tabs, TabHeading, View, Text, Spinner, Icon } from 'native-base';
import SearchBar from 'react-native-searchbar'
import Features from '../util/features';
import LoadingSpinner from '../components/LoadingSpinner';
import ContentPreview from '../components/ContentPreview';
import { CarouselWrapper } from '../components/CarouselWrapper';
import api from '../api/index'



export default class MarketplaceScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showSearchBar: true,
      refreshingExperiences: true,
    };
    this.toggleSearch = this.toggleSearch.bind(this);
    this._onRefreshExperiences = this._onRefreshExperiences.bind(this);
    this.loadContent = this.loadContent.bind(this);
  }
  componentDidMount() {
    this.loadContent();
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
      title: 'Marketplace',
      headerBackTitle: 'Back',
    }
  };

  loadContent = () => {
    this._onRefreshExperiences();
  }

  _onRefreshExperiences = async () => {
    this.setState({refreshingExperiences: true});

    const experiences = await api.getFeaturedExperiences(true);
    this.setState({experiences});

    this.setState({refreshingExperiences: false});
  }
  
  render() {
    let {cities, experiences, refreshingExperiences} = this.state;
    if (refreshingExperiences) return <LoadingSpinner />
    return (
      <View style={styles.container}>
        {/* Search Bar */}
        <SearchBar
              ref={(ref) => this.searchBar = ref}
              data={experiences}
              onSubmitEditing={this._handleResults}
              hideBack
              iOSPadding={false}
              onBlur={this.toggleSearch}
              keyboardAppearance="dark"
              autoCapitalize="words"
              placeholder="Search for a city or experience"
              fontSize={18}
            />
        <Content style={styles.refresh} refreshControl={
          <RefreshControl
            refreshing={refreshingExperiences}
            onRefresh={this._onRefreshExperiences}
          />
        }>
        {/* Marketplace Experiences */}
        {experiences && experiences.length > 0 &&
          <View>
            <CarouselWrapper data={experiences} title="Near you Now" isDark={false} paginate={true} navigate={this.props.navigation.navigate}>

            </CarouselWrapper>
            <CarouselWrapper data={experiences} title="Suggested for You" isDark={false} paginate={true} navigate={this.props.navigation.navigate}>

            </CarouselWrapper>
            <CarouselWrapper data={experiences} title="Sponsored" isDark={false} paginate={true} navigate={this.props.navigation.navigate}>

            </CarouselWrapper>
            <CarouselWrapper data={experiences} title="Out of the Blue" isDark={false} paginate={true} navigate={this.props.navigation.navigate}>

            </CarouselWrapper>
          </View>
        }
        </Content>
      </View>
      
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
  }, 
});
