import React from 'react';
import { TouchableOpacity, ImageBackground } from 'react-native';
import { View, Footer, Thumbnail, Text, Card, CardItem, Body, Icon, Left, Right, Spinner } from 'native-base';
import {ParallaxImage} from 'react-native-snap-carousel';
import styles from '../styles/SliderEntry.style';
import api from '../api/index'

export default class CityOverview extends React.PureComponent {
  render() {
    const { overview, title, img } = this.props;
    const imgHeader = (
      <View style={{flex: 1, height: 150}}>
        <ImageBackground source={{uri: img}} style={{height: '100%', flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <Text style={{color: '#fff', fontSize: 32, fontWeight: '700'}}>{title}</Text>
        </ImageBackground>
      </View>
    )
    if (overview && typeof(overview) == 'object' && overview.length > 0) {
      return (
        <View>
          {imgHeader}
          <Card transparent>
            {overview.map((paragaph, i) => (
              <CardItem key={i}>
                <Text style={{lineHeight:22}}>{paragaph}</Text>
              </CardItem>
            ))}
          </Card>
        </View>
      );
    }
    return (
      <View>
        {imgHeader}
        <Card transparent>
          <CardItem>
            <Text style={{lineHeight:22}}>{overview}</Text>
          </CardItem>
        </Card>
      </View>
    );
  }
}
