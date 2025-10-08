import { useCallback, useState } from "react";
import { useFocusEffect, useLocalSearchParams } from "expo-router";
import { getSplitPromises } from "@/services/api"
import { View, Text, ScrollView } from "react-native";
import PromiseCard from "@/presentational/PromiseCard";
import baseStyles from "@/presentational/BaseStyles";

export default function SplitPromise() {
    const [promises, setPromises] = useState([]);
    const { payment_id } = useLocalSearchParams();

    const fetchPromises = async () => {
        getSplitPromises(payment_id)
        .then((response) => {
            setPromises(response.data.promises);
        })
        .catch((error) => {
            console.log(error)
        })
    }

    const renderPromises = () => {
        if (promises.length === 0) {
            return <Text>No promises found.</Text>;
        }
        return promises.map((promise) => (
            <PromiseCard
                id={promise.id}
                title={promise.title}
                total={promise.total}
                paid_amount={promise.paid_amount}
                percentage={promise.percentage}
                status={promise.status}
                user={promise.debtor_name}
            />
        ));
    };

    useFocusEffect(
        useCallback(() => {
            fetchPromises();
        }, [payment_id])
    );

    return (<View style={baseStyles.viewContainerFull}>
        <View style={baseStyles.card}>
            <Text style={[baseStyles.titleBold40, {textAlign: 'center' }]}>⚠️</Text>
            <Text style={[baseStyles.title20, { marginVertical: 20 }]}> This payment was split unequally </Text>
            <Text style={baseStyles.label17}>Some members paid more. The total will be recorded as a separate 'Promise', not part of the balance.</Text>
        </View>
        <ScrollView >
            {renderPromises()}
        </ScrollView>
    </View>
    )
}
