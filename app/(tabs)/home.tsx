import { getHome } from "@/services/api";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useSession } from "@/services/authContext";
import { useRouter } from 'expo-router';

import Payment from '../../presentational/Payment';
import baseStyles from "@/presentational/BaseStyles";
import EmptyList from "@/presentational/EmptyList";
import MiniBalanceCard from "@/presentational/MiniBalanceCard";
import MiniPromiseCard from "@/presentational/MiniPromiseCard";
import Spinner from '../../presentational/Spinner';
import SubtitleLink from "@/presentational/SubtitleLink";
import TopNavBar from "@/presentational/TopNavBar";

export default function Home() {
  const [balances, setBalances] = useState([]);
  const [promises, setPromises] = useState([]);
  const [balancePayments, setBalancePayments] = useState([]);
  const [promisePayments, setPromisePayments] = useState([]);
  const [activeTab, setActiveTab] = useState('');
  const [loading, setLoading] = useState(false);
  const { signOut } = useSession();
  const router = useRouter();

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const response = await getHome();
      setBalances(response.data.balances);
      setPromises(response.data.promises);
      setBalancePayments(response.data.balance_payments);
      setPromisePayments(response.data.promise_payments);

      if (response.data.promises.length === 0) {
        setActiveTab("Balances");
      } else {
        setActiveTab("Promises");
      }
    } catch {
      signOut();
      router.replace("/");
    } finally {
      setLoading(false);
    }
  };

  const emptyPayments = (
    <EmptyList text="No payments">
      <Text>
        <Text style={[baseStyles.label17]}> Start a {''}</Text>
        <Pressable onPress={() => { router.push("/contacts"); }}>
          <Text style={baseStyles.link}>Promise</Text>
        </Pressable>
        <Text> {', or create a new '} </Text>
        <Pressable onPress={() => { router.push("/formBalance"); }}>
          <Text style={baseStyles.link}>Balance</Text>
        </Pressable>
      </Text>
    </EmptyList>
  );

  const renderPayments = (payments) => {
    if (payments.length === 0) return emptyPayments;

    return payments.map(payment => (
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

  const renderMiniBalanceCards = (balances) => {
    if (balances.length === 0) return;

    return balances.map(balance => (
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
    return promises.map(promise => (
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
    if (router?.pathname) {
      router.replace(router.pathname);
    }
    fetchPayments()
  }, []);

  if (loading) return <Spinner />;

  return (
    <View style={[baseStyles.viewContainerFull, {gap: 15}]}>
      {balances.length > 0 && (
        <View>
          <SubtitleLink text={"Latest Balances"} onPress={() => { router.push("/balances"); }} />
          <View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10 }}>
              {renderMiniBalanceCards(balances)}
            </ScrollView>
          </View>
        </View>
      )}
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
      <View>
        <SubtitleLink text="Recent Payments" onPress={() => { router.push("/promises"); }} />
        <View>
          <TopNavBar menus={['Promises', 'Balances']} activeTab={activeTab} setActiveTab={setActiveTab} />
          <ScrollView>
            {activeTab === "Promises" ? renderPayments(promisePayments) : renderPayments(balancePayments)}
          </ScrollView>
        </View>
      </View>
    </View>
  );
}
