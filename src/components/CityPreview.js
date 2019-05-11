import React from 'react';
import { TouchableOpacity, Image, ImageBackground } from 'react-native';
import { View, Footer, Thumbnail, Text, Card, CardItem, Body, Icon, Left, Right, Spinner } from 'native-base';
import {ParallaxImage} from 'react-native-snap-carousel';
import styles from '../styles/SliderEntry.style';
import api from '../api/index'

export default class CityPreview extends React.PureComponent {
  render() {
    const { img, city, country, data } = this.props;
    let title = title || (city && country) ? `${city}, ${country}` : city;
    return (
      <TouchableOpacity onPress={() => this.props.onPress('City', {data})}>
        <Card style={{flex: 1, height: 150}}>
          <ImageBackground source={{uri: img}} style={{height: '100%', flex: 1, alignItems: 'center', justifyContent: 'center', textAlign: 'center'}}>
            <Text
              style={{color: '#fff', fontSize: 32, fontWeight: '700'}}
              numberOfLines={3}
              ellipsizeMode='head'>
              {title}
            </Text>
          </ImageBackground>
        </Card>
      </TouchableOpacity>
    )
  }
}
