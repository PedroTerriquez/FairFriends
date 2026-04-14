import { getBalances } from "@/services/api";
import { useCallback, useEffect, useState } from "react";
import { FlatList, Pressable, RefreshControl, Text, View } from "react-native";

import BalanceCard from '../../presentational/BalanceCard';
import baseStyles from "@/presentational/BaseStyles";
import EmptyList from "@/presentational/EmptyList";
import { router, useFocusEffect } from "expo-router";
import FloatingButton from "@/presentational/FloatingButton";
import SkeletonWrapper from "@/presentational/SkeletonWrapper";
import { useServer } from "@/services/serverContext";
import { useTranslation } from "react-i18next";

export default function Balances() {
  const { t } = useTranslation();
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

  // FlatList render callbacks - memoized for performance
  const renderBalanceItem = useCallback(({ item }) => (
    <BalanceCard
      id={item.id}
      total={item.total}
      name={item.name}
      status={item.status}
      members={item.balance_members}
      myTotal={item.my_total}
      budget={item.budget}
    />
  ), []);

  const keyExtractor = useCallback((item) => item.id.toString(), []);

  // Optimize rendering for fixed-height items
  // BalanceCard height is approximately 200px + 10px margin = 210px
  const getItemLayout = useCallback((data, index) => ({
    length: 210,
    offset: 210 * index,
    index,
  }), []);

  const renderEmptyBalances = () => (
    <EmptyList text={t("balancesIndex.no_balances")}>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center' }}>
        <Text style={baseStyles.label17}>{t("balancesIndex.start_balance")}</Text>
        <Pressable onPress={() => { router.push("/formBalance") }}>
          <Text style={[baseStyles.title17, baseStyles.boldText, baseStyles.link]}>{t("balancesIndex.balances")}</Text>
        </Pressable>
      </View>
    </EmptyList>
  )

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
      <FlatList
        data={loading ? [] : balances}
        renderItem={renderBalanceItem}
        keyExtractor={keyExtractor}
        getItemLayout={getItemLayout}
        ListEmptyComponent={loading ? renderSkeletons() : renderEmptyBalances()}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={fetchBalances} />}
        contentContainerStyle={{ flexGrow: 1 }}
        // Performance optimizations
        maxToRenderPerBatch={6}
        windowSize={5}
        removeClippedSubviews={true}
        initialNumToRender={10}
      />
      <FloatingButton testID="balances-fab-new" icon="add" action={() => { router.push({ pathname: "/formBalance" }) }} />
    </View>
  );
}