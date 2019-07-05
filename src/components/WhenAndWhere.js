import React, { Component } from 'react';
import { Button, ScrollView, StyleSheet, TextInput, Text, TouchableOpacity, View } from 'react-native';
import { Cache } from 'aws-amplify';
import DateRangePicker from './DateRangePicker';
import layout from '../constants/Layout';

const XDate = require('xdate');
const oneWeek =  (6.048 * (10 ** 8)) * (5/7);

export default class WhenAndWhere extends Component {
  constructor(props){
    super(props)
    this.state = {
      start: this.today,
      end: this.nextWeek
    };
  }

  dateChange = (start, end) => {
    this.setState({start, end});
  }

  doneSelecting = () => {
    const { start, end } = this.state;
    console.log(start, end);
    const { step, triggerNextStep } = this.props;
    console.log('saving the dates');
    console.log('step', step);
    console.log('triggerNextStep', triggerNextStep);
    let trigger = String(Number(step.id) + 1);
    triggerNextStep({value: {start, end}, trigger});
  }

  today = new XDate();
  nextWeek = new XDate(this.today.getTime() + oneWeek);

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.whereWrapper}>
          <DateRangePicker
            initialRange={[this.today.toString('yyyy-MM-dd'), this.nextWeek.toString('yyyy-MM-dd')]}
            onSuccess={(s, e) => this.dateChange(s,e)}
            style={styles.calendar}
            height={layout.window.height / 1.5}
            width={layout.window.width}
          />
        </View>
        <Button onPress={this.doneSelecting} title="Done"/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  whereWrapper: {
    alignSelf: 'stretch',
    padding: 8,
  },
  input: {
    alignSelf: 'stretch',
    borderWidth: 1,
    borderRadius: 6,
    padding: 8,
    fontSize: 22,
  },
  question: {
    padding: 8,
    fontSize: 22,
    color: '#ccc'
  },
});
