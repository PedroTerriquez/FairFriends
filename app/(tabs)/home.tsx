import axios from "axios";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

import { useSession } from "@/services/authContext";
import Payment from '../../presentational/Payment';
import baseStyles from "@/presentational/BaseStyles";
import EmptyList from "@/presentational/EmptyList";
import MiniBalanceCard from "@/presentational/MiniBalanceCard";

export default function Home() {
  const [balancePayments, setBalancePayments] = useState([])
  const [promisePayments, setPromisePayments] = useState([])
  const [activeTab, setActiveTab] = useState("Promises");

  const { session } = useSession();

  const fetchPayments = async () => {
    axios.get(`${process.env.EXPO_PUBLIC_API}/payments/friends_payments`, session)
      .then((response) => {
        console.log(response)
        setBalancePayments(response.data.balance)
        setPromisePayments(response.data.promise)
      })
      .catch((error) => {
        console.log(error);
      })
  }
  
  const renderPayments = (payments) => {
    if (payments.length == 0) return EmptyList("No payments")

    return payments.map(payment => (
      <Payment
        key={payment.id}
        id={payment.id}
        creator={payment.creator_id}
        method='Cash'
        date={payment.created_at}
        amount={payment.amount}
        title={payment.title}
        status={payment.status}
        type={payment.paymentable_type}
        creatorName={payment.creator_name}
        paymentable_id={payment.paymentable_id}
        parentTitle={payment.parent_title}
      />
    ))
  }

  useEffect(() => {
    fetchPayments();
  }, []);

  return (
    <View style={baseStyles.viewContainerFull}>
      <View style={{ flex: 1 }}>
        <Text style={[baseStyles.label14, {fontWeight: 600}]}>Recent Balances</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <MiniBalanceCard key='1' id={'1'} total={400} name={'Javi'} members={3} myTotal={200}></MiniBalanceCard>
          <MiniBalanceCard key='2' id={'2'} total={400} name={'Javi'} members={3} myTotal={200}></MiniBalanceCard>
          <MiniBalanceCard key='3' id={'3'} total={400} name={'Javi'} members={3} myTotal={200}></MiniBalanceCard>
        </ScrollView>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={[baseStyles.label14, {fontWeight: 600}]}>Recent Promises</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <MiniBalanceCard key='1' id={'1'} total={400} name={'Javi'} members={3} myTotal={200}></MiniBalanceCard>
          <MiniBalanceCard key='2' id={'2'} total={400} name={'Javi'} members={3} myTotal={200}></MiniBalanceCard>
          <MiniBalanceCard key='3' id={'3'} total={400} name={'Javi'} members={3} myTotal={200}></MiniBalanceCard>
        </ScrollView>
      </View>
      <View style={{ flex: 4.5 }}>
        <Text style={[baseStyles.label14, {fontWeight: 600}]}>Recent Payments</Text>
        <View style={baseStyles.viewRowWithSpace}>
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

        <ScrollView>
          {activeTab === "Promises" ? renderPayments(promisePayments) : renderPayments(balancePayments)}
        </ScrollView>
      </View>
    </View>
  );
}