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

  let moneyColor = baseStyles.boldText;
  if (mine && accepted) {
    moneyColor = baseStyles.greenText;
  } else if (rejected) {
    moneyColor = baseStyles.redText;
  } else if (pending || editable) {
    moneyColor = baseStyles.orangeText;
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
            <Text style={baseStyles.cardTitle}>{paymentName}</Text>
            <Text style={baseStyles.cardSubtitle}>{title}</Text>
            <Text style={baseStyles.cardDate}>{formattedDate}</Text>
          </View>
        </View>
        <View style={baseStyles.rightColumn}>
          <Text style={moneyColor}>{amount}</Text>
          {pending && (
            <Pressable style={[baseStyles.circleButton, baseStyles.buttonWarning]} onPress={() => acceptPaymentButton(id)}>
              <Ionicons name="warning" size={20} color="white" />
            </Pressable>
          )}
          {editable && (
            <Pressable
              style={[baseStyles.circleButton, baseStyles.buttonWarning]}
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
              <Text style={baseStyles.buttonText}>✎</Text>
            </Pressable>
          )}
          {accepted && (
            <Pressable style={[baseStyles.circleButton, baseStyles.buttonSuccess]}>
              <Text style={baseStyles.buttonText}>✔</Text>
            </Pressable>
          )}
          {rejected && (
            <Pressable style={[baseStyles.circleButton, baseStyles.buttonDanger]}>
              <Text style={baseStyles.buttonText}>✖</Text>
            </Pressable>
          )}
        </View>
      </View>
    </Pressable>
  );
}