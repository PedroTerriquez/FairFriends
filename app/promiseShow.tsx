import { useCallback, useState } from "react";
import { View, Text, FlatList, RefreshControl, TouchableOpacity } from "react-native";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useTranslation } from 'react-i18next';

import baseStyles from '@/presentational/BaseStyles';
import Payment from '@/presentational/PaymentCard';
import PromiseCard from "@/presentational/PromiseCard";
import Spinner from "@/presentational/Spinner";
import { getPromiseDetail, patchNotification } from "@/services/api";
import EmptyList from "@/presentational/EmptyList";
import ButtonWithIcon from "@/presentational/ButtonWithIcon";
import FloatingButton from "@/presentational/FloatingButton";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

export default function Promise() {
    const { t } = useTranslation();
    const [payments, setPayments] = useState([]);
    const [promise, setPromise] = useState(null);
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(false);
    const { id } = useLocalSearchParams();

    const fetchPromiseDetails = async () => {
        setLoading(true);
        setRefreshing(true);
        getPromiseDetail(id)
            .then((response) => {
                setPayments(response.data.payments);
                setPromise(response.data.promise);
            })
            .catch((error) => {
            })
            .finally(() => {
                setRefreshing(false);
                setLoading(false);
            });
    };
    const renderPaymentsHeader = () => {
        return (
            <>
                <View style={[baseStyles.rowCenter, baseStyles.containerCard, { justifyContent: "space-between", height: 70 }]}>
                    <Text style={[baseStyles.title17]}>{t('promiseShow.recent_transactions')} </Text>
                    {promise && promise.status === 'accepted' && !promise.admin && <TouchableOpacity onPress={() => {
                        if (promise) {
                            router.push({
                                pathname: "/formPayment",
                                params: {
                                    paymentable_id: id,
                                    type: 'Promise',
                                    recipient_name: promise.admin_name,
                                    recipient_id: promise.administrator_id,
                                    amount_payments: promise.amount_payments
                                }
                            });
                        }
                    }} style={[baseStyles.circleButton, baseStyles.blueBG]}>
                        <Ionicons name="add" size={31} color="white" />
                    </TouchableOpacity>
                    }
                </View>
            </>)
    }

    // FlatList render callbacks - memoized for performance
    const renderPaymentItem = useCallback(({ item }) => (
        <Payment
            id={item.id}
            amount={item.amount}
            canEdit={item.mine}
            creatorName={item.creator_name}
            date={item.created_at}
            paymentableId={item.paymentable_id}
            paymentableType={item.paymentable_type}
            parentTitle={item.parent_title}
            status={item.status}
            title={item.title}
            handleAccept={acceptPayment}
        />
    ), []);
    //fix previus line

    const paymentKeyExtractor = useCallback((item) => item.id.toString(), []);

    // Optimize rendering for fixed-height items (Payment ~100px)
    const getPaymentItemLayout = useCallback((data, index) => ({
        length: 110,
        offset: 110 * index,
        index,
    }), []);

    const renderEmptyPayments = () => (
        <EmptyList text={t('promiseShow.no_payments_yet')}>
            <Text>{t('promiseShow.start_adding_payment')}</Text>
        </EmptyList>
    );

    // FlatList header with promise card and buttons
    const renderListHeader = () => (
        <View>
            <PromiseCard
                id={promise.id}
                title={promise.title}
                total={promise.total}
                paid_amount={promise.paid_amount}
                percentage={promise.percentage}
                status={promise.status}
                user={promise.admin_name}
                interest={promise.interest || 0}
            />
            {promise.status === "pending" && (
                <View style={{ flexDirection: 'row', justifyContent: 'center', padding: 10, gap: 10 }}>
                    <ButtonWithIcon
                        style={[baseStyles.buttonWithIcon, baseStyles.warningBG, { width: 100 }]}
                        text={t('promiseShow.edit')}
                        icon={<MaterialIcons name="edit" size={18} color="white" />}
                        onPress={() => router.push({
                            pathname: "/formPromise", params: {
                                paymentable_id: id,
                                administrator_name: promise.admin_name,
                                administrator_id: promise.administrator_id,
                            }
                        })}
                    />
                    {promise.admin && (
                        <ButtonWithIcon
                            testID="promise-accept"
                            style={[baseStyles.buttonWithIcon, baseStyles.successBG]}
                            text={t('promiseShow.accept')}
                            icon={<MaterialIcons name="check" size={18} color="white" />}
                            onPress={() => acceptPromise(promise.notification_id)}
                        />
                    )}
                </View>
            )}
            {promise.status !== 'pending' && renderPaymentsHeader()}
        </View>
    );

    const acceptPromise = (id) => {
        //Through the notification we accept the promise
        patchNotification(id, 'accepted')
            .then((response) => {
                if (response.status == 200) {
                    setPromise({ ...promise, status: 'accepted' });
                }
            });
    };

    const acceptPayment = (quantity) => {
        setPromise({ ...promise, paid_amount: (promise.paid_amount || 0) + quantity });
    }

    useFocusEffect(
        useCallback(() => {
            fetchPromiseDetails();
        }, [id])
    );

    if (loading) return <Spinner />;
    if (!loading && !promise) return (<EmptyList text={t('promiseShow.no_promise_found')}>{null}</EmptyList>)

    const payable = promise && promise.status === 'accepted' && !promise.admin;

    return (
        <View style={{ flex: 1 }}>
            <FlatList
                data={promise.status === 'pending' ? [] : payments}
                renderItem={renderPaymentItem}
                keyExtractor={paymentKeyExtractor}
                getItemLayout={getPaymentItemLayout}
                ListHeaderComponent={renderListHeader}
                ListEmptyComponent={promise.status !== 'pending' ? renderEmptyPayments() : null}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={fetchPromiseDetails} />}
                contentContainerStyle={[baseStyles.viewContainerFull, { flexGrow: 1 }]}
                // Performance optimizations
                maxToRenderPerBatch={8}
                windowSize={5}
                removeClippedSubviews={true}
                initialNumToRender={10}
            />

            {/* FAB - Add Payment */}
            {payable && (
                <FloatingButton
                    testID="promise-fab-add-payment"
                    icon="add"
                    action={() => router.push({
                        pathname: "/formPayment",
                        params: {
                            paymentable_id: id,
                            type: 'Promise',
                            recipient_name: promise.admin_name,
                            recipient_id: promise.administrator_id,
                            amount_payments: promise.amount_payments
                        }
                    })}
                />
            )}
        </View>
    )
}
