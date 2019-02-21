import React from 'react';
import { SafeAreaView, Image, TouchableOpacity, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Button } from 'react-native-elements';
import { CarouselWrapper } from '../components/CarouselWrapper';
import DateTimePicker from 'react-native-modal-datetime-picker';
import Icon from 'react-native-vector-icons/Ionicons';
import { SearchBar } from 'react-native-elements';
import ItineraryAPI from '../api/itineraries';

import layout from '../constants/Layout';

export default class NewItineraryScreen extends React.Component {
  constructor(props) {
    super(props)
    const d = new Date();
    d.setHours(0,0,0,0);

    const tomorrow = this._getTomorrow(d);

    this.inputRefs = {};

    this.state = {
      today: d,
      chosenStartDate: d,
      chosenEndDate: tomorrow,
      isStartDateTimePickerVisible: false,
      isEndDateTimePickerVisible: false,
      going: false,
      destination: 'nyc',
      search: ''
    };

    this._showStartDateTimePicker = this._showStartDateTimePicker.bind(this);
    this._hideStartDateTimePicker = this._hideStartDateTimePicker.bind(this);

    this._showEndDateTimePicker = this._showEndDateTimePicker.bind(this);
    this._hideEndDateTimePicker = this._hideEndDateTimePicker.bind(this);

    this._handleDatePicked = this._handleDatePicked.bind(this);

    this._updateSearch = this._updateSearch.bind(this);
    this.go = this.go.bind(this);
  }

  static navigationOptions = {
    title: "Create Itinerary"
  };

  _getTomorrow = (date) => {
    const tomorrow = new Date(date);
    tomorrow.setDate(date.getDate() + 1);
    return tomorrow;
  }

  _showStartDateTimePicker = () => this.setState({ isStartDateTimePickerVisible: true });
  _hideStartDateTimePicker = () => this.setState({ isStartDateTimePickerVisible: false });

  _showEndDateTimePicker = () => this.setState({ isEndDateTimePickerVisible: true });
  _hideEndDateTimePicker = () => this.setState({ isEndDateTimePickerVisible: false });

  _handleDatePicked = (date, type) => {
    if (type === 'end') {
      this.setState({chosenEndDate: date});
      this._hideEndDateTimePicker();
    }
    else  {
      this.setState({chosenStartDate: date});
      if (date > this.state.chosenEndDate) {
        console.log();
        this.setState({chosenEndDate: this._getTomorrow(date)});
      }
      this._hideStartDateTimePicker();
    }
  };

  _updateSearch = search => {
    this.setState({ search });
  };

  go = async () => {
    this.setState({going: true});
    console.log('going!');
    let response = await ItineraryAPI.getNewItinerary(new Date('3/1/2019'), new Date('3/3/2019'), 'New York')
    console.log(response);
    this.setState({going: false});
  }

  render() {
    const { search, chosenStartDate, chosenEndDate,
      going, today, isStartDateTimePickerVisible, isEndDateTimePickerVisible } = this.state;

    return (
      <SafeAreaView style={styles.container}>
        <View style={[styles.container, {paddingTop: 12}]}>
          <ScrollView style={styles.container}>
            <View style={[styles.container, styles.paddedContainer]}>
              <Text style={styles.title}>Where to?</Text>
              <Text style={{fontSize:20, flex:1}}>New York City</Text>
            </View>
            <View style={[styles.container, styles.paddedContainer]}>
              <Text style={styles.title}>Dates</Text>
              <View style={styles.dateContainer}>
                <TouchableOpacity style={styles.date} onPress={this._showStartDateTimePicker}>
                  <Text style={styles.dateText}>{chosenStartDate.toDateString()}</Text>
                </TouchableOpacity>
                <Text style={{fontSize:20}}> - </Text>
                <TouchableOpacity style={styles.date} onPress={this._showEndDateTimePicker}>
                  <Text style={styles.dateText}>{chosenEndDate.toDateString()}</Text>
                </TouchableOpacity>
              </View>
            </View>
            <DateTimePicker
            mode="datetime"
            isVisible={isEndDateTimePickerVisible}
            onConfirm={(date) => this._handleDatePicked(date, 'end')}
            onCancel={this._hideEndDateTimePicker}
            date={chosenEndDate}
            minimumDate={chosenStartDate}/>
            <DateTimePicker
            mode="datetime"
            isVisible={isStartDateTimePickerVisible}
            onConfirm={(date) => this._handleDatePicked(date)}
            onCancel={this._hideStartDateTimePicker}
            date={chosenStartDate}
            minimumDate={today}/>
          </ScrollView>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  actionButtonIcon: {
    fontSize: 20,
    height: 22,
    color: 'white',
  },
  title: {
    paddingHorizontal: 5,
    fontSize: 28,
  },
  date: {
    flex:1,
    paddingVertical: 10,
    fontSize: 20,
    borderColor: '#ccc',
    borderWidth: 2,
    borderRadius: 10,
  },
  dateText: {
    paddingHorizontal: 6,
  },
  dateContainer: {
    flex:1,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  paddedContainer: {
    paddingHorizontal: 10,
  },
  pickerBtn: {
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: '#4388d6',
    width: layout.window.width / 2.5,
  },
  goBtnContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  goBtn: {
    paddingVertical: 18,
    borderRadius: 10,
    backgroundColor: 'transparent',
    borderWidth: 10,
    borderColor: '#4388d6',
    width: layout.window.width / 1.5,
  },
  inputIOS: {
    fontSize: 16,
    paddingTop: 13,
    paddingHorizontal: 10,
    paddingBottom: 12,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    backgroundColor: 'white',
    color: 'black',
  },
});