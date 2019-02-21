import React from 'react';
import { StyleSheet, Text, View, FlatList } from 'react-native';
import ItineraryRow from './ItineraryRow';

export default class ItinerariesList extends React.Component {
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

  render() {
    return (
      <View style={styles.container}>
        <FlatList
          data={ this.props.data }
          onRefresh={this._refresh}
          refreshing={this.state.refreshing}
          renderItem={({item}) =>
            <ItineraryRow onPress={this.props.onPress} title={item.title} image={item.img} />
          }
          />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  }
});
