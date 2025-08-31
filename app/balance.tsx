import { useCallback, useState } from "react";
import { ScrollView, View, Text, RefreshControl } from "react-native";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";

import baseStyles from '@/presentational/BaseStyles'
import Payment from '../presentational/Payment';
import BalanceCard from '../presentational/BalanceCard';
import FloatingButton from "@/presentational/FloatingButton";
import Spinner from "@/presentational/Spinner";
import { getBalanceDetail, getBalanceInfo } from "@/services/api";
import EmptyList from "@/presentational/EmptyList";
import ModalInfoSplit from "@/presentational/ModalSplitInfo";

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

  const members = () => {
    return JSON.stringify(balance.balance_members.map(member => {
      return {
        id: member.id,
        name: member.name,
      };
    }));
  }

  const formPaymentParams = () => {
    return {
      paymentable_id: id,
      type: 'Balance',
      recipient_name: balance.name,
      recipient_id: balance.id,
      members: members(),
      admin: balance.admin
    }
  }

  const renderPaymentsHeader = () => {
    return (
      <>
        <Text style={[baseStyles.title15, { marginTop: 10 }]}>Recent Transactions </Text>
        {
          balance?.status === 'active' && <FloatingButton
          style={{ position: 'absolute', bottom: 10, right: 70 }}
          icon='split'
          action={() => {
            if (balance) {
              router.push({
                pathname: "/formPayment",
                params: formPaymentParams()
              });
            }
          }}
        />
        }
        {
          payable && <FloatingButton
            icon="add"
            action={() => {
              if (balance) {
                router.push({
                  pathname: "/formPayment",
                  params: formPaymentParams()
                });
              }
            }}
          />
        }

      </>)
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
        { showSplit && <ModalInfoSplit visible={showSplit} payments={balanceSplitted} onClose={() => setShowSplit(false)} /> }
        <BalanceCard
          id={balance.id}
          total={balance.total}
          name={balance.name}
          status={balance.status}
          members={balance.balance_members}
          myTotal={balance.my_total}
        />
        <View style={[baseStyles.rowCenter, baseStyles.paddingVertical10, { justifyContent: "space-between", height: 70 }]}>
          {renderPaymentsHeader()}
        </View>
        <FloatingButton
          icon='close'
          style={{ backgroundColor: 'red' }}
          action={() => { setShowSplit(true) }}
        />
        {renderPayments()}
      </ScrollView>
    </>
  )
}