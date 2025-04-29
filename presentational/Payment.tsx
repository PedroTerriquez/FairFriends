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
  const [pendingDecision, setPendingDecision] = useState(false)
  
  const pending = !mine && realStatus === "pending";
  const editable = mine && realStatus === "pending";
  const accepted = realStatus === "accepted";
  const rejected = realStatus === "rejected";

  let moneyColor = baseStyles.boldText;
  if (accepted) {
    moneyColor = baseStyles.greenText;
  } else if (rejected) {
    moneyColor = baseStyles.redText;
  } else if (pending || editable) {
    moneyColor = baseStyles.orangeText;
  }

  const formattedDate = (() => {
    const now = new Date();
    const paymentDate = new Date(date);
    const diffInMillis = now - paymentDate;
    const diffInMinutes = Math.floor(diffInMillis / (1000 * 60));
    const diffInHours = Math.floor(diffInMillis / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMillis / (1000 * 60 * 60 * 24));

    if (diffInMinutes < 60) {
      return `${diffInMinutes} minutes ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours} hours ago`;
    } else if (diffInDays < 7) {
      return `${diffInDays} days ago`;
    } else {
      return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric"
      }).format(paymentDate);
    }
  })();

  const handleShow = () => {
    navigation.navigate(type.toLowerCase(), {paymentable_id, type})
  }

  const acceptPaymentButton = (id) => {
    if (!session) {
      console.error('No session available');
      return;
    }

    setPendingDecision(false)

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

  const rejectPaymentButton = (id) => {
    if (!session) {
      console.error('No session available');
      return;
    }

    setPendingDecision(false)

    axios.patch(
      `${process.env.EXPO_PUBLIC_API}/payments/${id}/reject`,
      { status: 'rejected' },
      session
    )
      .then((response) => {
        setRealStatus('rejected')
      })
      .catch((error) => {
        console.error('Error rejecting payment:', error);
      });
  }

  return (
    <Pressable
      onPress={() => handleShow() }
      style={[baseStyles.card, status == 'pending' ? baseStyles.cardPending : null]}>
      <View style={baseStyles.cardContent}>
        <View style={[baseStyles.rowCenter]}>
          <Avatar name={ creatorName[0] } />
          <View style={baseStyles.marginLeft}>
            <Text style={baseStyles.cardTitle}>{creatorName}</Text>
            <Text style={baseStyles.cardSubtitle}>{parentTitle}</Text>
            <Text style={baseStyles.cardDate}>{formattedDate}</Text>
          </View>
        </View>
        <View style={[baseStyles.alignItemsCenter]}>
          <Text style={moneyColor}>{accepted ? "+" : ""}{amount}</Text>
          {pendingDecision && (
            <View style={baseStyles.rowCenter}>
              <Pressable style={[baseStyles.circleButton, baseStyles.buttonSuccess]} onPress={() => acceptPaymentButton(id)}>
                <Ionicons name="checkmark" size={20} color="white" />
              </Pressable>
              <Pressable style={[baseStyles.circleButton, baseStyles.buttonDanger, baseStyles.marginLeft5]} onPress={() => rejectPaymentButton(id)}>
                <Ionicons name="close" size={20} color="white" />
              </Pressable>
            </View>
          )}
          {pending && !pendingDecision && (
            <Pressable style={[baseStyles.circleButton, baseStyles.buttonWarning]} onPress={() => setPendingDecision(true)}>
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
              <Ionicons name="checkmark" size={20} color="white" />
            </Pressable>
          )}
          {rejected && (
            <Pressable style={[baseStyles.circleButton, baseStyles.buttonDanger]}>
              <Ionicons name="close" size={20} color="white" />
            </Pressable>
          )}
        </View>
      </View>
    </Pressable>
  );
}