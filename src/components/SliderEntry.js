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

  goToView = () => {
    const { data: {title, subtitle, experience_id} } = this.props;
    console.log(`You selected ${title}: ${experience_id}`);
    this.props.navigate('Detail', {experienceId: experience_id});
  }

  goToArticleView = () => {
    // set const title to props
    const { data: {title, subtitle, experience_id} } = this.props;
    console.log(`You selected ${title}: ${experience_id}`);
    this.props.navigate('Article', {content: this.props.data});
  }
  evaluateType = () => {
    // const { data: {type} } = this.props;
    // this.props.navigate(type, {content: this.props.data});

    console.log(this.props.data.type);
    switch(this.props.data.type) {
      case 'article':
        console.log('banana');
        this.goToArticleView();
        break;
      case 'experience':
        console.log('apple');
        this.goToView();
        break;
    }
  }

  render() {
    const { data: {title, subtitle, city, type}, even } = this.props;
    // add what to pass here

    const uppercaseTitle = title
      ? (<Text style={styles.title} numberOfLines={3}>
        {title.toUpperCase()}
      </Text>)
      : false;

    return (
      <TouchableOpacity activeOpacity={1} style={styles.slideInnerContainer} onPress={this.evaluateType}>
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
