import axios from "axios";
import { useEffect, useState } from "react";
import { View, Text, TextInput, Picker, ScrollView, Pressable } from "react-native";

import { useSession } from "@/services/authContext";
import baseStyles from "@/presentational/BaseStyles";
import { useLocalSearchParams, useNavigation } from "expo-router";
import AvatarInfoHeader from "@/presentational/AvatarInfoHeader";

export default function formPromise() {
    const { session } = useSession();
    const navigation = useNavigation();
    const { administrator_id, administrator_name, paymentable_id } = useLocalSearchParams();
    const [promise, setPromise] = useState({})

    const handleChange = (field, value) => {
        setPromise((prevPromise) => ({
            ...prevPromise,
            [field]: value,
        }));
    };

    const fetchPromiseData = () => {
        axios.get(`${process.env.EXPO_PUBLIC_API}/promises/${paymentable_id}`, session)
            .then((response) => {
                setPromise(response.data.promise)
            })
            .catch((error) => {
                setPromise({
                    id: null,
                    amount_payments: 0,
                    payment_period: 'week',
                    title: 'Title',
                    interest: 1,
                    total: 0,
                    administrator_id: administrator_id,
                    administrator_name: administrator_name,
                })
            })
    }

    const handleSave = () => {
        if (paymentable_id) {
            updatePromise(paymentable_id);
        } else {
            createPromise();
        }
    }

    const updatePromise = (id) => {
        axios.patch(`${process.env.EXPO_PUBLIC_API}/promises/${id}`, promise, session)
            .then((response) => {
                navigation.navigate('promise', { paymentable_id: id })
            })
            .catch((error) => {
            })
    }

    const createPromise = () => {
        axios.post(`${process.env.EXPO_PUBLIC_API}/promises`, promise, session)
            .then((response) => {
                navigation.navigate('promise', { paymentable_id: response.data.id })
            })
            .catch((error) => {
                console.log(error);
            })
    }

    useEffect(() => {
        fetchPromiseData();
    }, [paymentable_id]);

    let percent_interest = (100 + parseInt(promise.interest || 0)) / 100
    
    return (
        <ScrollView style={baseStyles.card}>
            { paymentable_id ? <AvatarInfoHeader user={promise.admin_name} text={`Editing Promise made to`} /> :  <AvatarInfoHeader user={promise.administrator_name} text={`New Promise made to`} /> }
            <Text style={baseStyles.label}>Concept</Text>
            <TextInput style={baseStyles.input} value={promise.title} onChangeText={(title) => handleChange('title', title)} editable={promise.mine} />
            <Text style={baseStyles.label}>Total</Text>
            <TextInput style={baseStyles.input} value={promise.total} onChangeText={(total) => handleChange('total', total)} keyboardType="numeric" />

            <View>
                <Text style={baseStyles.label}>Payment Amount</Text>
                <TextInput style={baseStyles.input} value={promise.amount_payments} onChangeText={(amountPayments) => handleChange('amount_payments', amountPayments)} keyboardType="numeric" editable={promise.mine} />
            </View>

            <View>
                <Text style={baseStyles.label}>Payment Period</Text>
                <Picker selectedValue={promise.period} onValueChange={(period) => handleChange('period', period)} style={baseStyles.picker}>
                    <Picker.Item label="Day" value="day" />
                    <Picker.Item label="Week" value="week" />
                    <Picker.Item label="Bi-week" value="biweek" />
                    <Picker.Item label="Month" value="month" />
                </Picker>
            </View>

            <View>
                <Text style={baseStyles.label}>Interest (%)</Text>
                <TextInput style={baseStyles.input} value={promise.interest} onChangeText={(interest) => handleChange('interest', interest)} keyboardType="numeric" />
            </View>

            <View>
                <Text style={baseStyles.label}>Total With Interest</Text>
                <TextInput style={[baseStyles.input, baseStyles.disabledInput]} value={(promise.total * percent_interest).toFixed(1)} editable={false} />
            </View>

            <View>
                <Text style={baseStyles.label}>Total Payments</Text>
                <TextInput style={[baseStyles.input, baseStyles.disabledInput]} value={Math.ceil(promise.total * percent_interest / promise.amount_payments)} editable={false} />
            </View>

            <View style={baseStyles.buttonContainer}>
                <Pressable style={[baseStyles.button, baseStyles.cancelButton]} title="Cancel" onPress={() => navigation.goBack()}>
                    <Text style={baseStyles.buttonText}>Cancel</Text>
                </Pressable>
                <Pressable style={[baseStyles.button, baseStyles.saveButton]} title="Save" onPress={handleSave} >
                    <Text style={baseStyles.buttonText}>Save</Text>
                </Pressable>
            </View>
        </ScrollView>
    );
}