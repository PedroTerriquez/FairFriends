import { updatePromise, createPromise, getPromiseDetail } from "@/services/api";
import React, { useEffect, useRef, useState } from "react";
import { View, Text, TextInput, ScrollView, TouchableWithoutFeedback, Keyboard, TouchableOpacity, KeyboardAvoidingView, Platform } from "react-native";
import { Picker } from "@react-native-picker/picker";
import baseStyles from "@/presentational/BaseStyles";
import { router, useLocalSearchParams } from "expo-router";
import AvatarInfoHeader from "@/presentational/AvatarInfoHeader";
import InputWithLabel from "@/presentational/InputWithLabel";
import { useTranslation } from 'react-i18next';

export default function formPromise() {
    const { t } = useTranslation();
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

        if (!promise.title) newErrors.title = t("formPromise.concept_is_required")
        if (!promise.total) newErrors.total = t("formPromise.amount_is_required");
        if (isNaN(promise.total)) newErrors.total = t("formPromise.amount_valid_number");
        if (!promise.payment_period) newErrors.payment_period = t("formPromise.payment_interval_required");
        if (!promise.amount_payments) newErrors.amount_payments = t("formPromise.payment_amount_is_required");
        if (isNaN(promise.amount_payments)) newErrors.amount_payments = t("formPromise.payment_amount_valid_number");
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
                            <AvatarInfoHeader user={promise.admin_name} text={t('formPromise.editing_promise')} />
                        ) : (
                            <AvatarInfoHeader user={promise.administrator_name} text={t('formPromise.new_promise')} />
                        )}

                        <View style={[baseStyles.containerCard, { gap: 15, marginVertical: 10, padding: 20 }]}>
                            <Text style={[baseStyles.title15, { fontSize: 22, fontWeight: 'bold' }]}> {t('formPromise.general_information')} </Text>
                            <InputWithLabel label={t('formPromise.concept')} name='title' value={promise.title} onChangeText={handleChange} placeholder={t('formPromise.enter_concept')} error={errors.title} editable={ownerEditable} />
                            <InputWithLabel label={t('formPromise.amount')} name='total' value={promise.total} onChangeText={handleChange} numeric={true} placeholder={t('formPromise.enter_total_amount')} error={errors.total} editable={ownerEditable} />
                        </View>

                        <View style={[baseStyles.containerCard, { gap: 15, marginVertical: 10, padding: 20 }]}>
                            <Text style={[baseStyles.title15, { fontSize: 22, fontWeight: 'bold' }]}> {t('formPromise.interval')} </Text>
                            <View>
                                <Text style={baseStyles.label17}>{t('formPromise.payment_interval')}</Text>
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
                                        <Picker.Item label={t('formPromise.day')} value="day" />
                                        <Picker.Item label={t('formPromise.week')} value="week" />
                                        <Picker.Item label={t('formPromise.bi_week')} value="biweek" />
                                        <Picker.Item label={t('formPromise.month')} value="month" />
                                    </Picker>)}
                                {errors.payment_period && <Text style={baseStyles.errorText}>{errors.payment_period}</Text>}
                            </View>
                            <InputWithLabel label={t('formPromise.payment_amount')} name='amount_payments' value={promise.amount_payments} numeric={true} onChangeText={handleChange} placeholder={t('formPromise.enter_payment_amount')} error={errors.amount_payments} editable={ownerEditable} />
                        </View>

                        <View style={[baseStyles.containerCard, { gap: 15, marginVertical: 10, padding: 20 }]}>
                            <Text style={[baseStyles.title15, { fontSize: 22, fontWeight: 'bold', marginBottom: 10 }]}> {t('formPromise.financial_details')} </Text>
                            <InputWithLabel label={t('formPromise.interest')} name='interest' value={promise.interest} numeric={true} onChangeText={handleChange} placeholder={t('formPromise.enter_interest')} editable={adminEditable} />
                            <InputWithLabel label={t('formPromise.total_with_interest')} name='' value={totalWithInterest} onChangeText={() => { }} placeholder="" error={null} editable={false} />
                            {promise.total && percentInterest && promise.amount_payments && (
                                <InputWithLabel label={t('formPromise.total_payments')} name='' value={totalPayments} onChangeText={() => { }} placeholder="" error={null} editable={true} />
                            )}
                        </View>

                        <View style={[baseStyles.buttonContainer, { flexDirection: 'row', justifyContent: 'space-between', marginTop: 30 }]}>
                            <TouchableOpacity
                                style={[baseStyles.button, baseStyles.saveButton, { flex: 1, marginLeft: 10 }]}
                                onPress={handleSave}
                            >
                                <Text style={baseStyles.buttonText}>{t('formPromise.save')}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}