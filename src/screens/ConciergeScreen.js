import React from 'react';
import { Image, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { WebBrowser } from 'expo';

import { MonoText } from '../components/StyledText';
import { CarouselWrapper } from '../components/CarouselWrapper';

const photos = [
  {title:'New York City, NY', key:'1', source:'https://cdn.shopify.com/s/files/1/1629/2509/products/1304_NYC_Skyline_2048x@2x.jpg?v=1488902880'},
  {title:'Tokyo, Japan', key:'13', source:'https://cdn.cnn.com/cnnnext/dam/assets/170606110126-tokyo-skyline.jpg'},
  {title:'San Francisco, CA', key:'14', source:'https://www.sftravel.com/sites/sftraveldev.prod.acquia-sites.com/files/SanFrancisco_0.jpg'},
  {title:'Venice, Italy', key:'15', source:'https://www.tours-italy.com/application/files/cache/319f9463c2e5b582dc9f00ac7a50b5d2.jpg'}
];

export default class ConciergeScreen extends React.Component {
  static navigationOptions = {
    title: "Home"
  };

  render() {
    return (
      <View style={styles.container}>
        <ScrollView style={styles.container}>
          <View style={styles.containerDark}>
            <CarouselWrapper data={photos} title={'Explore Popular Cities'}/>
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
