import { Dimensions, StyleSheet } from 'react-native';

export const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');

export function wp (percentage) {
    const value = (percentage * viewportWidth) / 100;
    return Math.round(value);
}

export const colors = {
  white: '#fff',
  black: '#1a1917',
  gray: '#888888',
  lightgrey: '#eee',
  background1: '#B721FF',
  background2: '#21D4FD'
};

export default styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.black
  },
  container: {
    flex: 1,
    backgroundColor: colors.background1
  },
  gradient: {
    ...StyleSheet.absoluteFillObject
  },
  scrollview: {
    flex: 1
  },
  container: {
    paddingVertical: 10
  },
  containerDark: {
    backgroundColor: colors.gray
  },
  containerLight: {
    backgroundColor: 'white'
  },
  title: {
    paddingHorizontal: 30,
    backgroundColor: 'transparent',
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  titleDark: {
    color: colors.black
  },
  subtitle: {
    marginTop: 5,
    paddingHorizontal: 30,
    backgroundColor: 'transparent',
    color: colors.black,
    fontSize: 20,
    fontStyle: 'italic',
    textAlign: 'center'
  },
  slider: {
    marginTop: 5,
    overflow: 'visible' // for custom animations
  },
  sliderContentContainer: {
    paddingVertical: 10 // for custom animation
  },
  paginationContainer: {
    paddingVertical: 2
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 8
  }
});
