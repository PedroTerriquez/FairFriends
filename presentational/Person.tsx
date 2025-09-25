import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Avatar from './Avatar';
import baseStyles from './BaseStyles';

export default function Person({ person, children, onClick = () => {}}) {
  return (
    <TouchableOpacity style={[baseStyles.card]} key={person.id} onPress={() => onClick(person.id) } >
      <View style={[baseStyles.cardContent]}>
        <View style={baseStyles.rowCenter}>
          <Avatar name={person.first_name[0]}/>
          < View style={baseStyles.marginLeft}>
            <Text style={baseStyles.label17}>
              {person.first_name} {person.last_name}
            </Text>
            < Text style={[baseStyles.label14, baseStyles.textGray]} >{person.email}</Text>
          </View>
        </View>
        {children}
      </View>
    </TouchableOpacity>
  );
};