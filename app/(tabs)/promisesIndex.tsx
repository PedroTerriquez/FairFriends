import { getPromises } from "@/services/api";
import { useCallback, useEffect, useState } from "react";
import { FlatList, Pressable, RefreshControl, Text, View } from "react-native";

import PromiseCard from '../../presentational/PromiseCard';
import baseStyles from "@/presentational/BaseStyles";
import EmptyList from "@/presentational/EmptyList";
import { router, useFocusEffect } from "expo-router";
import SegmentedControl from "@/presentational/SegmentedControl";
import SkeletonWrapper from "@/presentational/SkeletonWrapper";
import { useServer } from "@/services/serverContext";
import { useTranslation } from 'react-i18next';
import { spacing } from '@/theme';
import FloatingButton from "@/presentational/FloatingButton";

export default function Promises() {
  const { t } = useTranslation();
  const [receiving , setReceiving] = useState([])
  const [paying, setPaying] = useState([])
  const [activeTab, setActiveTab] = useState("receiving");
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

  // FlatList render callbacks - memoized for performance
  const renderPromiseItem = useCallback(({ item }) => (
    <PromiseCard
      id={item.id}
      title={item.title}
      paid_amount={item.paid_amount}
      total={item.total}
      percentage={item.percentage}
      user={item.user}
      status={item.status}
      interest={item.interest || 0}
    />
  ), []);

  const keyExtractor = useCallback((item) => item.id.toString(), []);

  // Optimize rendering for fixed-height items
  // PromiseCard height is approximately 200px + 10px margin = 210px
  const getItemLayout = useCallback((data, index) => ({
    length: 210,
    offset: 210 * index,
    index,
  }), []);

  const renderEmptyPromises = () => (
    <EmptyList text={t("promisesIndex.no_promises")}>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center' }}>
        <Text style={baseStyles.label17}>{t('promisesIndex.start_promise')}</Text>
        <Pressable onPress={() => { router.push("/contacts") }}>
          <Text style={[baseStyles.label17, baseStyles.boldText, baseStyles.link]}>{t('contacts')}</Text>
        </Pressable>
      </View>
    </EmptyList>
  );

  // Get current promises based on active tab
  const currentPromises = activeTab === "receiving" ? receiving : paying;

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
      <View style={{ paddingVertical: spacing.md }}>
        <SegmentedControl
          segments={[
            { key: "receiving", label: "Receiving" },
            { key: "paying", label: "Paying" },
          ]}
          selectedKey={activeTab}
          onSelect={setActiveTab}
        />
      </View>
      <FlatList
        data={loading ? [] : currentPromises}
        renderItem={renderPromiseItem}
        keyExtractor={keyExtractor}
        getItemLayout={getItemLayout}
        ListEmptyComponent={loading ? renderSkeletons() : renderEmptyPromises()}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={fetchPromises} />}
        contentContainerStyle={{ flexGrow: 1 }}
        // Performance optimizations
        maxToRenderPerBatch={6}
        windowSize={5}
        removeClippedSubviews={true}
        initialNumToRender={10}
      />
      <FloatingButton testID="promises-fab-new" icon="add" action={() => { router.push({ pathname: "/formPromise" }) }} />
    </View>
  );
}