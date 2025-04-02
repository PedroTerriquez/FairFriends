import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { router, useNavigation } from "expo-router";
import { Ionicons } from '@expo/vector-icons';
import baseStyles from './BaseStyles' 
import Avatar from "./Avatar";

export default function NotificationCard({
  id,
  creator,
  nId,
  nType,
  eId,
  eType,
  date,
  amount,
  status,
  message,
  creatorName,
}) {
  const navigation = useNavigation();
  
  const formattedDate = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit", 
    minute: "2-digit",
  }).format(new Date(date));

  const handleShow = () => {
    navigation.navigate(nType.toLowerCase(), {paymentable_id: nId, type: nType})
  }

  return (
    <Pressable
      onPress={() => handleShow()}
      style={baseStyles.card}>
      <View style={baseStyles.cardContent}>
        <View style={baseStyles.rowCenter}>
          <Avatar name={creatorName[0]} />
          <View style={baseStyles.marginLeft}>
            <Text style={styles.boldText}>{creatorName}</Text>
            <Text>{message}</Text>
            <Text style={styles.note}>{formattedDate}</Text>
          </View>
        </View>
        <View style={baseStyles.rightColumn}>
          {amount && <Text style={styles.boldText}>{amount}</Text>}
          <Pressable style={[styles.button, styles.warning]}>
            <Ionicons name="notifications" size={20} color="white" />
          </Pressable>
        </View>
      </View>
    </Pressable>
  );
}

// Styles
const styles = StyleSheet.create({
  boldText: {
    fontWeight: "bold",
  },
  note: {
    color: "#888",
  },
  right: {
    alignItems: "center",
  },
  button: {
    height: 40,
    width: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
    marginTop: 10,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
  warning: {
    backgroundColor: "#f8c146",
  },
}); 