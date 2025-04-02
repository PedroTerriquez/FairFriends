import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Avatar from './Avatar';
import baseStyles from './BaseStyles';

export default Person = ({ person, children, onClick = () => {}}) => {
  return (
    <TouchableOpacity style={baseStyles.card} key={person.id} onPress={() => onClick(person.id) } >
      <View style={baseStyles.cardContent}>
        <View style={baseStyles.rowCenter}>
          <Avatar name={person.first_name[0]}/>
          < View style={baseStyles.marginLeft}>
            <Text style={baseStyles.label}>
              {person.first_name} {person.last_name}
            </Text>
            < Text style={styles.email} >{person.email}</Text>
          </View>
        </View>
        {children}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  email: {
    fontSize: 14,
    color: 'gray',
  },
});