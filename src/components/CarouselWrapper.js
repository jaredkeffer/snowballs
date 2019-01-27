import React from 'react';
import {View, Text, StyleSheet} from 'react-native'
import { sliderWidth, itemWidth } from '../styles/SliderEntry.style';
import styles, { colors } from '../styles/index.style';

import Carousel, { Pagination } from 'react-native-snap-carousel';
import SliderEntry from './SliderEntry';

const SLIDER_FIRST_ITEM = 0;

export class CarouselWrapper extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      title: props.title,
      entries: props.entries,
      data: props.data,
      layout: props.layout ? props.layout : 'default',
      paginate: props.paginate,
      sliderActiveSlide: SLIDER_FIRST_ITEM,
      isDark: props.isDark,
    }
  }

  _renderItem({item, index}) {
    return <SliderEntry data={item} even={(index + 1) % 2 === 0}/>;
  }

  _renderItemWithParallax({
    item,
    index
  }, parallaxProps) {
    return (<SliderEntry data={item} even={(index + 1) % 2 === 0}
      parallax={true} parallaxProps={parallaxProps}/>);
  }

  pagination() {
    const { sliderActiveSlide, data, isDark } = this.state;
    return <Pagination
      dotsLength={data.length}
      activeDotIndex={sliderActiveSlide}
      containerStyle={styles.paginationContainer}
      dotColor={isDark ? colors.white : colors.gray}
      dotStyle={styles.paginationDot}
      inactiveDotColor={isDark ? colors.gray :colors.black}
      inactiveDotOpacity={0.4}
      inactiveDotScale={0.6}
      carouselRef={this._slider1Ref}
      tappableDots={!!this._slider1Ref}
    />
  }

  carousel(number, title) {
    const { sliderActiveSlide, data, layout, paginate, isDark } = this.state;
    const whiteText = isDark ? {color: 'white'} : {};

    return (<View style={styles.container}>
      <Text style={{...styles.subtitle,  ...whiteText}}>{title}</Text>
      <Carousel ref={c => this._slider1Ref = c}
      data={data} renderItem={this._renderItemWithParallax}
      sliderWidth={sliderWidth} itemWidth={itemWidth} layout={layout}
      hasParallaxImages={true} firstItem={SLIDER_FIRST_ITEM}
      inactiveSlideScale={0.94} inactiveSlideOpacity={0.7}
      containerCustomStyle={styles.slider} loop={true} loopClonesPerSide={2}
      contentContainerCustomStyle={styles.sliderContentContainer}
      onSnapToItem={(index) => this.setState({sliderActiveSlide: index})}/>

      { paginate ? this.pagination(data, sliderActiveSlide) : false }
    </View>);
  }

  render() {
    return this.carousel(1, this.state.title);
  }
}
