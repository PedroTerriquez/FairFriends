import axios from "axios";
import React, { useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { router, useNavigation } from "expo-router";
import { Ionicons } from '@expo/vector-icons';
import baseStyles from './BaseStyles' 
import Avatar from "./Avatar";
import { useSession } from "@/services/authContext";

export default function Payment({
  id,
  title,
  creatorName,
  method,
  amount,
  date,
  paymentable_id,
  type,
  status,
  mine,
  parentTitle,
}) {
  const navigation = useNavigation();
  const { session } = useSession();
  const [realStatus, setRealStatus] = useState(status)
  
  const pending = !mine && realStatus === "pending";
  const editable = mine && realStatus === "pending";
  const accepted = realStatus === "accepted";
  const rejected = realStatus === "rejected";

  let moneyColor = styles.boldText;
  if (mine && accepted) {
    moneyColor = styles.greenText;
  } else if (rejected) {
    moneyColor = styles.redText;
  } else if (pending || editable) {
    moneyColor = styles.orangeText;
  }

  const paymentName = parentTitle ? `${creatorName} - ${parentTitle}` : creatorName;

  const formattedDate = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit", 
    minute: "2-digit",
  }).format(new Date(date));

  const handleShow = () => {
    navigation.navigate(type.toLowerCase(), {paymentable_id, type})
  }

  const acceptPaymentButton = (id) => {
    if (!session) {
      console.error('No session available');
      return;
    }

    axios.patch(
      `${process.env.EXPO_PUBLIC_API}/payments/${id}/accept`,
      { status: 'accepted' },
      session
    )
    .then((response) => {
      setRealStatus('accepted')
    })
    .catch((error) => {
      console.error('Error accepting payment:', error);
    });
  }

  return (
    <Pressable
      onPress={() => handleShow() }
      style={[baseStyles.card, status == 'pending' ? baseStyles.cardPending : null]}>
      <View style={baseStyles.cardContent}>
        <View style={baseStyles.rowCenter}>
          <Avatar name={ creatorName[0] } />
          <View style={baseStyles.marginLeft}>
            <Text style={styles.boldText}>{paymentName}</Text>
            <Text>{title}</Text>
            <Text style={styles.note}>{formattedDate}</Text>
          </View>
        </View>
        <View style={baseStyles.rightColumn}>
          <Text style={moneyColor}>{amount}</Text>
          {pending && (
            <Pressable style={[styles.button, styles.warning]} onPress={() => acceptPaymentButton(id)}>
              <Ionicons name="warning" size={20} color="white" />
            </Pressable>
          )}
          {editable && (
            <Pressable
              style={[styles.button, styles.warning]}
              onPressIn={() => router.push({
                pathname: "/formPayment",
                params: {
                  payment_id: id,
                  paymentable_id: paymentable_id,
                  type: type,
                  title: title,
                  amount: amount,
                  recipient_name: creatorName 
                }
              })}
              onPress={() => navigation.navigate("formPayment", { payment_id: id,  })}
            >
              <Text style={styles.buttonText}>✎</Text>
            </Pressable>
          )}
          {accepted && (
            <Pressable style={[styles.button, styles.success]}>
              <Text style={styles.buttonText}>✔</Text>
            </Pressable>
          )}
          {rejected && (
            <Pressable style={[styles.button, styles.danger]}>
              <Text style={styles.buttonText}>✖</Text>
            </Pressable>
          )}
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
  success: {
    backgroundColor: "#4CAF50",
  },
  danger: {
    backgroundColor: "#E53935",
  },
  greenText: { color: "green", fontWeight: "bold" },
  redText: { color: "red", fontWeight: "bold" },
  orangeText: { color: "orange", fontWeight: "bold" },
});

