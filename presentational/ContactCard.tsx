import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, spacing, typography } from '@/theme';
import Avatar from './Avatar';
import baseStyles from './BaseStyles';

export default function ContactCard({ person, children, onClick = () => {}}) {
  return (
    <TouchableOpacity style={[baseStyles.card]} key={person.id} >
      <View style={[baseStyles.cardContent, {paddingBottom: children ? spacing.sm : 0}]}>
        <View style={baseStyles.rowCenter}>
          <Avatar name={person.first_name[0]} size={48}/>
          <View style={{ marginLeft: spacing.sm, gap: spacing.xxs }}>
            <Text style={styles.personName}>
              {person.first_name} {person.last_name}
            </Text>
            <Text style={[styles.description, typography.body]}>{person.email}</Text>
          </View>
        </View>
      </View>
      {children}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  personName: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.text.primary,
  },
  description: {
    fontSize: 15,
    color: colors.text.secondary,
    marginBottom: spacing.sm,
  },
});