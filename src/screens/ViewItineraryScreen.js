import React from 'react';
import ActionButton from 'react-native-action-button';
import { SafeAreaView, RefreshControl, StyleSheet, Modal, Image } from 'react-native';
import { H1, Container, Content, View, Text, Toast, Card, CardItem, Body, Icon, Right, Button, Textarea, Form } from 'native-base';
import LoadingSpinner from '../components/LoadingSpinner';
import HeaderImageScrollView, { TriggeringView } from 'react-native-image-header-scroll-view';

import * as Animatable from 'react-native-animatable';
import Tooltip from 'react-native-walkthrough-tooltip';

import MetaExperienceView from '../components/MetaExperienceView';
import api from '../api';

import layout from '../constants/Layout';
import { PENDING_APPROVAL, FEEDBACK_SUBMITTED } from '../util/Status';

const TOOLTIP_DELAY = 500;

export default class ViewItineraryScreen extends React.Component {

  constructor(props) {
    super(props);
    const { navigation, status } = this.props;
    this.refreshCache = (navigation.state.params)
      ? navigation.state.params.refreshCache
      : false;

    this.state = {
      refreshing: true,
      itinerary: (navigation.state.params)
        ? navigation.state.params.itinerary
        : {},
      modalVisible: false,
    }
    this._showTooltip();
  }

  static navigationOptions = ({ navigation }) => {
    return {
      title: (navigation.state.params.itinerary.title)
        ? navigation.state.params.itinerary.title
        : 'Itinerary',

    };
  };

  _showTooltip = () => {
    setTimeout(() => this.setState({confirmToolTipVisible: true}), TOOLTIP_DELAY);
  }

  toggleDay = (day, index) => {
    let { itinerary } = this.state;
    day.show = !day.show;
    itinerary.days[index] = day;

    this.setState({ itinerary });
  }

  _loadData = async (id, refreshCache) => {
    console.log('loading view itinerary data aka experiences');
    this.setState({loading: true});

    let itinerary = await api.getItinerary(refreshCache, id);

    this.setState({itinerary});
    this.setState({loading: false});
  }

  _onRefresh = () => {
    this.setState({hasRefreshed: true});
    let id = (this.props.navigation.state.params.itinerary.itinerary_id)
    this._loadData(id, true);
  }

  approve = () => {
    const { itinerary: { itinerary_id, dayCount } } = this.state;
    console.log('approving itinerary ', itinerary_id);

    let result = api.setItineraryStatus(itinerary_id);
    if (result && !result.error) {
      this.props.navigation.navigate('Feedback', {itinerary_id, dayCount});
    }
  }

  fix = () => {
    this.setState({modalVisible: true});
  }

  clearFeedbackText = () => {
    this.setState({feedbackText: ''});
  }

  setModalVisible = (modalVisible) => {
    if (!modalVisible) this.clearFeedbackText();
    this.setState({modalVisible});
  }

  submitHammerFeedback = async () => {
    const { itinerary: { feedback, itinerary_id }, feedbackText } = this.state;
    let now = (new Date()).getTime();
    let response = await api.submitItineraryFeedback(itinerary_id, {current: feedbackText, timestamp: now});
    if (response && !response.error) {
      this.setModalVisible(!this.state.modalVisible);
      this.clearFeedbackText();
      Toast.show({
        text: "Your feedback was submitted. We'll notify you when an update is ready!",
        buttonText: 'Close',
        duration: 10000,
        type: 'info',
      });
      let responseStatus = await api.setItineraryStatus(itinerary_id, FEEDBACK_SUBMITTED);
      this._loadData(itinerary_id, true);
    }
  }

  modal = () => (
    <Modal
      animationType="slide"
      transparent={false}
      visible={this.state.modalVisible}
    >
      <SafeAreaView style={{flex:1}}>
      <Container>
        <Content>
          <View style={{flex:1, flexDirection: 'row', padding: 8, marginTop: 10}}>
            <View style={{flex:1, justifyContent:'center'}}>
              <Image style={{resizeMode:'contain', width: 45, height: 45}} source={require('../assets/images/icon.png')}/>
            </View>
            <View style={{flex:6, justifyContent:'center'}}>
              <H1 style={{textAlign: 'center'}}>Submit Itinerary Feedback</H1>
            </View>
          </View>

          <Form style={{padding:10, marginTop:30}}>
            <Textarea
              bordered
              rowSpan={5}
              value={this.state.feedbackText}
              placeholder='Ask questions about or give feedback on your itinerary here'
              keyboardAppearance="dark"
              onChangeText={(feedbackText) => this.setState({feedbackText})}
            />
            <View style={{flex:1, flexDirection: 'row', marginTop: 12}}>
              <View style={{flex:1, padding: 4}}>
                <Button dark bordered block
                  onPress={() => this.setModalVisible(false)}>
                  <Text>Cancel</Text>
                </Button>
              </View>
              <View style={{flex:2, padding: 4}}>
                <Button success bordered block
                  onPress={this.submitHammerFeedback}>
                  <Text>Submit Feedback</Text>
                </Button>
              </View>
            </View>
          </Form>
        </Content>
      </Container>
      </SafeAreaView>
    </Modal>
  );

