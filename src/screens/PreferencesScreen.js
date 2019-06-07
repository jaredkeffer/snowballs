import React from 'react';
import { Cache } from 'aws-amplify';
import { Button, H1, H2, H3 } from 'native-base';
import { ActivityIndicator, ImageBackground, View, SafeAreaView, ScrollView, StyleSheet, Text, FlatList } from 'react-native';
import layout from '../constants/Layout';
import LoadingSpinner from '../components/LoadingSpinner';
import Preference from '../components/Preference';
import api from '../api';

export default class PreferencesScreen extends React.PureComponent {
  constructor(props) {
    super(props)
    this.bgImage = require('../assets/images/canal-venice-gondola.jpg');
    this.state = {
      selected: (new Map()),
      saved: false,
      saveDisabled: true,
      pageIndex: 0,
      loading: true,
    };
    this._loadData();
  }

  _loadData = async () => {
    let userPreferences = await api.getUserPreferences();
    let preferences = (userPreferences && Object.keys(userPreferences).length )
      ? userPreferences.preferences
      : false;
    if (preferences) {
      let preferencesMap = new Map();
      for (let key in preferences){
        if (preferences[key]) preferencesMap.set(key, preferences[key]);
      }
      let selected = new Map([...preferencesMap, ...this.state.selected]);
      this.setState({selected});
      this.setState({saveDisabled: false});
    }
    const preferenceQuestions = await api.getPreferenceQuestions();
    this.setState({loading: false, preferenceQuestions});
  }

  static navigationOptions = {
    title: "Preferences"
  };

  _toggleSaveBtnDisabled = () => {
    let saveDisabled = [...this.state.selected.values()].every((x) => x === false);
    this.setState({saveDisabled: saveDisabled});
  }

  _keyExtractor = (item, index) => item.id;

  _onPressItem = (id: string) => {
    this.setState((state) => {
      const selected = new Map(state.selected);
      selected.set(id, !selected.get(id));
      return {selected};
    }, this._toggleSaveBtnDisabled);
  };

  _renderItem = ({item}) => (
    <Preference
      id={item.id}
      onPressItem={this._onPressItem}
      selected={!!this.state.selected.get(item.id)}
      title={item.id}
    />
  );

  createQuestion = (item) => {
    return (
      <View style={[styles.container, {marginBottom:5, paddingHorizontal: 10}]}>
        <View style={{flex: 1, alignItems: 'center'}}>
          <H1>{item.question}</H1>
          {item.subtitle && <Text style={{fontSize: 16, color: '#383838'}}>{item.subtitle}</Text>}
        </View>
        <FlatList horizontal={false} numColumns={(item.columns) ? item.columns : 3}
          data={item.options}
          contentContainerStyle={{alignItems:'center',}}
          extraData={this.state}
          keyExtractor={this._keyExtractor}
          renderItem={this._renderItem}
          key={item.question}
        />
      </View>
    );
  }

  nextOrSave = () => {
    const { pageIndex, preferenceQuestions } = this.state;
    if (pageIndex === preferenceQuestions.length -1) return this.save();
    else return this.setState({pageIndex: pageIndex + 1});
  }

  async save() {
    // start the spinner in the save btn
    this.setState({saving: true});

    let preferences = {};

    // add the state preferences if changed
    this.state.selected.forEach((value, key) => {
      if(value) preferences[key] = value;
      // else delete preferences[key];
    });

    api.putUserPreferences(preferences).then((response) => {
      this.setState({saved: true}, () => {
        // const {goBack} = this.props.navigation;
        // setTimeout(() => goBack(), 1300);
        const { navigate } = this.props.navigation;
        let thankyouObj = {
          subtitle: 'Hey you! Yeah you!\n\nYou’ve successfully completed your profile.\n\nWhen you’re ready click next so we can begin to create a personalized itinerary for you.',
          title: 'Thank You!',
          nextScreen: 'CreateItinerary',
          screenOptions: {allowSkip: true},
        }
        navigate('ThankYou', thankyouObj);
      });
    }).catch((error) => {
      console.log(preferences);
      console.error(error);
      alert('There was an error saving your preferences. You can update them anytime in the Settings tab.')
      const {goBack} = this.props.navigation;
      goBack();
    })
  }

  render() {
    const { loading, pageIndex, saveDisabled, preferenceQuestions } = this.state;
    if (loading) return <LoadingSpinner />;
    return (
      <ImageBackground
        source={this.bgImage}
        style={{width: '100%', height: '100%'}}
        imageStyle={{opacity: 0.35}}
      >
        <SafeAreaView style={styles.container}>
          <ScrollView style={[styles.container, {paddingTop: 30}]}>
            {this.createQuestion(preferenceQuestions[pageIndex])}
          </ScrollView>
          <View>
            <View style={[styles.btnContainer]}>
              {(pageIndex > 0) &&
                <Button block
                  onPress={() => this.setState({pageIndex: pageIndex - 1})}
                  style={[{backgroundColor: '#383838'}, styles.saveBtn]}
                >
                  <Text style={{color: 'white', fontSize: 18,}}>Back</Text>
                </Button>
              }
              <Button block
                onPress={this.nextOrSave}
                disabled={saveDisabled}
                style={[(saveDisabled) ? {backgroundColor: '#ccc'} : {backgroundColor: '#383838'}, styles.saveBtn]}
              >
                <Text style={[(saveDisabled) ? {} : {color: 'white'}, {fontSize: 18,}]}>{(pageIndex === preferenceQuestions.length - 1) ? 'Finish' : 'Next'}</Text>
              </Button>
            </View>
            <View style={{flex: 1, flexDirection: 'row', height: 20, marginBottom: 36,}}>
              {preferenceQuestions.map((item, index) => {
                let styleProgressView = (pageIndex >= index) ? styles.progressFull : styles.progressEmpty;
                return <View key={index} style={styleProgressView}/>;
              })}
            </View>
          </View>
        </SafeAreaView>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  progressFull: {backgroundColor: 'white', borderRadius: 10, flex: 1,height: 20, margin: 10, marginHorizontal: 20},
  progressEmpty: {borderColor: 'white', borderRadius: 10, borderWidth: 2, flex: 1,height: 20, margin: 10, marginHorizontal: 20},
  title: {
    fontSize: 32,
    padding: 10,
  },
  saveBtn: {
    flex: 1,
    marginHorizontal: 20,
    borderColor: '#383838',
    borderWidth: 1,
    borderRadius: 10,
  },
  btnContainer: {
    alignItems: 'center',
    flexDirection: 'row'
  },
  thanks: {
    color: '#383838',
    padding: 20,
  }
});
