import { getPromises } from "@/services/api";
import { useCallback, useEffect, useState } from "react";
import { Pressable, RefreshControl, ScrollView, Text, View } from "react-native";

import PromiseCard from '../../presentational/PromiseCard';
import baseStyles from "@/presentational/BaseStyles";
import EmptyList from "@/presentational/EmptyList";
import { router, useFocusEffect } from "expo-router";
import TopNavBar from "@/presentational/TopNavBar";
import SkeletonWrapper from "@/presentational/SkeletonWrapper";
import { useServer } from "@/services/serverContext";

export default function Promises() {
  const [receiving , setReceiving] = useState([])
  const [paying, setPaying] = useState([])
  const [activeTab, setActiveTab] = useState("Receiving");
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const { serverReady } = useServer();

  const fetchPromises = async () => {
    setLoading(true);
    setRefreshing(true);
    getPromises()
      .then((response) => {
        setReceiving(response.data.receivable_promises)
        setPaying(response.data.payable_promises)
        setLoading(false);
      })
      .catch((error) => {
      })
      .finally(() => {
        setRefreshing(false);
      });
  }

  const emptyPromises = <EmptyList text="No promises">
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center' }}>
      <Text style={baseStyles.label17}>Start a promises with your </Text>
      <Pressable onPress={() => { router.push("/contacts") }}>
        <Text style={[baseStyles.label17, baseStyles.boldText, baseStyles.link]}>contacts</Text>
      </Pressable>
    </View>
  </EmptyList>
  
  const renderPromises = (promises) => {
    if (promises.length === 0) return emptyPromises;

    return promises.map(promise => (
      <PromiseCard
            id={promise.id}
            key={promise.id}
            title={promise.title}
            paid_amount={promise.paid_amount}
            total={promise.total}
            percentage={promise.percentage}
            user={promise.user}
            status={promise.status}
            interest={promise.interest || 0}
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
      fetchPromises();
    }, [])
  );

  useEffect(() => {
    if (serverReady) {
      fetchPromises();
    }
  }, [serverReady]);

  return (
    <View style={baseStyles.viewContainerFull}>
      <TopNavBar menus={["Receiving", "Paying"]} setActiveTab={setActiveTab} activeTab={activeTab} />
      <ScrollView contentContainerStyle={{flexGrow: 1}} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={fetchPromises} />}>
        {loading ? renderSkeletons() : activeTab === "Receiving" ? renderPromises(receiving) : renderPromises(paying)}
      </ScrollView>
    </View>
  );
}