import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { ScrollView, TouchableOpacity, View, Text } from "react-native";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import baseStyles from '@/presentational/BaseStyles' 
import { useSession } from "@/services/authContext";
import Payment from '../presentational/Payment';
import BalanceCard from '../presentational/BalanceCard';
import EmptyList from "@/presentational/EmptyList";

export default function Balance() {
    const [payments, setPayments] = useState([])
    const [balance, setBalance] = useState(null)
    const { paymentable_id } = useLocalSearchParams();
    const { session } = useSession();
    const router = useRouter();

    const fetchBalance = async () => {
      if (!session) return;
      
      try {
        const response = await axios.get(`${process.env.EXPO_PUBLIC_API}/balances/${paymentable_id}`, session);
        setPayments(response.data.payments)
        setBalance(response.data.balance)
      } catch (error) {
        console.log(error);
      }
    }

    const renderPayments = () => {
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
                mine={balance.admin ? false : true}
            />
        ))
    }

    useFocusEffect(
        useCallback(() => {
            fetchBalance();
        }, [paymentable_id])
    );

    return (
      <ScrollView style={[baseStyles.viewContainerFull]}>
        { balance && <BalanceCard
          id={balance.id}
          total={balance.total}
          name={balance.name}
          status={balance.status}
          members={balance.balance_members}
          myTotal={balance.my_total}
        /> }
        <View style={[baseStyles.viewRow, baseStyles.paddingVertical10, { justifyContent: "space-between", height: 70 }]}>
          {payments.length > 0 && <Text style={[baseStyles.title15, { marginTop: 10 }]}>Recent Transactions </Text>}
          {balance && balance.status != 'pending' && balance.status != 'close' && <TouchableOpacity
            style={[baseStyles.floatingButton, { backgroundColor: '#007AFF' }]}
            onPress={() => {
              if (balance) {
                router.push({
                  pathname: "/formPayment",
                  params: {
                    paymentable_id: paymentable_id,
                    type: 'Balance',
                    recipient_name: balance.name,
                    recipient_id: balance.id,
                  }
                });
              }
            }}
          >
            <Ionicons name="add" size={32} color="white" />
          </TouchableOpacity>
          }
        </View>
        {renderPayments()}
      </ScrollView>
    )
}