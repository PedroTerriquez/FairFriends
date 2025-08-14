import axios from "axios";
import React, { useState } from "react";
import { View, Text, Pressable } from "react-native";
import { router } from "expo-router";
import { Ionicons } from '@expo/vector-icons';
import baseStyles from './BaseStyles' 
import Avatar from "./Avatar";
import { useSession } from "@/services/authContext";

export default function Payment({
  id,
  amount,
  canEdit,
  creatorName,
  date,
  paymentableId,
  paymentableType,
  parentTitle,
  status,
  title,
}) {
  const { session } = useSession();
  const [mutableStatus, setMutableStatus] = useState(status)
  const [pendingDecision, setPendingDecision] = useState(false)

  const pending = !canEdit && mutableStatus === "pending";
  const editable = canEdit && mutableStatus === "pending";
  const accepted = mutableStatus === "accepted";
  const rejected = mutableStatus === "rejected";

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
      return `${diffInMinutes} minute${diffInMinutes === 1 ? '' : 's'} ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours === 1 ? '' : 's'} ago`;
    } else if (diffInDays < 7) {
      return `${diffInDays} day${diffInDays === 1 ? '' : 's'} ago`;
    } else {
      return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric"
      }).format(paymentDate);
    }
  })();

  const handleShow = () => {
    router.push({ pathname: paymentableType.toLowerCase(), params: { id: paymentableId } });
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
      setMutableStatus('accepted')
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
        setMutableStatus('rejected')
      })
      .catch((error) => {
        console.error('Error rejecting payment:', error);
      });
  }

  const renderStatusSection = () => {
    return (
      <>
        {
          pendingDecision && (
            <View style={baseStyles.rowCenter}>
              <Pressable style={[baseStyles.circleButton, baseStyles.successBG]} onPress={() => acceptPaymentButton(id)}>
                <Ionicons name="checkmark" size={20} color="white" />
              </Pressable>
              <Pressable style={[baseStyles.circleButton, baseStyles.dangerBG, baseStyles.marginLeft5]} onPress={() => rejectPaymentButton(id)}>
                <Ionicons name="close" size={20} color="white" />
              </Pressable>
            </View>
          )
        }
        {
          pending && !pendingDecision && (
            <Pressable style={[baseStyles.circleButton, baseStyles.warningBG]} onPress={() => setPendingDecision(true)}>
              <Ionicons name="warning" size={20} color="white" />
            </Pressable>
          )
        }
        {
          editable && (
            <Pressable
              style={[baseStyles.circleButton, baseStyles.warningBG]}
              onPressIn={() => router.push({
                pathname: "/formPayment",
                params: {
                  payment_id: id,
                  paymentable_id: paymentableId,
                  type: paymentableType,
                  title: title,
                  amount: amount,
                  recipient_name: creatorName
                }
              })}
              onPress={() => { router.push({ pathname: "/formPayment", params: { payment_id: id }}) }}
            >
              <Text style={baseStyles.buttonText}>✎</Text>
            </Pressable>
          )
        }
        {
          accepted && (
            <Pressable style={[baseStyles.circleButton, baseStyles.successBG]}>
              <Ionicons name="checkmark" size={20} color="white" />
            </Pressable>
          )
        }
        {
          rejected && (
            <Pressable style={[baseStyles.circleButton, baseStyles.redBG]}>
              <Ionicons name="close" size={20} color="white" />
            </Pressable>
          )
        }
      </>
    )};

  return (
    <Pressable
      onPress={() => handleShow() }
      style={[baseStyles.card, mutableStatus == 'pending' ? baseStyles.cardPending : null]}>
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
          { renderStatusSection() }
        </View>
      </View>
    </Pressable>
  );
}