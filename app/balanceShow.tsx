import { useCallback, useState } from "react";
import { FlatList, View, Text, RefreshControl, TouchableOpacity, Linking } from "react-native";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { getBalanceDetail, getBalanceInfo } from "@/services/api";
import { useTranslation } from 'react-i18next';
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import { useToast } from "@/services/ToastContext";

import baseStyles from '@/presentational/BaseStyles'
import Payment from '../presentational/PaymentCard';
import UnevenPaymentCard from '../presentational/UnevenPaymentCard';
import BalanceCard from '../presentational/BalanceCard';
import Spinner from "@/presentational/Spinner";
import EmptyList from "@/presentational/EmptyList";
import ModalInfoSplit from "@/presentational/ModalSplitInfo";
import ModalItinerary from "@/presentational/ModalItinerary";
import SegmentedControl from "@/presentational/SegmentedControl";
import BudgetTracking from "@/presentational/BudgetTracking";
import InsightCard from "@/presentational/InsightCard";
import FloatingButton from "@/presentational/FloatingButton";
import { colors, spacing, typography } from '@/theme';
import {
  calculateFairnessInsight,
  isBalanceFair,
  calculatePaceInsight,
  calculateSettlements
} from '@/services/balanceIntelligence';
import formatMoney from '@/services/formatMoney';

const WHATSAPP_NUMBER = '15556284318';

