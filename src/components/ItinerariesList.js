import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { FlatList } from 'react-native';
import { Container, Content, ListItem, Thumbnail, Text, Left, Body, Right, View, Icon, } from 'native-base';
import LoadingSpinner from './LoadingSpinner';

export class EmptyScreen extends React.PureComponent {
  render() {

    if (this.props.loading) return <LoadingSpinner />;

    return (
      <Content>
        <View>
          <Text style={styles.textStyle}>
            {this.props.msg || 'Looks like you don\'t have any itineraries yet.'}
          </Text>
          <Text style={styles.textStyle}>
            Try creating a new itinerary by pressing the <Icon name="md-add-circle" style={{fontSize: 24}}/> button below!
          </Text>
        </View>
      </Content>
    )
  }
}

const styles = StyleSheet.create({
  textStyle: {justifyContent: 'center', paddingHorizontal: 30, paddingVertical: 20, fontSize: 22, textAlign: 'center'},
});

export default class ItinerariesList extends Component {
  constructor(props) {
    super(props);

  }

  _refresh = () => {
    console.log('_refreshing from itin list component');
    this.props.onRefresh(true, true);
  }

  renderItem = (item) => {
    let rowData = {}, start, end;
    if (item.item && item.item.dates) {
      rowData = item.item;
      start = (new Date(rowData.dates.start)).toLocaleDateString();
      end = (new Date(rowData.dates.end)).toLocaleDateString();

      return (
        <ListItem thumbnail onPress={() => this.props.onPressItem(rowData)} key={item.index}>
          {rowData.img &&
            <Left>
              <Thumbnail square source={ {uri: rowData.img} } />
            </Left>
          }
          <Body>
            <Text>{rowData.title}</Text>
            <Text note numberOfLines={3}>{`${start} - ${end}`}</Text>
            {/* // TODO: add some color or symbols here to show itinerary status */}
            {start && end && <Text style={{color: '#606060'}}>Status: {(rowData.status) ? rowData.status : 'Processing Request'}</Text>}
          </Body>
          <Right>
            <Icon type="FontAwesome" name='chevron-right' style={{fontSize: 16}}/>
          </Right>
        </ListItem>
      )
    }
    else {
      rowData = item.item;
      rowData.title = rowData['2'] || 'New Itinerary Processing...';
      start = (rowData['4']) ? (new Date(rowData['4'].start)).toLocaleDateString() : null;
      end = (rowData['4']) ? (new Date(rowData['4'].end)).toLocaleDateString() : null;
      return (
        <ListItem key={item.index}>
          <Body>
            <Text>{rowData.title}</Text>
            <Text note numberOfLines={3}>{`${start} - ${end}`}</Text>
            {/* // TODO: add some color or symbols here to show itinerary status */}
            {start && end && <Text style={{color: '#606060'}}>Status: {(rowData.status) ? rowData.status : 'Processing Request'}</Text>}
          </Body>
        </ListItem>
      )
    }
    return (
      <ListItem thumbnail onPress={() => this.props.onPressItem(rowData)}>
        {rowData.img &&
          <Left>
            <Thumbnail square source={ {uri: rowData.img} } />
          </Left>
        }
        <Body>
          <Text>{rowData.title}</Text>
          <Text note numberOfLines={3}>{`${start} - ${end}`}</Text>
          {/* // TODO: add some color or symbols here to show itinerary status */}
          {start && end && <Text style={{color: '#606060'}}>Status: {(rowData.status) ? rowData.status : 'Processing Request'}</Text>}
        </Body>
        <Right>
          <Icon type="FontAwesome" name='chevron-right' style={{fontSize: 16}}/>
        </Right>
      </ListItem>
    )
  }
  _keyExtractor = (item, index) => item.itinerary_id || String(index);

  render() {
    return (
      <FlatList
        onRefresh={this._refresh}
        data={ this.props.data }
        onRefresh={this._refresh}
        refreshing={this.props.refreshing}
        renderItem={this.renderItem}
        keyExtractor={this._keyExtractor}
        ListEmptyComponent={<EmptyScreen loading={this.props.refreshing}/>}
      />
    );
  }
}
