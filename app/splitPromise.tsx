import { useCallback, useState } from "react";
import { useFocusEffect, useLocalSearchParams } from "expo-router";
import { getSplitPromises } from "@/services/api"
import { View, Text, ScrollView } from "react-native";
import PromiseCard from "@/presentational/PromiseCard";
import baseStyles from "@/presentational/BaseStyles";
import { useTranslation } from "react-i18next";

export default function SplitPromise() {
    const { t } = useTranslation();
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
                interest={promise.interest}
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
            <Text style={[baseStyles.title20, { marginVertical: 20 }]}> {t('splitPromise.this_payment_was_split')}</Text>
            <Text style={baseStyles.label17}>{t('splitPromise.some_members_paid_more')}</Text>
        </View>
        <ScrollView >
            {renderPromises()}
        </ScrollView>
    </View>
    )
}
