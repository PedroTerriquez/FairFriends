import React, { useRef } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Avatar from './Avatar';
import baseStyles from './BaseStyles';

export default PlaceholderPerson = ({ children, onClick = () => {}}) => {
  return (
    <TouchableOpacity style={baseStyles.card} onPress={() => onClick() } >
      <View style={baseStyles.cardContent}>
        <View style={baseStyles.rowCenter}>
          <Avatar name={'Placeholder'}/>
          <View style={baseStyles.marginLeft}>
            <Text style={baseStyles.label17}> Placeholder Member </Text>
          </View>
        </View>
        {children}
      </View>
    </TouchableOpacity>
  );
};