import React from 'react';
import { SafeAreaView, TouchableOpacity, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';

import ActionButton from 'react-native-action-button';
import { CarouselWrapper } from '../components/CarouselWrapper';
// import Icon from 'react-native-vector-icons/Ionicons';
import ItinerariesList from '../components/ItinerariesList';
import ItineraryAPI from '../api/itineraries';

import layout from '../constants/Layout';

export default class ConciergeScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  static navigationOptions = {
    title: "Concierge"
  };

  _onPressItem = (itemId) => {
    console.log(itemId);
  };

  _newItineraryBtnPressed = () => {
    console.log(this.props.navigation.navigate('NewItinerary'));
  }

  data = [
    {img: 'hhtps://someurl.com', title:'NYC Itinerary', key: 'nyc_itin_1'},
    {img: 'hhtps://someurl.com', title:'Istanbul', key: 'Istanbul_itin_1'},
  ];

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.container}>
          {/*Do some cool logic here to show itineraries list based on hieght + other things*/}
          <ItinerariesList data={this.data} onPressItem={this._onPressItem} />
        </View>
        <ActionButton
          buttonColor="#00a820"
          onPress={this._newItineraryBtnPressed} />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  actionButtonIcon: {
    fontSize: 20,
    height: 22,
    color: 'white',
  },
});
