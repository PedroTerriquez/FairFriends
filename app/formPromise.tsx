import { updatePromise, createPromise, getPromiseDetail } from "@/services/api";
import React, { useEffect, useRef, useState } from "react";
import { View, Text, TextInput, ScrollView, TouchableWithoutFeedback, Keyboard, TouchableOpacity, KeyboardAvoidingView, Platform } from "react-native";
import { Picker } from "@react-native-picker/picker";
import baseStyles from "@/presentational/BaseStyles";
import { router, useLocalSearchParams } from "expo-router";
import AvatarInfoHeader from "@/presentational/AvatarInfoHeader";
import InputWithLabel from "@/presentational/InputWithLabel";

export default function formPromise() {
    const { administrator_id, administrator_name, paymentable_id } = useLocalSearchParams();
    const [promise, setPromise] = useState({
        title: '',
        total: '',
        amount_payments: '',
        payment_period: 'week',
        interest: '',
        admin: false,
        administrator_id: administrator_id || '',
        administrator_name: administrator_name || '',
    });
    const [errors, setErrors] = useState({});
    const adminEditable = paymentable_id && promise.admin;
    const ownerEditable = paymentable_id == undefined || (paymentable_id && !promise.admin);
    const scrollRef = useRef(null);

    const handleChange = (field, value) => {
        setPromise((prevPromise) => ({
            ...prevPromise,
            [field]: value,
        }));
    };

    const fetchPromiseData = () => {
        if (paymentable_id == undefined) return;
        getPromiseDetail(paymentable_id)
            .then((response) => {
                setPromise(response.data.promise)
            })
            .catch((error) => {
                console.log(error);
            })
    }

    const handleSave = () => {
        if (!validateForm()) return;
        if (paymentable_id) {
            updatePromise(paymentable_id, promise)
                .then((response) => {
                    router.replace({ pathname: '/promise', params: { id: paymentable_id } });
                })
                .catch((error) => {});
        } else {
            createPromise(promise)
                .then((response) => {
                    router.replace({pathname:'/promise', params: { id: response.data.id } })
                })
                .catch((error) => {});
        }
    }

    const validateForm = () => {
        const newErrors = {};
        if (!promise.title) newErrors.title = "Concept is required.";
        if (!promise.total) newErrors.total = "Amount Requested is required.";
        if (isNaN(promise.total)) newErrors.total = "Amount Required must be a valid number.";
        if (!promise.payment_period) newErrors.payment_period = "Payment Interval is required.";
        if (!promise.amount_payments) newErrors.amount_payments = "Payment Amount is required.";
        if (isNaN(promise.amount_payments)) newErrors.amount_payments = "Payment Amount must be a valid number.";
        setErrors(newErrors);
        //TODO: Scroll to the specific input
        if (Object.keys(newErrors).length > 0) {
            scrollRef.current?.scrollTo({ y: 0, animated: true });
        }
        return Object.keys(newErrors).length === 0;
    };

    useEffect(() => {
        fetchPromiseData();
    }, [paymentable_id]);

    let percentInterest = (100 + parseInt(promise.interest || 0)) / 100
    let totalWithInterest = (promise.total * percentInterest).toFixed(1)
    let totalPayments = Math.ceil((promise.total * percentInterest)/promise.amount_payments)
    
    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <ScrollView  ref={scrollRef} contentContainerStyle={{ flexGrow: 1 }}>
                    <View style={[baseStyles.viewContainerFull, { paddingHorizontal: 10, paddingVertical: 5}]}>
                        {paymentable_id ? (
                            <AvatarInfoHeader user={promise.admin_name} text={`Editing Promise made to`} />
                        ) : (
                            <AvatarInfoHeader user={promise.administrator_name} text={`New Promise made to`} />
                        )}

                        <View style={[baseStyles.containerCard, { gap: 15, marginVertical: 10, padding: 20 }]}>
                            <Text style={[baseStyles.title15, { fontSize: 22, fontWeight: 'bold' }]}> General Information </Text>
                            <InputWithLabel label='Concept' name='title' value={promise.title} onChangeText={handleChange} placeholder="Enter the concept" error={errors.title} editable={ownerEditable} />
                            <InputWithLabel label='Amount' name='total' value={promise.total} onChangeText={handleChange} numeric={true} placeholder="Enter the total amount" error={errors.total} editable={ownerEditable} />
                        </View>

                        <View style={[baseStyles.containerCard, { gap: 15, marginVertical: 10, padding: 20 }]}>
                            <Text style={[baseStyles.title15, { fontSize: 22, fontWeight: 'bold' }]}> Interval </Text>
                            <View>
                                <Text style={baseStyles.label17}>Payment Interval</Text>
                                {promise.admin ? (
                                    <TextInput
                                        style={[baseStyles.input, baseStyles.disabledInput]}
                                        value={promise.payment_period}
                                    />
                                ) : (
                                    <Picker
                                        selectedValue={promise.payment_period || 'month'}
                                        onValueChange={(payment_period) => handleChange('payment_period', payment_period)}
                                        style={[baseStyles.picker, { height: 150, width: '100%' }]}
                                        itemStyle={{ color: 'black' }} >
                                        <Picker.Item label="Day" value="day" />
                                        <Picker.Item label="Week" value="week" />
                                        <Picker.Item label="Bi-week" value="biweek" />
                                        <Picker.Item label="Month" value="month" />
                                    </Picker>)}
                                {errors.payment_period && <Text style={baseStyles.errorText}>{errors.payment_period}</Text>}
                            </View>
                            <InputWithLabel label='Payment Amount' name='amount_payments' value={promise.amount_payments} numeric={true} onChangeText={handleChange} placeholder="Enter the payment amount" error={errors.amount_payments} editable={ownerEditable} />
                        </View>

                        <View style={[baseStyles.containerCard, { gap: 15, marginVertical: 10, padding: 20 }]}>
                            <Text style={[baseStyles.title15, { fontSize: 22, fontWeight: 'bold', marginBottom: 10 }]}> Financial Details </Text>
                            <InputWithLabel label='Interest (%)' name='interest' value={promise.interest} numeric={true} onChangeText={handleChange} placeholder="Enter the interest rate" editable={adminEditable} />
                            <InputWithLabel label='Total with Interest' name='' value={totalWithInterest} onChangeText={() => { }} placeholder="" error={null} editable={false} />
                            {promise.total && percentInterest && promise.amount_payments && (
                                <InputWithLabel label='Total Payments' name='' value={totalPayments} onChangeText={() => { }} placeholder="" error={null} editable={true} />
                            )}
                        </View>

                        <View style={[baseStyles.buttonContainer, { flexDirection: 'row', justifyContent: 'space-between', marginTop: 30 }]}>
                            <TouchableOpacity
                                style={[baseStyles.button, baseStyles.saveButton, { flex: 1, marginLeft: 10 }]}
                                onPress={handleSave}
                            >
                                <Text style={baseStyles.buttonText}>Save</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}