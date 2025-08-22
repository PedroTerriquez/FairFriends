import React, { useState } from "react";
import { View, Text, Pressable } from "react-native";
import { router } from "expo-router";
import baseStyles from './BaseStyles' 
import Avatar from "./Avatar";
import { acceptPayment, rejectPayment } from "@/services/api";
import AcceptButton, { EditButton, PendingButton, RejectButton } from "./acceptButton";

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
    setPendingDecision(false)
    acceptPayment(id)
      .then(() => {
        setMutableStatus('accepted')
      })
      .catch((error) => {
        console.error('Error accepting payment:', error);
      });
  }

  const rejectPaymentButton = (id) => {
    setPendingDecision(false)
    rejectPayment(id)
      .then(() => {
        setMutableStatus('rejected')
      })
      .catch((error) => {
        console.error('Error rejecting payment:', error);
      });
  }

  const renderStatusSection = () => {
    if (pendingDecision) {
      return (
        <View style={baseStyles.rowCenter}>
          <AcceptButton onPressAction={() => acceptPaymentButton(id)} />
          <RejectButton onPressAction={() => rejectPaymentButton(id)} />
        </View>)
    } else if (pending && !pendingDecision) {
      return <PendingButton onPressAction={() => setPendingDecision(true)} />
    } else if (editable) {
      return (<EditButton onPressAction={() => router.push({
        pathname: "/formPayment", params:
        {
          payment_id: id,
          recipient_name: creatorName,
          amount: amount,
          title: title,
          type: paymentableType,
          paymentableId: paymentableId,
        }
      })} />)
    } else if (accepted) {
      return <AcceptButton onPressAction={null} />
    } else if (rejected) {
      return <RejectButton onPressAction={null} />
    }
  };

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