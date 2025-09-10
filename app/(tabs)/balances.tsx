import { getBalances } from "@/services/api";
import { useCallback, useState } from "react";
import { Pressable, RefreshControl, ScrollView, Text, View } from "react-native";

import BalanceCard from '../../presentational/BalanceCard';
import baseStyles from "@/presentational/BaseStyles";
import EmptyList from "@/presentational/EmptyList";
import { router, useFocusEffect } from "expo-router";
import FloatingButton from "@/presentational/FloatingButton";
import Spinner from "@/presentational/Spinner";

export default function Balances() {
  const [balances, setBalances] = useState([])
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchBalances = async () => {
    setLoading(true);
    setRefreshing(true);
    getBalances()
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

  const emptyList = (
    <EmptyList text="No balances">
      <Text style={baseStyles.label17}>Try adding some {''}
        <Pressable onPress={() => { router.push("/formBalance") }}>
          <Text style={[baseStyles.boldText, baseStyles.link]}>balances</Text>
        </Pressable>
      </Text>
    </EmptyList>
  )
  
  const renderBalances = () => {
    if (balances.length == 0) return emptyList

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
    <View style={baseStyles.viewContainerFull} >
      <ScrollView refreshControl={ <RefreshControl refreshing={refreshing} onRefresh={fetchBalances} /> }>
        {renderBalances()}
      </ScrollView>
      <FloatingButton icon="add" action={() => { router.push({ pathname: "/formBalance" }) }} />
    </View>
  );
}