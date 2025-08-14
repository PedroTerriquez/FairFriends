import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import baseStyles from './BaseStyles';

export default function Spinner() {
  return (
    <View style={baseStyles.spinnerContainer}>
      <ActivityIndicator size="large" color="#4CAF50" />
    </View>
  );
}
