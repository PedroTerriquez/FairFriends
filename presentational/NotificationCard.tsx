import React, { useState } from "react";
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
  acceptNotification,
  rejectNotification,
}) {
  const [pendingDecision, setPendingDecision] = useState(false)
  const [decisionDone, setDecisionDone] = useState(false)
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
            <Text style={baseStyles.cardTitle}>{creatorName}</Text>
            <Text style={baseStyles.cardSubtitle}>New {nType}</Text>
            <Text style={baseStyles.cardDate}>{formattedDate}</Text>
          </View>
        </View>
        <View style={baseStyles.alignItemsCenter}>
          {amount && <Text style={baseStyles.boldText}>{amount}</Text>}
          {!pendingDecision && status == 'pending' && <Pressable
            style={[baseStyles.circleButton, baseStyles.warningBG]}
            onPress={() => setPendingDecision(true)}>
            <Ionicons name="notifications" size={20} color="white" />
          </Pressable> }
          {pendingDecision && !decisionDone && (
            <View style={baseStyles.rowCenter}>
              <Pressable style={[baseStyles.circleButton, baseStyles.successBG]}
                onPress={() => {
                  acceptNotification(id);
                  setDecisionDone(true);
                }}
              >
                <Text style={baseStyles.buttonText}>✔</Text>
              </Pressable>
              <Pressable style={[baseStyles.circleButton, baseStyles.dangerBG, baseStyles.marginLeft5]}
                onPress={() => {
                  rejectNotification(id);
                  setDecisionDone(true);
                }}
              >
                <Text style={baseStyles.buttonText}>✖</Text>
              </Pressable>
            </View>
          )}
        </View>
      </View>
    </Pressable>
  );
}