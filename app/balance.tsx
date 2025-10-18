import { useCallback, useState } from "react";
import { ScrollView, View, Text, RefreshControl } from "react-native";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { getBalanceDetail, getBalanceInfo } from "@/services/api";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

import baseStyles from '@/presentational/BaseStyles'
import Payment from '../presentational/Payment';
import BalanceCard from '../presentational/BalanceCard';
import Spinner from "@/presentational/Spinner";
import EmptyList from "@/presentational/EmptyList";
import ModalInfoSplit from "@/presentational/ModalSplitInfo";
import ButtonWithIcon from "@/presentational/ButtonWithIcon";
import TopNavBar from "@/presentational/TopNavBar";

export default function Balance() {
  const [payments, setPayments] = useState([]);
  const [uneven, setUneven] = useState([]);
  const [balance, setBalance] = useState(null);
  const [balanceSplitted, setBalanceSplitted] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showSplit, setShowSplit] = useState(false);
  const [activeTab, setActiveTab] = useState( "Payments");
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const payable = balance && balance.status === 'active';

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

  const renderBalanceCardFooter = () => {
    return (
      <View style={[baseStyles.card, baseStyles.rowCenter]}>
        <ButtonWithIcon
          style={{ flex: 1 }}
          textStyle={baseStyles.textLightBlack}
          onPress={() => setShowSplit(true)}
          text='Close Balance'
          icon={<Ionicons name="close-sharp" size={20} color="#4b4b4bff" />}
        />
        {
          balance?.status === 'active' && <ButtonWithIcon
            style={{ flex: 1, borderRadius: 0, borderRightWidth: 0.5, borderLeftWidth: 0.5, borderColor: "#d3d3d3" }}
            textStyle={baseStyles.textLightBlack}
            onPress={() => {
              if (balance) {
                router.push({
                  pathname: "/formUnevenPayment",
                  params: formPaymentParams()
                });
              }
            }}
            text='Uneven Pay'
            icon={<MaterialIcons name="call-split" size={20} color="#4b4b4bff" />}
          />
        }
        {
          payable && <ButtonWithIcon
            style={{ flex: 1 }}
            onPress={() => {
              if (balance) {
                router.push({
                  pathname: "/formPayment",
                  params: formPaymentParams()
                });
              }
            }}
            textStyle={baseStyles.textLightBlack}
            text='Add Payment'
            icon={<Ionicons name="add" size={20} color="#4b4b4bff" />}
          />
        }
      </View>)
  }

  const renderPayments = (payments) => {
    if (payments.length === 0) return <EmptyList text="No payments yet" ><Text>Start adding a new payment</Text></EmptyList>;

    return payments.map(payment => (
      <Payment
        key={payment.id}
        id={payment.id}
        amount={payment.amount}
        canEdit={(balance.admin && balance.balance_members.length > 2) || payment.mine}
        creatorName={payment.creator_name}
        date={payment.created_at}
        paymentableId={payment.paymentable_id}
        paymentableType={payment.paymentable_type}
        parentTitle={payment.parent_title}
        status={payment.status}
        title={payment.title}
        promises={payment?.promises}
      />
    ))
  }

  useFocusEffect(
    useCallback(() => {
      fetchBalance();
      fetchInfo();
    }, [id])
  );

  if (loading) return <Spinner />;
  if (!loading && !balance) return (<EmptyList text="No balance found">{null}</EmptyList>)

  return (
    <>
      <ScrollView
        contentContainerStyle={[baseStyles.viewContainerFullScrollable]}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={fetchBalance} />} >
        { showSplit && <ModalInfoSplit visible={showSplit} balanceSplittedInfo={balanceSplitted} onClose={() => setShowSplit(false)} /> }
        <BalanceCard
          id={balance.id}
          total={balance.total}
          name={balance.name}
          status={balance.status}
          members={balance.balance_members}
          myTotal={balance.my_total}
        />
        {renderBalanceCardFooter()}
        <Text style={[baseStyles.label17, { fontWeight: 600, paddingVertical: 10 }]}>Recent Payments</Text>
        <TopNavBar menus={['Payments', 'Uneven']} activeTab={activeTab} setActiveTab={setActiveTab} />
          {activeTab === "Payments" ? renderPayments(payments) : renderPayments(uneven)}
      </ScrollView>
    </>
  )
}