  render() {
    let { itinerary, loading, hasRefreshed } = this.state;

    if (!itinerary) return <LoadingSpinner color="#ccc" style={{marginTop: 20}} />

    let {img, title, days, dates, overview, status} = itinerary;
    let start = new Date(dates.start)
        end = new Date(dates.end);
    // TODO: add menu to undo approval of itinerary? and edit things like dates etc.
    return (
      <View style={{flex: 1}}>
      {this.modal()}
      <HeaderImageScrollView
        maxHeight={150}
        minHeight={50}
        headerImage={{uri: img}}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={this._onRefresh}
          />
        }
        fadeOutForeground
        renderForeground={() => (
          <View style={{ height: 150, justifyContent: 'center', alignItems: 'center', }} >
            <Text style={{color: 'white', fontSize: 34, fontWeight: '600'}}>
              {title}
            </Text>
            <Text style={{color: 'white', fontSize: 24, fontWeight: '500'}}>
              {start.toLocaleDateString()} - {end.toLocaleDateString()}
            </Text>
          </View>
        )}
        renderFixedForeground={() => (
          <Animatable.View
            style={{opacity: 0, paddingTop: 16,}}
            ref={navTitleView => {
              this.navTitleView = navTitleView;
          }}>
            <Text style={{color: 'white', fontSize: 20, fontWeight: '300', textAlign: 'center',}}>
              {start.toLocaleDateString()} - {end.toLocaleDateString()}
            </Text>
          </Animatable.View>
      )}>
        <TriggeringView
          onBeginHidden={() => this.navTitleView.fadeIn(200)}
          onDisplay={() => this.navTitleView.fadeOut(100)}
        >
        {loading && <LoadingSpinner color="#383838" />}
        {/* Itinerary Overview */}
        {!loading && overview && <Card transparent>
          <CardItem header style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text>Overview</Text>
            {status && <Text style={{color: '#383838'}}>{status}</Text>}
          </CardItem>
          <CardItem>
            <Body>
              <Text style={{lineHeight:22}}>{overview}</Text>
            </Body>
          </CardItem>
        </Card>}
        {/* Days: Apple Wallet Inspired */}
        { !loading && days && days.map((day, index) => {
          return (
            <Card key={day.day}>
              <CardItem button onPress={() => this.toggleDay(day, index)} style={{backgroundColor: '#f8f8f8',}}>
                <Body style={{justifyContent: 'center', flex: 1, flexDirection: 'row', paddingVertical: 2, }}>
                  <Text>Day {day.day + 1} :</Text><Text style={{color: '#383838'}}> {day.date}</Text>
                </Body>
                <Right>
                  <Icon style={{color: '#bbb'}} name={(day.show) ? 'md-close' : 'ios-arrow-down'}/>
                </Right>
              </CardItem>
              { day.show && day.description &&
                <CardItem>
                  <Text>{day.description}</Text>
                </CardItem>}
              { day.show &&
                <CardItem>
                  <Body>
                    {day.experiences.map((exp, index) =>
                      <MetaExperienceView
                        key={`${exp}-${index}`}
                        experienceId={exp}
                        refreshCache={hasRefreshed}
                        onPress={this.props.navigation.navigate} />)}
                  </Body>
                </CardItem>
              }
           </Card>
          )
        })}

        {!loading && !days &&
          <Card>
            <CardItem>
              <Text style={{lineHeight:22}}>
                We couldn't find any experiences for this itinerary. It looks like it might still be in the creation process. We'll send you a notification when it is ready!
              </Text>
            </CardItem>
          </Card>
        }
      </TriggeringView>
      </HeaderImageScrollView>
      {!loading && (itinerary.status === PENDING_APPROVAL) &&
        <View>
          <Tooltip
            animated
            placement="bottom"
            childlessPlacementPadding={35}
            isVisible={this.state.confirmToolTipVisible}
            content={
              <Text style={{width: 300, textAlign: 'center'}}>
                Press the <Icon name="ios-checkmark" style={{paddingHorizontal: 6, color: '#5cb85c', fontWeight:'900'}} /> after looking over your itinerary to confirm it is what you were hoping for!
              </Text>}
            onClose={() => this.setState({ confirmToolTipVisible: false, feedbackToolTipVisible: true })}
          />
          <Tooltip
            animated
            placement="bottom"
            childlessPlacementPadding={35}
            isVisible={this.state.feedbackToolTipVisible}
            content={
              <Text style={{width: 300, textAlign: 'center'}}>
                Press the <Icon name="md-hammer" style={{paddingHorizontal: 6, color: '#428bca', fontWeight:'900'}} /> if you want something changed or want to ask a question about it!
              </Text>}
            onClose={() => this.setState({ feedbackToolTipVisible: false })}
          />
        </View>
      }
      {!loading && (itinerary.status === PENDING_APPROVAL) &&
        <ActionButton
          position="right"
          onPress={this.approve}
          renderIcon={() => <Icon name="ios-checkmark" style={{fontSize: 54, fontWeight: 'bold', color: '#fff'}}/>}
          buttonColor="#5cb85c"
        />
      }
      {!loading && (itinerary.status === PENDING_APPROVAL) &&
        <ActionButton
          position="left"
          onPress={this.fix}
          renderIcon={() => <Icon name="md-hammer" style={{fontSize: 34, fontWeight: 'bold', color: '#fff'}}/>}
          buttonColor="#428bca"
        />
      }
      </View>
    );
  }
}
