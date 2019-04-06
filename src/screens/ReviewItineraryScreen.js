import React, { Component } from 'react';
import { Button, Container, Content, H1, H2, H3, View, Text } from 'native-base';
import { Alert, Platform, SafeAreaView, ScrollView, StatusBar, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { I18n } from 'aws-amplify';
import DateRangePicker from '../components/DateRangePicker';

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
  submit = () => {
    this.setState({loading: true});
    const { navigation } = this.props;
    const { steps } = navigation.state.params;
    let thankyouObj = {
      subtitle: 'We’re hard at work building your itinerary. We’ll send you a notification once we’re done.  In the meantime, check out our home screen.',
      title: 'Itinerary Processing',
      nextScreen: 'Concierge',
      buttonText: 'Back to Itineraries',
      refreshCache: true,
    }
    console.log('submitting new itinerary');
    // TODO: add api call here to send email to Dez and create an new itinerary in the db.
    //       before I get to creating an itinerary in the db I have to rework the security to be iam role-row specific.
    navigation.navigate('ThankYou', thankyouObj);
  }

  render() {
    const { steps, values } = this.props.navigation.state.params;
    return (
      <SafeAreaView style={styles.container}>
        <Container>
          <View style={{flex:1}}>
            <View style={{flex:10}}>
              <Content style={[styles.container]}>
                <Text style={styles.title}>Itinerary Summary</Text>
                {steps.map((step, index) =>
                  (index % 2 == 0)
                  ? <View key={'itin'+index} style={[styles.hrView, {flex:1, flexDirection:'row'}]}>
                      <Text style={styles.answer}>{step.message}</Text>
                      <TouchableOpacity onPress={this.edit}><Text style={{color:'#0099ff'}}>Edit</Text></TouchableOpacity>
                    </View>
                  : <Text key={'itin'+index} style={styles.question}>{step.message}</Text>)}
              </Content>
            </View>
            <View style={{flex: 0, padding: 4}}>
              <Button bordered success block onPress={this.submit}
                disabled={this.state.loading}>
                <Text>{I18n.get('Submit Itinerary')}</Text>
              </Button>
            </View>
          </View>
        </Container>
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
