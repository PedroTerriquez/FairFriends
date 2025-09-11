import { Platform } from "react-native";
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';


const saveToken = async (token: string) => {
  try {
    if (Platform.OS === 'web') {
      await AsyncStorage.setItem('authToken', token);
    } else {
      await SecureStore.setItemAsync("authToken", token);
    }
    console.log('Data saved successfully');
  } catch (error) {
    console.error("Error saving data:", error);
  }
};

let cachedToken: string | null = null;

const getToken = async () => {
  if (cachedToken) {
    return { headers: { Authorization: `Bearer ${cachedToken}` } };
  }

  try {
    if (Platform.OS === 'web') {
      cachedToken = await AsyncStorage.getItem('authToken');
      if (!cachedToken) {
        //TODO: Think in something better like creating a toast
        //alert('No values stored under that key.');
      }
    } else {
      cachedToken = await SecureStore.getItemAsync("authToken");
      if (!cachedToken) {
        throw new Error("Token not found");
      }
    }
    return { headers: { Authorization: `Bearer ${cachedToken}` } };
  } catch (error) {
    console.error("Error getting token:", error);
    return { headers: {} }; // Or throw error if necessary
  }
};

const deleteToken = async () => {
  try {
    if (Platform.OS === 'web') {
      await AsyncStorage.removeItem('authToken')
    } else {
      await SecureStore.deleteItemAsync('authToken');
    }
  } catch (error) {
    console.error("Error deleting data:", error);
  }
}

export { saveToken, getToken, deleteToken }
