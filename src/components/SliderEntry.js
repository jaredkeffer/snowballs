import React, {Component} from 'react';
import {View, Text, Image, TouchableOpacity} from 'react-native';
import PropTypes from 'prop-types';
import {ParallaxImage} from 'react-native-snap-carousel';
import styles from '../styles/SliderEntry.style';

export default class SliderEntry extends Component {

  static propTypes = {
    data: PropTypes.object.isRequired,
    even: PropTypes.bool,
    parallax: PropTypes.bool,
    parallaxProps: PropTypes.object
  };

  get image() {
    const {data: { img }, parallax, parallaxProps, even} = this.props;

    return parallax
      ? (<ParallaxImage source={{uri: img}}
        // if you want to do every other styling
        // containerStyle={[styles.imageContainer, even ? styles.imageContainerEven: {}]}
        containerStyle={[styles.imageContainer]}
        style={styles.image} parallaxFactor={0.35} showSpinner={true}
        spinnerColor={even ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.25)'}
        {...parallaxProps}/>)
      : (<Image source={{ uri: img }} style={styles.image}/>);
  }

  goToExperienceView = () => {
    const { data: {title, subtitle, experience_id} } = this.props;
    console.log(`You selected ${title}: ${experience_id}`);
    this.props.navigate('Experience', {experienceId: experience_id});
  }

  goToArticleView = () => {
    const { data: {title, subtitle, experience_id} } = this.props;
    console.log(`You selected ${title}: ${experience_id}`);
    this.props.navigate('Article', {content: this.props.data});
  }

  render() {
    const { data: {title, subtitle, city}, even } = this.props;

    const uppercaseTitle = title
      ? (<Text style={styles.title} numberOfLines={3}>
        {title.toUpperCase()}
      </Text>)
      : false;

    return (
      <TouchableOpacity activeOpacity={1} style={styles.slideInnerContainer} onPress={this.goToArticleView}>
      <View style={styles.shadow}/>
      <View style={styles.imageContainer}>
        {this.image}
        <View style={styles.radiusMask}/>
      </View>
      <View style={styles.textContainer}>
        {uppercaseTitle}
        <Text style={styles.city} numberOfLines={2}>
          {subtitle || city}
        </Text>
      </View>
      </TouchableOpacity>
    );
  }
}
