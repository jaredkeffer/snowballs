import React, { Component } from 'react';
import { Button, Container, Content, H1, H2, H3, View, Text, Card, CardItem, Textarea } from 'native-base';
import { Alert, SafeAreaView, StatusBar, StyleSheet, TouchableOpacity, Keyboard } from 'react-native';
import { I18n } from 'aws-amplify';
import DateRangePicker from '../components/DateRangePicker';
import Questions from '../constants/Questions';
import api from '../api/index';

import layout from '../constants/Layout';

export default class CreateItineraryScreen extends Component {

  constructor(props){
    super(props);
    const { steps, values } = this.props.navigation.state.params;
    this.state = {};
    steps.forEach(val => { this.state[val.id] = val.value });
  }

  static navigationOptions = {
    title: "Review Itinerary",
  };

  submit = async () => {
    this.setState({loading: true});
    const { navigation } = this.props;
    let thankyouObj = {
      subtitle: 'We’re hard at work building your itinerary. We’ll send you a notification once we’re done.  In the meantime, check out our home screen.',
      title: 'Itinerary Processing',
      nextScreen: 'Concierge',
      buttonText: 'Back to Itineraries',
      refreshCache: true,
    }
    console.log('submitting new itinerary');
    const { steps } = navigation.state.params;
    let qAndA = {};
    steps.forEach(val => { qAndA[val.id] = this.state[val.id] || steps.message });
    const response = await api.createNewItinerary(qAndA).catch(error => {
      console.log(error);
    });
    if (response.error) {
      this.setState({loading: false});
    } else {
      navigation.navigate('ThankYou', thankyouObj);
    }
  }

  textChange = (text, step) => {
    this.setState({[step]: text});
  }

  render() {
    const { steps } = this.props.navigation.state.params;
    return (
      <SafeAreaView style={styles.container}>
        <Container>
          <View style={{flex:1}}>
            <View style={{flex:10}}>
              <Content style={[styles.container]}>
                <Text style={styles.title}>Itinerary Summary</Text>
                {steps.map((step, index) => {

                  const stepValueId = String(index);

                  if (index <= 1 && step.message.includes('Hi! Thanks for using Odyssey!')){
                    const splitUpMessage = step.message.split('\n');
                    step.message = splitUpMessage[splitUpMessage.length - 1];
                  }
                  if (index % 2 == 0) {
                    if (step.id === '4') {
                      // TODO: make this the date picker
                       return (
                         <Card key={'itin'+index}>
                           <CardItem>
                             <Text>{(new Date(step.value.start)).toLocaleDateString()} - {(new Date(step.value.end)).toLocaleDateString()}</Text>
                           </CardItem>
                         </Card>
                       );
                    }
                    return (
                      <Card key={'itin'+index}>
                        <CardItem>
                          <Textarea
                            style={{flex:1}}
                            bordered
                            keyboardAppearance="dark"
                            returnKeyType="done"
                            onSubmitEditing={() => Keyboard.dismiss()}
                            rowSpan={3}
                            value={this.state[stepValueId] || ''}
                            onChangeText={(text) => this.textChange(text, stepValueId)}
                          />
                        </CardItem>
                      </Card>
                    );
                  }
                  return (
                    <Card key={'itin'+index} transparent>
                      <CardItem header>
                        <Text>{step.message}</Text>
                      </CardItem>
                    </Card>
                  );
                })}
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
    padding: 10,
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
