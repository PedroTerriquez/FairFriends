import React, { useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { router } from "expo-router";
import { Ionicons } from '@expo/vector-icons';
import baseStyles from './BaseStyles' 
import Avatar from "./Avatar";
import AcceptButton, { RejectButton } from "./acceptButton";

export default function NotificationCard({
  id,
  notifiableId,
  notifiableType,
  paymentableId,
  paymentableType,
  date,
  amount,
  status,
  creatorName,
  updateStatus,
}) {
  const [pendingDecision, setPendingDecision] = useState(false)
  const [decisionDone, setDecisionDone] = useState(false)
  
  const formattedDate = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit", 
    minute: "2-digit",
  }).format(new Date(date));

  const handleShow = () => {
    let route;
    switch (notifiableType) {
      case 'Promise':
        route = 'promise';
        break;
      case 'Balance':
        route = 'balance';
        break;
      case 'Payment':
        route = paymentableType.toLowerCase();
        notifiableId = paymentableId;
        break;
      case 'Friendship':
        route = 'profile';
        break;
      default:
        route = 'default';
        break;
    }
    
    router.push({ pathname: route, params: { id: notifiableId } });
  }

  return (
    <Pressable
      onPress={() => handleShow()}
      style={[baseStyles.card, ['accepted', 'rejected'].includes(status) ? baseStyles.cardRead : baseStyles.cardUnread]}>
      <View style={baseStyles.cardContent}>
        <View style={baseStyles.rowCenter}>
          <Avatar name={creatorName[0]} />
          <View style={baseStyles.marginLeft}>
            <Text style={baseStyles.cardTitle}>{creatorName}</Text>
            <Text style={baseStyles.cardSubtitle}>New {notifiableType}</Text>
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
            <View style={[baseStyles.rowCenter, { gap: 5 }]}>
              <AcceptButton onPressAction={() => {
                updateStatus(id, 'accepted');
                setDecisionDone(true);
              }} />
              <RejectButton onPressAction={() => {
                updateStatus(id, 'rejected');
                setDecisionDone(true);
              }} />
            </View>
          )}
        </View>
      </View>
    </Pressable>
  );
}