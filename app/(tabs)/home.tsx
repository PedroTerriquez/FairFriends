import axios from "axios";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

import { useSession } from "@/services/authContext";
import Payment from '../../presentational/Payment';
import baseStyles from "@/presentational/BaseStyles";
import EmptyList from "@/presentational/EmptyList";
import MiniBalanceCard from "@/presentational/MiniBalanceCard";
import MiniPromiseCard from "@/presentational/MiniPromiseCard";
import { router } from "expo-router";
import Spinner from '../../presentational/Spinner';

export default function Home() {
  const [balances, setBalances] = useState([])
  const [promises, setPromises] = useState([])
  const [balancePayments, setBalancePayments] = useState([])
  const [promisePayments, setPromisePayments] = useState([])
  const [activeTab, setActiveTab] = useState("Promises");
  const [loading, setLoading] = useState(false);

  const { session } = useSession();

  const fetchPayments = async () => {
    setLoading(true);
    axios.get(`${process.env.EXPO_PUBLIC_API}/home`, session).then((response) => {
      setBalances(response.data.balances)
      setPromises(response.data.promises)
      setBalancePayments(response.data.balance_payments)
      setPromisePayments(response.data.promise_payments)
    }).catch((error) => {
        console.log(error);
      }).finally(() => {
        setLoading(false);
      });
  }

  const showEmptyPayments = () => {
      return (<EmptyList text="No payments">
        <>
          <Text style={[baseStyles.label17]}>
            Start a{' '}
            <Pressable onPress={() => { router.push("/contacts") }}>
              <Text style={baseStyles.link}>Promise</Text>
            </Pressable>
            {', or create a new '}
            <Pressable onPress={() => { router.push("/formBalance") }}>
              <Text style={baseStyles.link}>Balance</Text>
            </Pressable>
          </Text>
        </>
      </EmptyList>)
 
  }
  
  const renderPayments = (payments) => {
    if (payments.length === 0) return showEmptyPayments();

    return payments.map(payment => (
      <Payment
        key={payment.id}
        id={payment.id}
        amount={payment.amount}
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

  const renderMiniBalanceCards = (balances) => {
    return balances.map(balance => (
      <MiniBalanceCard
        key={balance.id}
        id={balance.id}
        total={balance.total}
        name={balance.name}
        members={balance.members}
        myTotal={balance.my_total}
      />
    ))
  }

  const renderMiniPromiseCards = (promises) => {
    return promises.map(promise => (
      <MiniPromiseCard
        key={promise.id}
        id={promise.id}
        paidAmount={promise.paid_amount}
        total={promise.total}
        name={promise.administrator_name}
      />
    ))
  }

  useEffect(() => {
    fetchPayments();
  }, []);

  if (loading) return <Spinner />;

  return (
    <View style={baseStyles.viewContainerFull}>
      {balances.length > 0 && (<View style={{ flex: 1}}>
        <Pressable onPress={() => { router.push("/balances") }}>
          <Text style={[baseStyles.label17, { fontWeight: 600 }]}>Balances</Text>
        </Pressable>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 10 }}>
          {renderMiniBalanceCards(balances)}
        </ScrollView> </View>
      )}
      {promises.length > 0 && (<View style={{ flex: 1}}>
        <Pressable onPress={() => { router.push("/promises") }}>
          <Text style={[baseStyles.label17, { fontWeight: 600 }]}>Promises</Text>
        </Pressable>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 10 }}>
          {renderMiniPromiseCards(promises)}
        </ScrollView></View>
      )}
      <View style={{ flex: 3.5 }}>
        <View style={[baseStyles.viewRowWithSpace]}>
          <Pressable
            style={activeTab === "Promises" ? baseStyles.tabBarActive : baseStyles.tabBarInactive}
            onPress={() => setActiveTab("Promises")}
          >
            <Text style={activeTab === "Promises" ? baseStyles.tabBarTextActive : baseStyles.tabBarTextInactive}>
              Promises
            </Text>
          </Pressable>
          <Pressable
            style={activeTab === "Balances" ? baseStyles.tabBarActive : baseStyles.tabBarInactive}
            onPress={() => setActiveTab("Balances")}
          >
            <Text style={activeTab === "Balances" ? baseStyles.tabBarTextActive : baseStyles.tabBarTextInactive}>
              Balances
            </Text>
          </Pressable>
        </View>
        <ScrollView contentContainerStyle={[baseStyles.viewContainerFull, { flex: 2 }]}>
          {activeTab === "Promises" ? renderPayments(promisePayments) : renderPayments(balancePayments)}
        </ScrollView>
      </View>
    </View>
  );
}