import React from 'react';
import Image from 'react-native';
import { View, Footer, Thumbnail, Text, Card, CardItem, Body, Icon, Left, Right, Spinner } from 'native-base';
import api from '../api/index'

export default class ArticlePreview extends React.PureComponent {
  render() {
    const { img, title, subtitle, content, dark } = this.props;

    const backgroundColor = (dark) ? '#383838' : '#fff';
    const color = (dark) ? '#fff' : '#383838';

    return (
      <Card style={{width: '100%',}}>
          <View>
            <CardItem button onPress={() => this.props.onPress('Experience', {content})} style={{backgroundColor, color}}>
              {img &&
                <Left style={{flex: 2}}>
                  <Thumbnail square large source={{uri: img}}/>
                </Left>
              }
              <Body style={{flex: 5, backgroundColor, color}}>
                <Text style={{fontSize: 16, fontWeight: '600', backgroundColor, color}}>{title}</Text>
                <Text style={{paddingVertical: 6, backgroundColor, color}}>{subtitle}</Text>
              </Body>
            </CardItem>
          </View>
      </Card>
    )
  }
}
