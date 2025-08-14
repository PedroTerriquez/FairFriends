import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { Pressable, RefreshControl, ScrollView, TouchableOpacity, Text } from "react-native";

import { useSession } from "@/services/authContext";
import BalanceCard from '../../presentational/BalanceCard';
import baseStyles from "@/presentational/BaseStyles";
import EmptyList from "@/presentational/EmptyList";
import { router, useFocusEffect } from "expo-router";
import FloatingButton from "@/presentational/FloatingButton";
import Spinner from "@/presentational/Spinner";

export default function Balances() {
  const [balances, setBalances] = useState([])
  const { session } = useSession();
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchBalances = async () => {
    setLoading(true);
    setRefreshing(true);
    axios.get(`${process.env.EXPO_PUBLIC_API}/balances`, session)
      .then((response) => {
        setBalances(response.data);
      })
      .catch((error) => {
      })
      .finally(() => {
        setRefreshing(false);
        setLoading(false);
      });
  }
  
  const renderBalances = () => {
    if (balances.length == 0) return (<EmptyList text="No balances">
      <Text style={baseStyles.label17}>Try adding some {''}
        <Pressable onPress={() => { router.push("/formBalance") }}>
          <Text style={[baseStyles.boldText, baseStyles.link]}>balances</Text>
        </Pressable>
      </Text>
    </EmptyList>
    )

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

  if (loading) return <Spinner />;

  return (
    <>
      <ScrollView contentContainerStyle={baseStyles.viewContainerFull} refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={fetchBalances} />
      }>
        {renderBalances()}
      </ScrollView>
      <FloatingButton icon="add" action={() => { router.push({ pathname: "/formBalance" }) }} />
    </>
  );
}