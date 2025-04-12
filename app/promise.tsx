import axios from "axios";
import { useEffect, useState } from "react";
import { View, Text, Button, StyleSheet, ScrollView, TouchableOpacity, Pressable } from "react-native";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import baseStyles from '@/presentational/BaseStyles';
import { useSession } from "@/services/authContext";
import Payment from '@/presentational/Payment';
import PromiseGraph from "@/presentational/PromiseGraph";
import PromiseCard from "@/presentational/PromiseCard";
import EmptyList from "@/presentational/EmptyList";

export default function Promise() {
    const [payments, setPayments] = useState([])
    const [promise, setPromise] = useState(null)
    const { paymentable_id } = useLocalSearchParams();
    const { session } = useSession();

    const fetchPayments = async () => {
        axios.get(`${process.env.EXPO_PUBLIC_API}/promises/${paymentable_id}`, session)
            .then((response) => {
                console.log(response)
                setPayments(response.data.payments)
                setPromise(response.data.promise)
            })
            .catch((error) => {
                console.log(error);
            })
    }

    const renderPayments = () => {
        if (payments.length == 0) return

        return payments.map(payment => (
            <Payment
                key={payment.id}
                id={payment.id}
                creator={payment.creator_id}
                method='Cash'
                date={payment.created_at}
                amount={payment.amount}
                title={payment.title}
                status={payment.status}
                type={payment.paymentable_type}
                creatorName={payment.creator_name}
                paymentable_id={payment.paymentable_id}
                parentTitle={payment.parent_title}
            />
        ))
    }

    useEffect(() => {
        fetchPayments();
    }, [paymentable_id]);

    return promise ? (
        <ScrollView style={[baseStyles.viewContainerFull, {backgroundColor: "white"}]}>
            <View>
                <PromiseCard
                    id={promise.id}
                    title={promise.title}
                    total={promise.total}
                    percentage={(promise.paid_amount / 100 * promise.total) + "%"}
                    status={promise.status}
                    user={promise.admin_name}
                />
                {promise.status === "pending" && (
                    <Pressable
                        style={[baseStyles.button, baseStyles.buttonWarning, { marginTop: 10 }]}
                        onPress={() => router.push({
                            pathname: "/formPromise", params: {
                                paymentable_id,
                                mine: promise.mine
                            }
                        })}
                    >
                        <Text style={baseStyles.buttonText}>Edit</Text>
                    </Pressable>
                )}
            </View>
            <View style={[baseStyles.viewRow, { justifyContent: "space-between", height: 70 }]}>
                {payments.length > 0 && <Text style={[baseStyles.titleh2, { marginTop: 10 }]}>Recent Transactions </Text>}
                {promise.status != 'pending' && promise.status != 'close' && <TouchableOpacity
                    style={[baseStyles.floatingButton, { backgroundColor: '#007AFF' }]}
                    onPress={() => {
                        if (promise) {
                            router.push({
                                pathname: "/formPayment",
                                params: {
                                    paymentable_id: paymentable_id,
                                    type: 'Promise',
                                    recipient_name: promise.admin_name,
                                    recipient_id: promise.administrator_id
                                }
                            });
                        }
                    }}
                >
                    <Ionicons name="add" size={32} color="white" />
                </TouchableOpacity>
                }
            </View>
            {renderPayments()}
        </ScrollView>
    ) : <View></View>
}