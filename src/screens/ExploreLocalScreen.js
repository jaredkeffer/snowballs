import React from 'react';
import { View, ScrollView, StyleSheet, Text } from 'react-native';

export default class ExploreLocalScreen extends React.Component {
  static navigationOptions = {
    title: 'Explore',
  };

  render() {
    return (
      <View style={styles.container}>
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
          <View style={styles.LinksContainer}>
            <Text>Explore Local Tab</Text>
          </View>
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
  LinksContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  }
});
