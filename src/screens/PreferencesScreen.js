import React from 'react';
import { Button } from 'react-native-elements';
import { Cache } from 'aws-amplify';
import { ActivityIndicator, View, SafeAreaView, ScrollView, StyleSheet, Text, FlatList } from 'react-native';
import layout from '../constants/Layout';
import Preference from '../components/Preference';
import UserAPI from '../api/user';

export default class PreferencesScreen extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      selected: (new Map()),
      saved: false,
      saveDisabled: true,
    };
    this._setSelected();
  }

  preferenceWordList = [
    {id: 'Local', key:'Local'},
    {id: 'Comedy', key:'Comedy'},
    {id: 'Nightlife', key:'Nightlife'},
    {id: 'Dance', key:'Dance'},
    {id: 'Arts', key:'Arts'},
    {id: 'Food', key:'Food'},
    {id: 'Cultural', key:'Cultural'},
    {id: 'Academic', key:'Academic'},
    {id: 'Natural', key:'Natural'},
    {id: 'Culinary', key:'Culinary'},
    {id: 'Historical', key:'Historical'},
  ];

  _setSelected = async () => {
    let userInfo = await UserAPI.getUserInfo();
    let preferences = (userInfo && userInfo[0] && userInfo[0].preferences && userInfo[0].preferences)
      ? userInfo[0].preferences
      : false;
    if (preferences) {
      let preferencesMap = new Map();
      for (let key in preferences){
        if (preferences[key]) preferencesMap.set(key, preferences[key]);
      }
      let selected = new Map([...preferencesMap, ...this.state.selected]);
      this.setState({selected});
    }
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

  async save() {
    // start the spinner in the save btn
    this.setState({saving: true});

    // get the current user preferences
    let userId = await UserAPI.getUser();
    let preferences = {};

    // add the state preferences if changed
    this.state.selected.forEach((value, key) => {
      if(value) preferences[key] = value;
      // else delete preferences[key];
    });

    UserAPI.putUserInfo(userId.sub, preferences).then((response) => {
      this.setState({saved: true}, () => {
        const {goBack} = this.props.navigation;
        setTimeout(() => goBack(), 1300);
      });
    }).catch((error) => {
      console.log(preferences);
      console.log(error);
      alert('There was an error saving your preferences. You can update them anytime in the Settings tab.')
      const {goBack} = this.props.navigation;
      goBack();
    })
  }

  render() {
    let hidePrefsView = (this.state.saved) ? {'display': 'none'} : {};
    let showThanks = (this.state.saved) ? {} : {'display': 'none'};
    return (
      <SafeAreaView style={styles.container}>
        <View style={[styles.container, showThanks, styles.thanksContainer]}>
          <Text style={styles.thanks}>Your preferences have been saved!</Text>
        </View>
        <ScrollView style={[styles.container, hidePrefsView]}>
          <View style={[styles.container, {marginBottom:5}]}>
            <Text style={styles.title}>
              Select the types of experiences you enjoy...
            </Text>
            <FlatList horizontal={false} numColumns={3}
              contentContainerStyle={{alignItems:'center',}}
              data={this.preferenceWordList}
              extraData={this.state}
              keyExtractor={this._keyExtractor}
              renderItem={this._renderItem}
            />
          </View>
        </ScrollView>
        <View style={[styles.btnContainer, hidePrefsView]}>
          <Button onPress={() => this.save()} title="Save Preferences"
            disabled={this.state.saveDisabled} loading={this.state.saving}
            buttonStyle={[styles.saveBtn]}/>
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
  thanksContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    fontSize: 32,
    padding: 10,
  },
  contentContainer: {
    flex: 1,
    flexWrap: 'wrap',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingTop: 10,
  },
  btnContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    justifyContent: 'center'
  },
  saveBtn: {
    paddingVertical: 18,
    borderRadius: 10,
    backgroundColor: '#4388d6',
    width: layout.window.width / 1.5,
  },
  thanks: {
    color: 'green',
    fontSize: 28,
    padding: 20,
  }
});
