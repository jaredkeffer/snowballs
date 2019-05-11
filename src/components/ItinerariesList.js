import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { FlatList } from 'react-native';
import { Container, Content, ListItem, Thumbnail, Text, Left, Body, Right, View, Icon, } from 'native-base';
import LoadingSpinner from './LoadingSpinner';

export class EmptyScreen extends React.Component {
  render() {

    if (this.props.loading) return <LoadingSpinner />;

    return (
      <Content>
        <View>
          <Text note style={styles.textStyle}>
            Looks like you do not have any itineraries in this section yet.
          </Text>
          <Text note style={styles.textStyle}>
            Click the + button below to start creating one!
          </Text>
          <Text note style={styles.textStyle}>
            Or you can pull down to refresh your itineraries.
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
        ListEmptyComponent={<EmptyScreen loading={this.props.refreshing}/>}
      />
    );
  }
}
