import React, { Component } from 'react';
import { FlatList } from 'react-native';
import { TouchableOpacity, Container, Content, List, ListItem, Thumbnail, Text, Left, Body, Right,
         Icon, Button, RefreshControl } from 'native-base';

export default class ItinerariesList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      refreshing: false,
    };
  }

  _refresh = () => {
    console.log('refreshing');
    this.setState({refreshing:true});
    setTimeout( () => {
      this.setState({refreshing:false});
    },1500);
  }

  renderItem = (item) => {
    let rowData = item.item;
    let start = new Date(rowData.dates.start).toLocaleDateString();
    let end = new Date(rowData.dates.end).toLocaleDateString();
    return (
      <ListItem thumbnail onPress={() => this.props.onPressItem(rowData)}>
        <Left>
          <Thumbnail square source={ {uri: rowData.img} } />
        </Left>
        <Body>
          <Text>{rowData.title}</Text>
          <Text note numberOfLines={3}>{`${start} - ${end}`}</Text>
        </Body>
        <Right>
          <Icon type="FontAwesome" name='chevron-right' style={{fontSize: 16}}/>
        </Right>
      </ListItem>
    )
  }
// TODO: add this pull to refresh thing somehow
// onRefresh={this._refresh} refreshing={this.state.refreshing}
  render() {
    return (
        <Content >
            <FlatList
              data={ this.props.data }
              onRefresh={this._refresh}
              refreshing={this.state.refreshing}
              renderItem={this.renderItem}
            />
        </Content>
    );
  }
}
