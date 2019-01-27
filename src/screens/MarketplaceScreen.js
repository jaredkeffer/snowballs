import React from 'react';
import { View, ScrollView, StyleSheet, Text } from 'react-native';

export default class MarketplaceScreen extends React.Component {
  static navigationOptions = {
    title: 'Marketplace',
  };

  render() {
    return (
      <View style={styles.container}>
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
          <Text>Page 2</Text>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    alignItems: 'center',
    paddingTop: 30,
  },
});
