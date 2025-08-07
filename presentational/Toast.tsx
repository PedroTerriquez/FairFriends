import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';

const Toast = ({ message, isVisible, onHide, type = 'error' }) => {
  const opacity = new Animated.Value(0);

  useEffect(() => {
    if (isVisible) {
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.delay(3000),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        onHide();
      });
    }
  }, [isVisible]);

  if (!isVisible) return null;

  const getBackgroundColor = () => {
    switch (type) {
      case 'error':
        return '#dc3545';
      case 'success':
        return '#28a745';
      case 'info':
        return '#17a2b8';
      default:
        return '#dc3545';
    }
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity,
          backgroundColor: getBackgroundColor(),
        },
      ]}
    >
      <Text style={styles.message}>{message}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 40,
    left: 20,
    right: 20,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  message: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default Toast;