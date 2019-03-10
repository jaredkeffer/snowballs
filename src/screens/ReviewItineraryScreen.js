import React, { Component } from 'react';
import { Alert, Platform, SafeAreaView, ScrollView, StatusBar, StyleSheet, TextInput, Text, TouchableOpacity, View } from 'react-native';
import DateRangePicker from '../components/DateRangePicker';
import Icon from 'react-native-vector-icons/Ionicons';

import layout from '../constants/Layout';

export default class CreateItineraryScreen extends Component {
  state = {};

  constructor(props){
    super(props)
  }

  static navigationOptions = {
    title: "Review Itinerary",
  };

  edit = (e) => {
    console.log(e);
    console.log('edit');
  }

  render() {
    const { steps, values } = this.props.navigation.state.params;
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.container}>
          <Text style={styles.title}>Summary</Text>
          {steps.map((step, index) =>
            (index % 2 == 0)
            ? <View><View key={'itin'+index} style={{flex:1, flexDirection:'row'}}>
                <Text style={styles.answer}>{step.message}</Text>
                <TouchableOpacity onPress={this.edit}><Text style={{color:'#0099ff'}}>Edit</Text></TouchableOpacity>
                <View style={styles.hrView}/></View>
              </View>
            : <Text key={'itin'+index} style={styles.question}>{step.message}</Text>)}
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 8,
    backgroundColor: '#fff',
    paddingTop: StatusBar.currentHeight,
  },
  title: {
    fontSize: 30,

  },
  answer: {
    padding: 12,
    fontSize: 16,
  },
  question: {
    marginTop: 8,
    fontSize: 16
  },
  hrView: {
    padding: 8,
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
  },
});
