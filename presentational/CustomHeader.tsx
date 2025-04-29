import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Platform } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function CustomHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const canGoBack = router.canGoBack();
  const insets = useSafeAreaInsets();

  if (pathname === '/login' || pathname === '/signup') {
    return null;
  }

  return (
    <View style={[styles.header, { paddingTop: insets.top }]}>
      <View style={styles.headerContent}>
        <View style={styles.leftSection}>
          {canGoBack && (
            <TouchableOpacity 
              style={styles.iconButton}
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.centerSection}>
          <TouchableOpacity  onPress={() => router.push('/home')}>
            <Text style={styles.title}>FairFriends</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.rightSection}>
          <TouchableOpacity 
            style={styles.iconButton}
            onPressIn={() => router.push('/profile')}
          >
            <MaterialIcons name="account-circle" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.iconButton}
            onPressIn={() => router.push('/notifications')}
          >
            <Ionicons name="notifications" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.iconButton}
            onPressIn={() => router.push('/contactRequests')}
          >
            <Ionicons name="person-add" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: 'white',
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
  },
  leftSection: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  centerSection: {
    flex: 1,
    alignItems: 'center',
  },
  rightSection: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  iconButton: {
    marginHorizontal: 5,
  },
}); 