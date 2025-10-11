import { Platform } from "react-native";
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';


const saveSession = async (token: string, user: object) => {
  try {
    const userString = JSON.stringify(user);

    if (Platform.OS === 'web') {
      await AsyncStorage.setItem('authToken', token);
      await AsyncStorage.setItem('user', userString);
    } else {
      await SecureStore.setItemAsync("authToken", token);
      await SecureStore.setItemAsync("user", userString);
    }
    console.log('Data saved successfully');
  } catch (error) {
    console.error("Error saving data:", error);
  }
};

let cachedToken: string | null = null;
let cachedUser: string | null = null;

const getSession = async () => {
  if (cachedToken && cachedUser) {
    return {
      token: cachedToken,
      user: cachedUser,
      headers: { Authorization: `Bearer ${cachedToken}` },
    };
  }

  try {
    let token: string | null = null;
    let userString: string | null = null;

    if (Platform.OS === 'web') {
      token = await AsyncStorage.getItem('authToken');
      userString = await AsyncStorage.getItem('user');
    } else {
      token = await SecureStore.getItemAsync('authToken');
      userString = await SecureStore.getItemAsync('user');
    }

    const user = userString ? JSON.parse(userString) : null;

    if (!token) {
      throw new Error('Token not found');
    }

    cachedToken = token;
    cachedUser = user;

    return {
      token,
      user,
      headers: { Authorization: `Bearer ${token}` },
    };
  } catch (error) {
    console.error('Error getting session:', error);
    return {
      token: null,
      user: null,
      headers: {},
    };
  }
};

const deleteSession = async () => {
  try {
    if (Platform.OS === 'web') {
      await AsyncStorage.removeItem('authToken')
      await AsyncStorage.removeItem('user')
    } else {
      await SecureStore.deleteItemAsync('authToken');
      await SecureStore.deleteItemAsync('user');
    }
  } catch (error) {
    console.error("Error deleting data:", error);
  }
}

export { saveSession, getSession, deleteSession }
