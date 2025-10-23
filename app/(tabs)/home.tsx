import { getHome } from "@/services/api";
import React, { useEffect, useState } from "react";
import { Pressable, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useSession } from "@/services/authContext";
import { useRouter } from 'expo-router';
import { useServer } from "@/services/serverContext";

import Payment from '../../presentational/Payment';
import baseStyles from "@/presentational/BaseStyles";
import EmptyList from "@/presentational/EmptyList";
import MiniBalanceCard from "@/presentational/MiniBalanceCard";
import MiniPromiseCard from "@/presentational/MiniPromiseCard";
import SubtitleLink from "@/presentational/SubtitleLink";
import TopNavBar from "@/presentational/TopNavBar";
import Avatar from "@/presentational/Avatar";
import { Ionicons } from "@expo/vector-icons";
import ServerReconnectBar from "@/presentational/ServerReconnectBar";

import SkeletonWrapper from "@/presentational/SkeletonWrapper";

export default function Home() {
  //const [balances, setBalances] = useState([]);
  const [promises, setPromises] = useState([]);
  const [balancePayments, setBalancePayments] = useState([]);
  const [promisePayments, setPromisePayments] = useState([]);
  const [notificationsQuantity, setNotificationsQuantity] = useState(null);
  const [activeTab, setActiveTab] = useState('Promises');
  const [loading, setLoading] = useState(false);
  const { user } = useSession();
  const { serverReady, serverLoading } = useServer();

  const router = useRouter();

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
          setActiveTab("Balances");
        } else {
          setActiveTab("Promises");
        }
        setLoading(false);
      }
    } finally {
    }
  };

  const emptyPayments = (
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

  const renderPayments = (payments) => {
    if (payments.length === 0) return emptyPayments;

    return payments.map((payment) => (
      <Payment
        key={payment.id}
        id={payment.id}
        amount={payment.amount}
        creatorName={payment.creator_name}
        date={payment.created_at}
        paymentableId={payment.paymentable_id}
        paymentableType={payment.paymentable_type}
        parentTitle={payment.parent_title}
        status={payment.status}
        title={payment.title}
      />
    ));
  };

  const renderSkeleton = () => {
    let skeletons = [];
    for (let i = 0; i < 4; i++) {
      skeletons.push(
        <SkeletonWrapper key={i}>
          <View style={[baseStyles.card, { height: 80, marginBottom: 10 }]} />
        </SkeletonWrapper>
      );
    }
    return <View style={{ flex: 1, gap: 10 }}>{skeletons}</View>;
  };

  const renderMiniBalanceCards = (balances) => {
    if (balances.length === 0) return;

    return balances.map((balance) => (
      <MiniBalanceCard
        key={balance.id}
        id={balance.id}
        total={balance.total}
        name={balance.name}
        members={balance.members}
        myTotal={balance.my_total}
      />
    ));
  };

  const renderMiniPromiseCards = (promises) => {
    if (promises.length === 0) return;
    return promises.map((promise) => (
      <MiniPromiseCard
        key={promise.id}
        id={promise.id}
        paidAmount={promise.paid_amount}
        total={promise.total}
        name={promise.administrator_name}
      />
    ));
  };

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
        { /* Header Section */ }
        <View style={[baseStyles.card, baseStyles.rowSpaceBetween]}>
          <View style={[baseStyles.rowCenter, {  gap: 10 }]}>
              <TouchableOpacity
                onPressIn={() => router.push('/profile')}
              >
                 <SkeletonWrapper show={loading}>
                  <Avatar name={user?.first_name || "User"} size={50} />
                </SkeletonWrapper>
              </TouchableOpacity>
            <View style={{ gap: 5 }}>
              <SkeletonWrapper show={loading}>
              <Text style={[baseStyles.textGray]}>Welcome Back</Text>
              </SkeletonWrapper>
              <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 5 }}>
              <SkeletonWrapper show={loading}>
                <Text>Hello</Text>
              </SkeletonWrapper>
              <SkeletonWrapper show={loading}>
                <Text style={baseStyles.title15}>{user?.first_name || "User"}</Text>
              </SkeletonWrapper>
              </View>
            </View>
          </View>
            <View style={[baseStyles.rowCenter, { gap: 10, paddingVertical: 10 }]}>
            <TouchableOpacity
              onPressIn={() => router.push('/notifications')}
              style={{}}
            >
              <View style={{  marginRight: 10 }}>
                <Ionicons name="notifications" size={24} color="black" />
                      <Text
                        style={[
                          baseStyles.quantityBadge,
                          baseStyles.warningBG,
                          {
                            position: 'fixed',
                            top: -30,
                            right: -18,
                          },
                        ]}
                      >
                        {notificationsQuantity || ''}
                      </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
        { /* Promises Section */ }
        {promises.length > 0 && (
          <View>
            <SubtitleLink text="Payables Promises" onPress={() => { router.push("/promises"); }} />
            <View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10 }}>
                {renderMiniPromiseCards(promises)}
              </ScrollView>
            </View>
          </View>
        )}
        { /* Payments Section */}
        <View style={{ flex: 1 }}>
          <SubtitleLink text="Recent Payments" onPress={() => { router.push("/promises"); }} />
          <View style={{ flex: 1 }}>
            <View style={{ margin: 5 }}>
              <TopNavBar menus={["Promises", "Balances"]} activeTab={activeTab} setActiveTab={setActiveTab} />
            </View>
            { loading ? renderSkeleton() : activeTab === "Promises" ? renderPayments(promisePayments) : renderPayments(balancePayments)}
          </View>
        </View>
      </ScrollView >
    </View >
  );
};