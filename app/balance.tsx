import axios from "axios";
import { useEffect, useState } from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import baseStyles from '@/presentational/BaseStyles' 
import { useSession } from "@/services/authContext";
import Payment from '../presentational/Payment';
import BalanceCard from '../presentational/BalanceCard';

export default function Balance() {
    const [payments, setPayments] = useState([])
    const [balance, setBalance] = useState(null)
    const { paymentable_id } = useLocalSearchParams();
    const { session } = useSession();
    const router = useRouter();

    const fetchPayments = async () => {
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
                mine={payment.mine}
            />
        ))
    }

    useEffect(() => {
        fetchPayments();
    }, [paymentable_id]);

    return (
      <ScrollView>
        { balance && <BalanceCard
          id={balance.id}
          key={balance.id}
          user1={balance.user1_id}
          user2={balance.user2_id}
          name1={balance.user1_name}
          name2={balance.user2_name}
          total1={balance.user1_money}
          total2={balance.user2_money}
          counterpart={balance.counterpart}
          percentage1={balance.percetage1}
          percentage2={balance.percetage2}
        /> }
        <View style={baseStyles.viewContainer}>
          {renderPayments()}
        </View>
        <TouchableOpacity 
          style={[baseStyles.floatingButton, { backgroundColor: '#007AFF' }]} 
          onPress={() => {
            if (balance) {
              router.push({
                pathname: "/formPayment",
                params: { 
                  paymentable_id: paymentable_id, 
                  type: 'Balance', 
                  recipient_name: balance.counterpart,
                  recipient_id: balance.counterpart == balance.user1_name ? balance.user1_id : balance.user2_id
                }
              });
            }
          }}
        >
          <Ionicons name="add" size={32} color="white" />
        </TouchableOpacity>
      </ScrollView>
    )
}