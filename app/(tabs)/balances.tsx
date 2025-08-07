import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { RefreshControl, ScrollView, TouchableOpacity } from "react-native";

import { useSession } from "@/services/authContext";
import BalanceCard from '../../presentational/BalanceCard';
import baseStyles from "@/presentational/BaseStyles";
import EmptyList from "@/presentational/EmptyList";
import { router, useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function Balances() {
  const [balances, setBalances] = useState([])
  const { session } = useSession();
  const [refreshing, setRefreshing] = useState(false);

  const fetchBalances = async () => {
    setRefreshing(true);
    axios.get(`${process.env.EXPO_PUBLIC_API}/balances`, session)
      .then((response) => {
        console.log(response);
        setBalances(response.data);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setRefreshing(false);
      });
  }
  
  const renderBalances = () => {
    if (balances.length == 0) return EmptyList("No balances")

    return balances.map(balance => (
      <BalanceCard
            key={balance.id}
            id={balance.id}
            total={balance.total}
            name={balance.name}
            status={balance.status}
            members={balance.balance_members}
            myTotal={balance.my_total}
      />
    ))
  }

  useFocusEffect(
    useCallback(() => {
      fetchBalances();
    }, [])
  );

  return (
    <>
      <ScrollView style={baseStyles.viewContainerFull} refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={fetchBalances}
        />
      }>
        {renderBalances()}
      </ScrollView>
      <TouchableOpacity style={[baseStyles.floatingButton, { position: 'absolute', bottom: 16, right: 16 }]}
        onPress={() => { router.push({ pathname: "/formBalance" }) }}>
        <Ionicons name="add" size={32} color="white" />
      </TouchableOpacity>
    </>
  );
}