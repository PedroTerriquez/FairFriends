import { getHome } from "@/services/api";
import React, { useCallback, useEffect, useState } from "react";
import { Alert, FlatList, Platform, Pressable, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useSession } from "@/services/authContext";
import { useRouter } from 'expo-router';
import { useServer } from "@/services/serverContext";
import { Ionicons } from "@expo/vector-icons";

import Payment from '@/presentational/PaymentCard';
import baseStyles from "@/presentational/BaseStyles";
import EmptyList from "@/presentational/EmptyList";
import MiniPromiseCard from "@/presentational/MiniPromiseCard";
import NotificationBanner from "@/presentational/NotificationBanner";
import SegmentedControl from "@/presentational/SegmentedControl";
import ServerReconnectBar from "@/presentational/ServerReconnectBar";
import SkeletonWrapper from "@/presentational/SkeletonWrapper";

import { useTranslation } from 'react-i18next'
import { colors, spacing, typography } from '@/theme';

export default function Home() {
  const { t } = useTranslation();
  //const [balances, setBalances] = useState([]);
  const [promises, setPromises] = useState([]);
  const [balancePayments, setBalancePayments] = useState([]);
  const [promisePayments, setPromisePayments] = useState([]);
  const [notificationsQuantity, setNotificationsQuantity] = useState(null);
  const [activeTab, setActiveTab] = useState('Promises');
  const [loading, setLoading] = useState(false);
  const { user, signOut } = useSession()!;
  const { serverReady, serverLoading } = useServer() as any;

  const router = useRouter();

  const handleLogout = () => {
    const title = t('profile.logout') || 'Log out';
    const message = t('confirmLogout') || 'Are you sure you want to log out?';

    if (Platform.OS === 'web') {
      if (typeof window !== 'undefined' && window.confirm(message)) {
        signOut();
      }
      return;
    }

    Alert.alert(
      title,
      message,
      [
        { text: t('cancel') || 'Cancel', style: 'cancel' },
        {
          text: title,
          style: 'destructive',
          onPress: () => { signOut(); },
        },
      ]
    );
  };

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const response = await getHome();
      if (response?.data) {
        //setBalances(response.data.balances);
        setPromises(response.data.promises);
        setBalancePayments(response.data.balance_payments);
        setPromisePayments(response.data.promise_payments);
        setNotificationsQuantity(response.data.notifications.quantity);
        if (response.data.promises.length === 0) {
          setActiveTab("balances");
        } else {
          setActiveTab("promises");
        }
        setLoading(false);
      }
    } finally {
    }
  };

  // FlatList render callbacks for payments - memoized for performance
  const renderPaymentItem = useCallback(({ item }) => (
    <Payment
      id={item.id}
      amount={item.amount}
      creatorName={item.creator_name}
      date={item.created_at}
      paymentableId={item.paymentable_id}
      paymentableType={item.paymentable_type}
      parentTitle={item.parent_title}
      status={item.status}
      title={item.title}
      category={item.category}
    />
  ), []);

  const paymentKeyExtractor = useCallback((item) => item.id.toString(), []);

  // Optimize rendering for fixed-height items (Payment ~80px)
  const getPaymentItemLayout = useCallback((data, index) => ({
    length: 90,
    offset: 90 * index,
    index,
  }), []);

  // Horizontal FlatList callbacks for mini cards
  const renderMiniPromiseItem = useCallback(({ item }) => (
    <MiniPromiseCard
      id={item.id}
      paidAmount={item.paid_amount}
      total={item.total}
      name={item.administrator_name}
      description={item.title || "Payment agreement"}
    />
  ), []);

  const miniCardKeyExtractor = useCallback((item) => item.id.toString(), []);

  const renderEmptyPayments = () => (
    <EmptyList text="No payments">
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center' }}>
        <Text style={[baseStyles.label17]}>Start a </Text>
        <Pressable onPress={() => { router.push("/contacts"); }}>
          <Text style={[baseStyles.link, baseStyles.label17]}>Promise</Text>
        </Pressable>
        <Text style={[baseStyles.label17]}>, or create a new </Text>
        <Pressable onPress={() => { router.push("/formBalance"); }}>
          <Text style={[baseStyles.link, baseStyles.label17]}>Balance</Text>
        </Pressable>
      </View>
    </EmptyList>
  );

  // Get current payments based on active tab
  const currentPayments = activeTab === "promises" ? promisePayments : balancePayments;

  // Calculate pending actions count (payments + promises + notifications)
  const pendingActionsCount = notificationsQuantity || 0;

  const renderPaymentSkeleton = useCallback(({ item }) => (
    <SkeletonWrapper>
      <View style={[baseStyles.card, { height: 80, marginBottom: 10 }]} />
    </SkeletonWrapper>
  ), []);

  const skeletonData = Array.from({ length: 4 }, (_, i) => ({ id: i.toString() }));
  const skeletonKeyExtractor = useCallback((item) => item.id, []);

  useEffect(() => {
    if (serverReady) {
      fetchPayments();
    }
  }, [serverReady]);

  useEffect(() => {
    if (router?.pathname) {
      router.replace(router.pathname);
    }
    fetchPayments();
  }, []);

  return (
    <View style={[baseStyles.viewContainerFull, { gap: 15 }]}>
      {!serverReady && (
        <ServerReconnectBar serverReady={serverReady} serverLoading={serverLoading} />
      )}
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md }}>
          <Text style={{ ...typography.h3 }}>Home</Text>
          <TouchableOpacity onPress={handleLogout} style={{ padding: spacing.sm }}>
            <Ionicons name="log-out" size={24} color={colors.text.primary} />
          </TouchableOpacity>
        </View>
        <NotificationBanner
          quantity={notificationsQuantity}
          loading={loading}
          onPress={() => router.push("/notifications")}
        />
        { /* Active Promises Section */ }
        {promises.length > 0 && (
          <View>
            <View style={[baseStyles.rowSpaceBetween, { marginBottom: spacing.sm, marginTop: spacing.lg }]}>
              <Text style={{ ...typography.h4 }}>Active Promises</Text>
              <TouchableOpacity onPress={() => router.push({ pathname: '/promisesIndex' })}>
                <Text style={{ ...typography.body, color: colors.primary }}>View all</Text>
              </TouchableOpacity>
            </View>
            <View style={{ height: 140 }}>
              <FlatList
                horizontal
                data={promises}
                renderItem={renderMiniPromiseItem}
                keyExtractor={miniCardKeyExtractor}
                showsHorizontalScrollIndicator={false}
                maxToRenderPerBatch={3}
                windowSize={3}
              />
            </View>
          </View>
        )}
        { /* Activity Section */}
        <View style={{ flex: 1 }}>
          <View style={{ flex: 1, marginTop: spacing.xl }}>
            <View style={{ marginBottom: spacing.md }}>
              <SegmentedControl
                segments={[
                  { key: "promises", label: "Promises" },
                  { key: "balances", label: "Balances" },
                ]}
                selectedKey={activeTab}
                onSelect={setActiveTab}
              />
            </View>
            <FlatList
              data={loading ? skeletonData : currentPayments}
              renderItem={loading ? renderPaymentSkeleton : renderPaymentItem}
              keyExtractor={loading ? skeletonKeyExtractor : paymentKeyExtractor}
              getItemLayout={loading ? undefined : getPaymentItemLayout}
              ListEmptyComponent={renderEmptyPayments()}
              contentContainerStyle={{ flexGrow: 1 }}
              maxToRenderPerBatch={8}
              windowSize={5}
              removeClippedSubviews={true}
              initialNumToRender={10}
            />
          </View>
        </View>
      </ScrollView >
    </View >
  );
};