export default function Balance() {
  const { t } = useTranslation();
  const { showToast } = useToast();
  const [payments, setPayments] = useState([]);
  const [uneven, setUneven] = useState([]);
  const [balance, setBalance] = useState(null);
  const [balanceSplitted, setBalanceSplitted] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showSplit, setShowSplit] = useState(false);
  const [showItinerary, setShowItinerary] = useState(false);
  const [activeTab, setActiveTab] = useState( "payments");
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const payable = balance && balance.status === 'active';

  const openWhatsApp = async () => {
    if (!balance) return;
    const text = encodeURIComponent(String(balance.id));
    const appUrl = `whatsapp://send?phone=${WHATSAPP_NUMBER}&text=${text}`;
    const webUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
    try {
      if (await Linking.canOpenURL(appUrl)) {
        await Linking.openURL(appUrl);
        return;
      }
      if (await Linking.canOpenURL(webUrl)) {
        await Linking.openURL(webUrl);
        return;
      }
      showToast(t('balance.whatsapp_unavailable'), 'error');
    } catch (e) {
      showToast(t('balance.whatsapp_unavailable'), 'error');
    }
  };

  const fetchBalance = async () => {
    setLoading(true);
    setRefreshing(true);
    getBalanceDetail(id)
      .then((response) => {
        setPayments(response.data.payments);
        setUneven(response.data.uneven_payments);
        setBalance(response.data.balance);
      })
      .catch((error) => {
      })
      .finally(() => {
        setRefreshing(false);
        setLoading(false);
      });
  };

  const fetchInfo = async () => {
    getBalanceInfo(id)
      .then((response) => {
        setBalanceSplitted(response.data);
      })
      .catch((error) => {
      });
  };

  const membersAsString = () => {
    return JSON.stringify(balance.balance_members.map(member => {
      return {
        id: member.user_id,
        name: member.name,
      };
    }));
  }

  const handleAcceptPayment = (data) => {
    setBalance((prevBalance) => {
      if (!prevBalance) return prevBalance;

      const updatedBalanceMembers = prevBalance.balance_members.map((member) => {
        if (member.user_id === data.creator_id) {
          return {
            ...member,
            money: member.money + data.amount,
          };
        }
        return member;
      });

      return {
        ...prevBalance,
        total: prevBalance.total + data.amount,
        balance_members: updatedBalanceMembers,
      };
    });
  }

  const formPaymentParams = () => {
    return {
      paymentable_id: id,
      type: 'Balance',
      recipient_name: balance.name,
      recipient_id: balance.creator_id,
      members: membersAsString(),
      admin: balance.admin
    }
  }

  // FlatList render callbacks - memoized for performance
  const renderPaymentItem = useCallback(({ item }) => (
    <Payment
      id={item.id}
      admin={balance?.admin}
      amount={item.amount}
      canEdit={balance?.admin || item.mine}
      category={item.category}
      creatorName={item.creator_name}
      date={item.created_at}
      members={membersAsString()}
      paymentableId={item.paymentable_id}
      paymentableType={item.paymentable_type}
      parentTitle={item.parent_title}
      promises={item?.promises}
      status={item.status}
      title={item.title}
      location={item.location}
      image={item.image}
      handleAccept={handleAcceptPayment}
    />
  ), [balance, handleAcceptPayment]);

  const renderUnevenPaymentItem = useCallback(({ item }) => (
    <UnevenPaymentCard
      id={item.id}
      title={item.title}
      amount={item.amount}
      creatorName={item.creator_name}
      mine={item.mine}
      date={item.created_at}
      category={item.category}
      promises={item.promises}
    />
  ), []);

  const paymentKeyExtractor = useCallback((item) => item.id.toString(), []);

  // Optimize rendering for fixed-height items (Payment ~100px)
  const getPaymentItemLayout = useCallback((data, index) => ({
    length: 110,
    offset: 110 * index,
    index,
  }), []);

  const renderEmptyPayments = () => (
    <EmptyList text={t('balance.no_payments_yet')}>
      <Text>{t('balance.start_adding_payment')}</Text>
    </EmptyList>
  );

  // Get current payments based on active tab
  const currentPayments = activeTab === "payments" ? payments : uneven;

  // FlatList header with balance card and buttons
  const renderListHeader = () => {
    // Calculate Balance Intelligence insights
    const fairnessInsight = calculateFairnessInsight(balance);
    const isFair = isBalanceFair(balance);
    const settlements = calculateSettlements(balance);
    const paceInsight = calculatePaceInsight(balance); // null if no budget/dates

    return (
      <>
        {showSplit && <ModalInfoSplit visible={showSplit} balanceSplittedInfo={balanceSplitted} onClose={() => setShowSplit(false)} />}

        {balance.admin && (
          <View style={{ alignItems: 'flex-end', paddingHorizontal: spacing.md, paddingTop: spacing.xs }}>
            <TouchableOpacity
              onPress={() => router.push({ pathname: '/formBalance', params: { id: balance.id } })}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons name="pencil" size={20} color={colors.text.secondary} />
            </TouchableOpacity>
          </View>
        )}

        {/* Balance Card */}
        <BalanceCard
          id={balance.id}
          total={balance.total}
          name={balance.name}
          status={balance.status}
          members={balance.balance_members}
          myTotal={balance.my_total}
          budget={balance.budget}
        />

        {/* Balance Intelligence Section */}
        <View style={{ paddingTop: spacing.sm }}>
          {/* Positive reinforcement when fair */}
          {isFair && (
            <InsightCard
              type="fairness"
              title={t('balance.all_fair')}
              subtitle={t('balance.all_fair_subtitle')}
              icon="checkmark-circle-outline"
              delay={0}
            />
          )}

          {/* Budget Tracking - Comprehensive display if budget exists */}
          {Number(balance.budget) > 0 && balance.start_date && balance.end_date && (
            <BudgetTracking
              spent={balance.total}
              budget={balance.budget}
              startDate={balance.start_date}
              endDate={balance.end_date}
            />
          )}
          {/* Payments Itinerary */}
          {payments.length > 0 && (
            <ModalItinerary
              payments={payments}
              visible={showItinerary}
              onClose={() => setShowItinerary(false)}
            />
          )}

          {/* Settlement Insight - Tap to see comprehensive breakdown */}
          {settlements.length > 0 && (
            <InsightCard
              type="settlement"
              title={t('balance.close_with_transactions', { count: settlements.length })}
              onPress={() => setShowSplit(true)}
              delay={100}
            >
            </InsightCard>
          )}
        </View>

        {/* Trip Itinerary Button - Prominent */}
        {payments.length > 0 && (
          <TouchableOpacity
            onPress={() => setShowItinerary(true)}
            style={{
              marginHorizontal: spacing.md,
              marginBottom: spacing.md,
              borderRadius: 24,
              padding: spacing.lg,
              backgroundColor: '#F59E0B',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.15,
              shadowRadius: 8,
              elevation: 5,
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
              <View
                style={{
                  width: 56,
                  height: 56,
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  borderRadius: 16,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Ionicons name="time-outline" size={28} color="#FFFFFF" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ ...typography.h4, fontWeight: '700', color: '#FFFFFF', marginBottom: 4 }}>
                  {t('balance.trip_itinerary')}
                </Text>
                <Text style={{ fontSize: 14, color: 'rgba(255, 255, 255, 0.9)' }}>
                  {t('balance.trip_itinerary_subtitle', { count: payments.length })}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        )}

        {/* Trip Highlights Button - Prominent */}
        {balance && (
          <TouchableOpacity
            onPress={() => router.push({ pathname: '/trip-highlights' as any, params: { id: balance.id } as any })}
            style={{
              marginHorizontal: spacing.md,
              marginBottom: spacing.md,
              borderRadius: 24,
              padding: spacing.lg,
              backgroundColor: '#A855F7',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.15,
              shadowRadius: 8,
              elevation: 5,
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
              <View
                style={{
                  width: 56,
                  height: 56,
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  borderRadius: 16,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Ionicons name="sparkles" size={28} color="#FFFFFF" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ ...typography.h4, fontWeight: '700', color: '#FFFFFF', marginBottom: 4 }}>
                  Trip Highlights
                </Text>
                <Text style={{ fontSize: 14, color: 'rgba(255, 255, 255, 0.9)' }}>
                  View shareable stats & insights
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        )}

        {/* WhatsApp CTA - Prominent */}
        {balance && (
          <TouchableOpacity
            onPress={openWhatsApp}
            style={{
              marginHorizontal: spacing.md,
              marginBottom: spacing.md,
              borderRadius: 24,
              padding: spacing.lg,
              backgroundColor: '#25D366',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.15,
              shadowRadius: 8,
              elevation: 5,
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
              <View
                style={{
                  width: 56,
                  height: 56,
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  borderRadius: 16,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <FontAwesome name="whatsapp" size={30} color="#FFFFFF" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ ...typography.h4, fontWeight: '700', color: '#FFFFFF', marginBottom: 4 }}>
                  {t('balance.whatsapp_title')}
                </Text>
                <Text style={{ fontSize: 14, color: 'rgba(255, 255, 255, 0.9)' }}>
                  {t('balance.whatsapp_subtitle', { id: balance.id })}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        )}

        {/* Payments Section */}
        <Text style={{ ...typography.h4, paddingVertical: spacing.md }}>{t('balance.recent_payments')}</Text>
        <View style={{ marginBottom: spacing.md }}>
          <SegmentedControl
            segments={[
              { key: 'payments', label: 'Payments' },
              { key: 'uneven', label: 'Uneven' },
            ]}
            selectedKey={activeTab}
            onSelect={setActiveTab}
          />
        </View>
      </>
    );
  };

  useFocusEffect(
    useCallback(() => {
      fetchBalance();
      fetchInfo();
    }, [id])
  );

  if (loading) return <Spinner />;
  if (!loading && !balance) return (<EmptyList text={t('balance.no_balance_found')}>{null}</EmptyList>)

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={currentPayments}
        renderItem={activeTab === 'uneven' ? renderUnevenPaymentItem : renderPaymentItem}
        keyExtractor={paymentKeyExtractor}
        getItemLayout={activeTab === 'payments' ? getPaymentItemLayout : undefined}
        ListHeaderComponent={renderListHeader}
        ListEmptyComponent={renderEmptyPayments()}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={fetchBalance} />}
        contentContainerStyle={[baseStyles.viewContainerFullScrollable, { flexGrow: 1 }]}
        // Performance optimizations
        maxToRenderPerBatch={8}
        windowSize={5}
        removeClippedSubviews={true}
        initialNumToRender={10}
      />

      {/* FAB - Add Payment */}
      {payable && (
        <FloatingButton
          testID="balance-fab-add-payment"
          icon="add"
          action={() => router.push({ pathname: '/formPayment', params: formPaymentParams() })}
        />
      )}
    </View>
  )
}
