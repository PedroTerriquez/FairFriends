import { useCallback, useState } from "react";
import { View, Text, ScrollView, Pressable, RefreshControl } from "react-native";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";

import baseStyles from '@/presentational/BaseStyles';
import Payment from '@/presentational/Payment';
import PromiseCard from "@/presentational/PromiseCard";
import FloatingButton from "@/presentational/FloatingButton";
import Spinner from "@/presentational/Spinner";
import { getPromiseDetail, patchNotification } from "@/services/api";
import EmptyList from "@/presentational/EmptyList";

export default function Promise() {
    const [payments, setPayments] = useState([]);
    const [promise, setPromise] = useState(null);
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(false);
    const { id } = useLocalSearchParams();

    const fetchPayments = async () => {
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
                <View style={[baseStyles.rowCenter, baseStyles.paddingVertical10, { justifyContent: "space-between", height: 70 }]}>
                    <Text style={[baseStyles.title15, { marginTop: 10 }]}>Recent Transactions </Text>
                    {promise && promise.status === 'accepted' && !promise.admin && <FloatingButton
                        icon="add"
                        action={() => {
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
                        }}
                    >
                    </FloatingButton>
                    }
                </View>
            </>)
    }

    const renderPayments = () => {
        if (payments.length === 0) return <EmptyList text="No payments yet" ><Text>Start adding a new payment</Text></EmptyList>;

        return payments.map(payment => (
            <Payment
                key={payment.id}
                id={payment.id}
                amount={payment.amount}
                canEdit={payment.mine}
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

    const acceptPromiseThroughNotification = (id) => {
        patchNotification(id, 'accepted')
            .then((response) => {
                if (response.status == 200) {
                    setPromise({ ...promise, status: 'accepted' });
                }
            });
    };

    useFocusEffect(
        useCallback(() => {
            fetchPayments();
        }, [id])
    );

    if (loading) return <Spinner />;
    if (!loading && !promise) return (<EmptyList text="No promise found">{null}</EmptyList>)

    return (
        <ScrollView
            contentContainerStyle={baseStyles.viewContainerFull}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={fetchPayments} />} >
            <View>
                <PromiseCard
                    id={promise.id}
                    title={promise.title}
                    total={promise.total}
                    paid_amount={promise.paid_amount}
                    percentage={promise.percentage}
                    status={promise.status}
                    user={promise.admin_name}
                />
                {promise.status === "pending" && (
                    <>
                        <Pressable
                            style={[baseStyles.button, baseStyles.warningBG, { marginTop: 10 }]}
                            onPress={() => router.push({
                                pathname: "/formPromise", params: {
                                    paymentable_id: id,
                                    administrator_name: promise.admin_name,
                                    administrator_id: promise.administrator_id,
                                }
                            })}
                        >
                            <Text style={baseStyles.buttonText}>Edit</Text>
                        </Pressable>
                        {
                            promise.admin && (<Pressable
                                style={[baseStyles.button, baseStyles.successBG, { marginTop: 10 }]}
                                onPress={() => acceptPromiseThroughNotification(promise.notification_id)} >
                                <Text style={baseStyles.buttonText}>Accept</Text>
                            </Pressable>)
                        }
                    </>
                )}
            </View>
            {promise.status !== 'pending' && renderPaymentsHeader()}
            {renderPayments()}
        </ScrollView>
        )
}