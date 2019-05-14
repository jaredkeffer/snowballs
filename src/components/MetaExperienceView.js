import React from 'react';
import Image from 'react-native';
import { View, Footer, Thumbnail, Text, Card, CardItem, Body, Icon, Left, Right, Spinner } from 'native-base';
import api from '../api/index'
export default class MetaExperienceView extends React.PureComponent {

  constructor(props) {
    super(props);
    const { experienceId } = props;

    this.state = {
      loading: true,
    }
  }
  componentDidMount() {
    this._loadExperience(this.props.experienceId);
  }
  // TODO: componentWillUnmount when you close before done loading

  _loadExperience = async (experienceId, refreshCache) => {
    let experience = await api.getExperienceDetails(experienceId, refreshCache || this.props.refreshCache);

    this.setState({loading: false});
    this.setState({experience: experience});
    return experience;
  }

  render() {
    const { experience, loading } = this.state;

    return (
      <Card  style={{width: '100%',}}>
        {loading && <Spinner color="#ccc"/>}
        {!loading && experience &&
          <View>
            {/* TODO look into adding metadata for experience saved in itinerary because ill want to know what slot the experience fills / what it was intended for */}
            <CardItem button onPress={() => this.props.onPress('Experience', {experienceId: this.props.experienceId})}>
              {experience.img &&
                <Left style={{flex: 2}}>
                  <Thumbnail square large source={{uri: experience.img}}/>
                </Left>
              }
              <Body style={{flex: 5}}>
                <Text style={{fontWeight: 'bold'}}>{experience.name}</Text>
                <Text>{experience.slot}</Text>
                <Text style={{color:'#bbb'}}>Duration: {experience.duration} hr(s)</Text>
                <Text>
                  {experience.category && experience.category.map((type) =>
                    <Text key={type} style={{color: '#bbb'}}>{type} </Text>)}
                </Text>
              </Body>
            </CardItem>
          </View>}
      </Card>
    )
  }
}
