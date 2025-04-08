import axios from "axios";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

import { useSession } from "@/services/authContext";
import Payment from '../../presentational/Payment';
import baseStyles from "@/presentational/BaseStyles";

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
    if (payments.length == 0) return

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
    <View style={baseStyles.viewContainer}>
      <View style={baseStyles.viewBackground}>
        <Pressable onPress={() => setActiveTab("Promises")}>
          <Text style={{ fontWeight: activeTab === "Promises" ? "bold" : "normal" }}>Promises</Text>
        </Pressable>
        <Pressable onPress={() => setActiveTab("Balances")}>
          <Text style={{ fontWeight: activeTab === "Balances" ? "bold" : "normal" }}>Balances</Text>
        </Pressable>
      </View>

      <ScrollView>
        {activeTab === "Promises" ? renderPayments(promisePayments) : renderPayments(balancePayments)}
      </ScrollView>
    </View>
  );
}