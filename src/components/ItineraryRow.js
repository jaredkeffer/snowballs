import React from 'react';
import { TouchableOpacity, StyleSheet, Text, View } from 'react-native';

import layout from '../constants/Layout';

export default class ItineraryRow extends React.Component {
  render() {
    return (
      <View>
        <TouchableOpacity onPress={this.props.onPress}
          style={styles.row}>

          <Text>
            {this.props.title}
          </Text>

        </TouchableOpacity>
        {this.props.img}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  row: {
    paddingVertical: 14,
    paddingHorizontal: 10,
    width: layout.width,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  }
});
