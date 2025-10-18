import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import baseStyles from './BaseStyles';

export default function CustomHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();

  if (pathname === '/login' || pathname === '/signup') {
    return null;
  }

  const canGoBack = pathname !== '/home' && router.canGoBack();

  // TODO: Probably remove extra padding to the top of the header
  return (
    <View style={[baseStyles.header, { paddingTop: insets.top + 10, paddingHorizontal: 15 }]}>
      <View style={baseStyles.headerContent}>
        <View style={baseStyles.leftSection}>
          {canGoBack && (
            <TouchableOpacity 
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>
          )}
        </View>
        <View style={baseStyles.center}>
          <TouchableOpacity onPress={() => router.push('/home')}>
            <Text style={baseStyles.title17}>FairFriends</Text>
          </TouchableOpacity>
        </View>
        <View style={[baseStyles.rightSection, {gap : 5}]}>
          <TouchableOpacity 
            onPressIn={() => router.push('/notifications')}
          >
            <Ionicons name="notifications" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity 
            onPressIn={() => router.push('/contactRequests')}
          >
            <Ionicons name="person-add" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}