import axios from "axios";
import { useCallback, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Pressable, RefreshControl } from "react-native";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import baseStyles from '@/presentational/BaseStyles';
import { useSession } from "@/services/authContext";
import Payment from '@/presentational/Payment';
import PromiseCard from "@/presentational/PromiseCard";
import { useToast } from "@/services/ToastContext";
import FloatingButton from "@/presentational/FloatingButton";
import Spinner from "@/presentational/Spinner";

export default function Promise() {
    const [payments, setPayments] = useState([]);
    const [promise, setPromise] = useState(null);
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(false);
    const { id } = useLocalSearchParams();
    const { session } = useSession();
    const { showToast } = useToast();
    const payable = promise && promise.status === 'accepted' && !promise.admin;

    const fetchPayments = async () => {
        setLoading(true);
        setRefreshing(true);
        axios.get(`${process.env.EXPO_PUBLIC_API}/promises/${id}`, session)
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

    const renderPayments = () => {
        if (payments.length == 0) return;

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
        axios.patch(`${process.env.EXPO_PUBLIC_API}/notifications/${id}`, { status: 'accepted' }, session)
            .then((response) => {
                if (response.status == 200) {
                    promise.status = 'accepted';
                    setPromise(promise);
                    showToast('Promise accepted', 'success');
                }
            });
    };

    useFocusEffect(
        useCallback(() => {
            fetchPayments();
        }, [id])
    );

    if (loading) return <Spinner />;

    return promise ? (
        <ScrollView
            style={[baseStyles.viewContainerFull, { backgroundColor: "white" }]}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={fetchPayments} />
            }
        >
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
                                    id,
                                    mine: promise.admin
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
            <View style={[baseStyles.rowCenter, baseStyles.paddingVertical10, { justifyContent: "space-between", height: 70 }]}>
                {payments.length > 0 && <Text style={[baseStyles.title15, { marginTop: 10 }]}>Recent Transactions </Text>}
                {payable && <FloatingButton
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
            {renderPayments()}
        </ScrollView>
    ) : <></>;
}