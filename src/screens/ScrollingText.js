import React, { useEffect, useState } from 'react';
import { Text, View, Animated, Easing, StyleSheet, Dimensions } from 'react-native';

const ScrollingText = ({ 
  text = "Lorem Ipsum is simply dummy text of the printing and typesetting industry",
  speed = 50 // Lower = faster
}) => {
  const [contentWidth, setContentWidth] = useState(0);
  const scrollX = new Animated.Value(0);
  const { width: screenWidth } = Dimensions.get('window');

  useEffect(() => {
    if (contentWidth > 0) {
      const duration = contentWidth * speed;
      
      Animated.loop(
        Animated.sequence([
          Animated.timing(scrollX, {
            toValue: -contentWidth,
            duration: duration,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
          Animated.timing(scrollX, {
            toValue: screenWidth,
            duration: 0,
            useNativeDriver: true,
          })
        ])
      ).start();
    }
  }, [contentWidth]);

  return (
    <View style={styles.container}>
      <View
        style={styles.innerContainer}
        onLayout={(event) => {
          setContentWidth(event.nativeEvent.layout.width);
        }}>
        <Animated.View
          style={[
            styles.textContainer,
            {
              transform: [{ translateX: scrollX }],
            },
          ]}>
          <Animated.Text style={styles.text}>
            {text}
            <Animated.Text>{'     '}</Animated.Text>
            {text}
          </Animated.Text>
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 40,
    backgroundColor: 'white',
    overflow: 'hidden',
  },
  innerContainer: {
    height: '100%',
    backgroundColor: 'transparent',
  },
  textContainer: {
    flexDirection: 'row',
    height: '100%',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    color: 'black',
  },
});

export default ScrollingText;