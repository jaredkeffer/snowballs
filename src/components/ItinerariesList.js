import React, { Component } from 'react';
import { FlatList } from 'react-native';
import { TouchableOpacity, Container, Content, List, ListItem, Thumbnail, Text, Left, Body, Right,
         Icon, Button, RefreshControl } from 'native-base';

export default class ItinerariesList extends Component {
  constructor(props) {
    super(props);

  }

  _refresh = () => {
    console.log('_refreshing from itin list component');
    this.props.onRefresh(true);
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
          {/* // TODO: add some color or symbols here to show itinerary status */}
          <Text note>Creation Status: {(rowData.status) ? rowData.status : 'In Progress'}</Text>
        </Body>
        <Right>
          <Icon type="FontAwesome" name='chevron-right' style={{fontSize: 16}}/>
        </Right>
      </ListItem>
    )
  }

  render() {
    return (
      <FlatList
        onRefresh={this._refresh}
        data={ this.props.data }
        onRefresh={this._refresh}
        refreshing={this.props.refreshing}
        renderItem={this.renderItem}
      />
    );
  }
}
