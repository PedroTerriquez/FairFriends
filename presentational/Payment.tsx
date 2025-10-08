import React, { useState } from "react";
import { View, Text, Pressable, Modal } from "react-native";
import { router } from "expo-router";
import baseStyles from './BaseStyles' 
import Avatar from "./Avatar";
import { acceptPayment, rejectPayment } from "@/services/api";
import AcceptButton, { EditButton, InSplitButton, PendingButton, RejectButton } from "./acceptButton";
import ButtonWithIcon from "./ButtonWithIcon";
import { Ionicons } from "@expo/vector-icons";

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
  promises,
  handleAccept,
}) {
  const [mutableStatus, setMutableStatus] = useState(status)
  const [pendingDecision, setPendingDecision] = useState(false)
  const [showSplitWarning, setShowSplitWarning] = useState(false)

  const pending = !canEdit && mutableStatus === "pending";
  const editable = canEdit && mutableStatus === "pending";
  const accepted = mutableStatus === "accepted";
  const rejected = mutableStatus === "rejected";
  const in_split = mutableStatus === "in_split";

  let moneyColor = baseStyles.boldText;
  if (accepted) {
    moneyColor = baseStyles.greenText;
  } else if (rejected) {
    moneyColor = baseStyles.redText;
  } else if (pending || editable) {
    moneyColor = baseStyles.orangeText;
  } else if (in_split) {
    moneyColor = baseStyles.textGray;
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
      .then((response) => {
        setMutableStatus('accepted')
        handleAccept(response.data.amount);
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
        <View style={[baseStyles.rowCenter, { gap: 5 }]}>
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
    } else if (in_split) {
      return <InSplitButton onPressAction={() => setShowSplitWarning(true) } />
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
            { parentTitle && <Text style={baseStyles.cardSubtitle}>{parentTitle}</Text> }
            { title && <Text style={baseStyles.cardSubtitle}>{title}</Text> }
            <Text style={[baseStyles.cardDate, {paddingTop: 10}]}>{formattedDate}</Text>
          </View>
        </View>
        <View style={{alignItems: 'flex-end'}}>
          <Text style={moneyColor}>{accepted ? "+" : ""}{amount}</Text>
          {renderStatusSection()}
        </View>
      </View>
      <Modal
        visible={showSplitWarning}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowSplitWarning(false)}
      >
        <View style={[baseStyles.modalContainer]}>
          <View style={[baseStyles.modalContent]}>
            <Text style={[baseStyles.title24, { marginTop: 40, marginBottom: 20, textAlign: 'center' }]}> ⚠️ This payment was split unequally.</Text>
            <Text style={baseStyles.label17}>Some members paid more. The total will be recorded as a separate 'Promise', not part of the balance.</Text>
            <Text style={[baseStyles.title24, {marginTop: 20}]}>Details:</Text>
            { promises && promises.map((promise, index) => (
              <View key={index} style={[baseStyles.rowCenter, {justifyContent: 'space-between', width: '100%', marginTop: 10}]}>
                <Text style={baseStyles.label17}>{promise.name}</Text>
                <Text style={baseStyles.label17}>{promise.paid}/{promise.total}</Text>
                </View>
            )) }
            <ButtonWithIcon
              style={[baseStyles.successBG, {marginTop: 50}]}
              textStyle={{ fontSize: 15, marginLeft: 10 }}
              text='OK, understood'
              onPress={() => setShowSplitWarning(false)}
              icon={<Ionicons name="close-sharp" size={31} color="white" />}
            />
          </View>
        </View>
      </Modal>
    </Pressable>
  );
}