import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Avatar from './Avatar';
import baseStyles from './BaseStyles';
import { useTranslation } from "react-i18next";

export default function PlaceholderPerson({ children, onClick = () => {}}) {
  const { t } = useTranslation();

  return (
    <TouchableOpacity style={baseStyles.card} onPress={() => onClick() } >
      <View style={baseStyles.cardContent}>
        <View style={baseStyles.rowCenter}>
          <Avatar name={t('placeholderPerson.placeholder')}/>
          <View style={baseStyles.marginLeft10}>
            <Text style={baseStyles.label17}> {t('placeholderPerson.placeholder_member')} </Text>
          </View>
        </View>
        {children}
      </View>
    </TouchableOpacity>
  );
};