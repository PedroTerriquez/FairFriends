import { useCallback, useState } from "react";
import { ScrollView, View, Text, RefreshControl, TouchableOpacity } from "react-native";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";

import baseStyles from '@/presentational/BaseStyles'
import Payment from '../presentational/Payment';
import BalanceCard from '../presentational/BalanceCard';
import FloatingButton from "@/presentational/FloatingButton";
import Spinner from "@/presentational/Spinner";
import { getBalanceDetail, getBalanceInfo } from "@/services/api";
import EmptyList from "@/presentational/EmptyList";
import ModalInfoSplit from "@/presentational/ModalSplitInfo";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

export default function Balance() {
  const [payments, setPayments] = useState([]);
  const [balance, setBalance] = useState(null);
  const [balanceSplitted, setBalanceSplitted] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showSplit, setShowSplit] = useState(false);
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const payable = balance && balance.status === 'active';

  const fetchBalance = async () => {
    setLoading(true);
    setRefreshing(true);
    getBalanceDetail(id)
      .then((response) => {
        setPayments(response.data.payments);
        setBalance(response.data.balance);
      })
      .catch((error) => {
      })
      .finally(() => {
        setRefreshing(false);
        setLoading(false);
      });
  };

  const fetchInfo = async () => {
    getBalanceInfo(id)
      .then((response) => {
        setBalanceSplitted(response.data);
      })
      .catch((error) => {
      });
  };

  const membersAsString = () => {
    return JSON.stringify(balance.balance_members.map(member => {
      return {
        id: member.user_id,
        name: member.name,
      };
    }));
  }

  const formPaymentParams = () => {
    return {
      paymentable_id: id,
      type: 'Balance',
      recipient_name: balance.name,
      recipient_id: balance.creator_id,
      members: membersAsString(),
      admin: balance.admin
    }
  }

  const renderPaymentsHeader = () => {
    return (
      <View style={[baseStyles.containerCard, { flexDirection: 'row', alignItems: 'center', height: 70}]}>
        <Text style={[baseStyles.title15, {marginLeft: 15}]}>Recent Transactions </Text>
        <View style={[baseStyles.rightSection, { gap: 10 }]}>
          {
            balance?.status === 'active' && <TouchableOpacity onPress={() => {
              if (balance) {
                router.push({
                  pathname: "/formUnevenPayment",
                  params: formPaymentParams()
                });
              }
            }} style={[baseStyles.circleButton, baseStyles.blueBG]}>
              <MaterialIcons name="call-split" size={23} color="white" />
            </TouchableOpacity>
          }
          {
            payable && <TouchableOpacity onPress={() => {
              if (balance) {
                router.push({
                  pathname: "/formPayment",
                  params: formPaymentParams()
                });
              }
            }} style={[baseStyles.circleButton, baseStyles.blueBG]}>
              <Ionicons name="add" size={31} color="white" />
            </TouchableOpacity>
          }
        </View>
      </View>)
  }

  const renderPayments = () => {
    if (payments.length === 0) return <EmptyList text="No payments yet" ><Text>Start adding a new payment</Text></EmptyList>;

    return payments.map(payment => (
      <Payment
        key={payment.id}
        id={payment.id}
        amount={payment.amount}
        canEdit={(balance.admin && balance.balance_members.length > 2) || payment.mine}
        creatorName={payment.creator_name}
        date={payment.created_at}
        paymentableId={payment.paymentable_id}
        paymentableType={payment.paymentable_type}
        parentTitle={payment.parent_title}
        status={payment.status}
        title={payment.title}
      />
    ))
  }

  useFocusEffect(
    useCallback(() => {
      fetchBalance();
      fetchInfo();
    }, [id])
  );

  if (loading) return <Spinner />;
  if (!loading && !balance) return (<EmptyList text="No balance found">{null}</EmptyList>)

  return (
    <>
      <ScrollView
        contentContainerStyle={[baseStyles.viewContainerFull]}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={fetchBalance} />} >
        { showSplit && <ModalInfoSplit visible={showSplit} balanceSplittedInfo={balanceSplitted} onClose={() => setShowSplit(false)} /> }
        <BalanceCard
          id={balance.id}
          total={balance.total}
          name={balance.name}
          status={balance.status}
          members={balance.balance_members}
          myTotal={balance.my_total}
        />
        <View style={[{ justifyContent: "space-between", height: 70, marginBottom: 10 }]}>
          {renderPaymentsHeader()}
        </View>
        <FloatingButton
          icon='close'
          style={{ backgroundColor: 'red', left: 20 }}
          action={() => { setShowSplit(true) }}
        />
        {renderPayments()}
      </ScrollView>
    </>
  )
}