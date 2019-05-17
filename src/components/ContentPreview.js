import React from 'react';
import Image from 'react-native';
import { View, Footer, Thumbnail, Text, Card, CardItem, Body, Icon, Left, Right, Spinner } from 'native-base';
import api from '../api/index'

export default class ContentPreview extends React.PureComponent {
  render() {
    const { img, title, description, name, slot, category, duration, id, dark, city } = this.props;
    const backgroundColor = (dark) ? '#383838' : '#fff';
    const color = (dark) ? '#fff' : '#383838';

    return (
      <Card style={{width: '100%',}}>
          <View>
            <CardItem button onPress={() => this.props.onPress('Experience', {experienceId: id})} style={{backgroundColor, color}}>
              {img &&
                <Left style={{flex: 2}}>
                  <Thumbnail square large source={{uri: img}}/>
                </Left>
              }
              <Body style={{flex: 5, backgroundColor, color}}>
                <Text style={{fontWeight: 'bold'}}>{name}</Text>
                <View style={{flex:1, flexDirection:'row', justifyContent: 'space-between'}}>
                  {city && <Text style={{color, flex:3}}>{city}</Text>}
                  <Text style={{color:'#787878', flex:1}}>{duration} hr(s)</Text>
                </View>
                {description && <Text style={{paddingVertical: 6, backgroundColor, color}} numberOfLines={3}>{description}</Text>}
                <Text>
                  {category && <Text style={{color: '#787878'}} numberOfLines={2}>#{category.join(' #').toLowerCase()}</Text>}
                  {/* {category && category.map((type) =>
                    <Text key={type} style={{color: '#bbb'}}>{category.join(', ')}</Text>)} */}
                </Text>
              </Body>
            </CardItem>
          </View>
      </Card>
    )
  }
}
