import { getBalances } from "@/services/api";
import { useCallback, useEffect, useState } from "react";
import { Pressable, RefreshControl, ScrollView, Text, View } from "react-native";

import BalanceCard from '../../presentational/BalanceCard';
import baseStyles from "@/presentational/BaseStyles";
import EmptyList from "@/presentational/EmptyList";
import { router, useFocusEffect } from "expo-router";
import FloatingButton from "@/presentational/FloatingButton";
import SkeletonWrapper from "@/presentational/SkeletonWrapper";
import { useServer } from "@/services/serverContext";

export default function Balances() {
  const [balances, setBalances] = useState([])
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const { serverReady } = useServer();

  const fetchBalances = async () => {
    setLoading(true);
    setRefreshing(true);
    getBalances()
      .then((response) => {
        setBalances(response.data);
        setLoading(false);
      })
      .catch((error) => {
      })
      .finally(() => {
        setRefreshing(false);
      });
  }

  const emptyList = (
    <EmptyList text="No balances">
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center' }}>
        <Text style={baseStyles.label17}>Try adding some </Text>
        <Pressable onPress={() => { router.push("/formBalance") }}>
          <Text style={[baseStyles.title17, baseStyles.boldText, baseStyles.link]}>balances</Text>
        </Pressable>
      </View>
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

  const renderSkeletons = () => {
    let skeletons = [];
    for (let i = 0; i < 10; i++) {
      skeletons.push(
        <SkeletonWrapper key={i}>
          <View style={[baseStyles.card, { height: 200 }]} />
        </SkeletonWrapper>
      );
    }
    return <View style={{ gap: 5 }}>{skeletons}</View>;
  }

  useFocusEffect(
    useCallback(() => {
      fetchBalances();
    }, [])
  );

  useEffect(() => {
    if (serverReady) {
      fetchBalances();
    }
  }, [serverReady]);

  return (
    <View style={baseStyles.viewContainerFull} >
      <ScrollView contentContainerStyle={{flexGrow: 1}} refreshControl={ <RefreshControl refreshing={refreshing} onRefresh={fetchBalances} /> }>
        { loading ? renderSkeletons() : renderBalances()}
      </ScrollView>
      <FloatingButton icon="add" action={() => { router.push({ pathname: "/formBalance" }) }} />
    </View>
  );
}