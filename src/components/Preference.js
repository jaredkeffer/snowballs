import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';

import Colors from '../constants/Colors';

export default class Preference extends React.PureComponent {

  _onPress = () => {
    this.props.onPressItem(this.props.id);
  };

  render() {
    const textColor = this.props.selected ? 'white' : '#383838';
    const bgColor = this.props.selected ? '#383838' : '#ddd';
    return (
      <TouchableOpacity onPress={this._onPress}>
        <View style={[styles.preferenceContainer, {backgroundColor:bgColor }]}>
          <Text style={[styles.preferenceText, {color: textColor}]}>{this.props.title}</Text>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  preferenceContainer: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 10,
    marginHorizontal: 4,
    borderColor: '#383838',
    borderWidth: 1,
    borderRadius: 10,
  },
  preferenceText: {
    fontSize: 18,
  }
});
