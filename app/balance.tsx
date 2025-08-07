import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { ScrollView, TouchableOpacity, View, Text, RefreshControl, NativeModules } from "react-native";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import baseStyles from '@/presentational/BaseStyles' 
import { useSession } from "@/services/authContext";
import Payment from '../presentational/Payment';
import BalanceCard from '../presentational/BalanceCard';
import EmptyList from "@/presentational/EmptyList";

export default function Balance() {
    const [payments, setPayments] = useState([]);
    const [balance, setBalance] = useState(null);
    const [refreshing, setRefreshing] = useState(false);
    const { id } = useLocalSearchParams();
    const { session } = useSession();
    const router = useRouter();

    const fetchBalance = async () => {
      if (!session) return;
      
      try {
        setRefreshing(true); 
        const response = await axios.get(`${process.env.EXPO_PUBLIC_API}/balances/${id}`, session);
        setPayments(response.data.payments);
        setBalance(response.data.balance);
      } catch (error) {
        console.log(error);
      } finally {
        setRefreshing(false);
      }
    };

    const renderPayments = () => {
        if (payments.length == 0) return

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
        }, [id])
    );

    return (
      <ScrollView
        style={[baseStyles.viewContainerFull]}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={fetchBalance} />
        }
      >
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
                    paymentable_id: id,
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