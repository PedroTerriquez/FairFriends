import axios from "axios";
import { useEffect, useState } from "react";
import { View, Text, TextInput, ScrollView, Pressable, TouchableWithoutFeedback, Keyboard, TouchableOpacity, KeyboardAvoidingView, Platform } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useSession } from "@/services/authContext";
import baseStyles from "@/presentational/BaseStyles";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import AvatarInfoHeader from "@/presentational/AvatarInfoHeader";

export default function formPromise() {
    const { session } = useSession();
    const navigation = useNavigation();
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
    const [step, setStep] = useState(1);
    const [errors, setErrors] = useState({});
    const adminEditable = paymentable_id && promise.admin;
    const ownerEditable = paymentable_id == undefined || (paymentable_id && !promise.admin);

    const handleChange = (field, value) => {
        setPromise((prevPromise) => ({
            ...prevPromise,
            [field]: value,
        }));
    };

    const fetchPromiseData = () => {
        if (paymentable_id == undefined) return;
        axios.get(`${process.env.EXPO_PUBLIC_API}/promises/${paymentable_id}`, session)
            .then((response) => {
                setPromise(response.data.promise)
            })
            .catch((error) => {
                console.log(error);
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
                router.push({pathname:'/promise', params: { id } })
            })
            .catch((error) => {
            })
    }

    const createPromise = () => {
        axios.post(`${process.env.EXPO_PUBLIC_API}/promises`, promise, session)
            .then((response) => {
                debugger;
                router.push({pathname:'/promise', params: { id: response.data.id } })
            })
            .catch((error) => {
                console.log(error);
            })
    }

    const validateStep1 = () => {
        const newErrors = {};
        if (!promise.title) newErrors.title = "Concept is required.";
        if (!promise.total) newErrors.total = "Amount Requested is required.";
        if (!promise.amount_payments) newErrors.amount_payments = "Payment Amount is required.";
        if (!promise.payment_period) newErrors.payment_period = "Payment Interval is required.";
        if (isNaN(promise.total)) newErrors.total = "Amount Required must be a valid number.";
        if (isNaN(promise.amount_payments)) newErrors.amount_payments = "Payment Amount must be a valid number.";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNextStep = () => {
        if (step === 1 && !validateStep1()) return;
        setStep(step + 1);
    };

    useEffect(() => {
        fetchPromiseData();
    }, [paymentable_id]);

    let percent_interest = (100 + parseInt(promise.interest || 0)) / 100
    
    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                    <View style={[baseStyles.viewContainerFull, { backgroundColor: 'white', padding: 20 }]}>
                        {paymentable_id ? (
                            <AvatarInfoHeader user={promise.admin_name} text={`Editing Promise made to`} />
                        ) : (
                            <AvatarInfoHeader user={promise.administrator_name} text={`New Promise made to`} />
                        )}

                        {step === 1 && (
                            <View style={{ gap: 15, marginVertical: 50 }}>
                                <Text style={[baseStyles.title15, { fontSize: 22, fontWeight: 'bold', marginBottom: 10 }]}>
                                    General Information
                                </Text>
                                <View>
                                    <Text style={baseStyles.label}>Concept</Text>
                                    <TextInput
                                        style={baseStyles.input}
                                        value={promise.title || ''}
                                        onChangeText={(title) => handleChange('title', title)}
                                        placeholder="Enter the concept"
                                        editable={ownerEditable}
                                    />
                                    {errors.title && <Text style={baseStyles.errorText}>{errors.title}</Text>}
                                </View>
                                <View>
                                    <Text style={baseStyles.label}>Amount Requested</Text>
                                    <TextInput
                                        style={baseStyles.input}
                                        value={promise.total || ''}
                                        onChangeText={(total) => handleChange('total', total)}
                                        keyboardType="numeric"
                                        placeholder="Enter the total amount"
                                        editable={ownerEditable}
                                    />
                                    {errors.total && <Text style={baseStyles.errorText}>{errors.total}</Text>}
                                </View>
                                <View>
                                    <Text style={baseStyles.label}>Payment Amount</Text>
                                    <TextInput
                                        style={baseStyles.input}
                                        value={promise.amount_payments || ''}
                                        onChangeText={(amountPayments) => handleChange('amount_payments', amountPayments)}
                                        keyboardType="numeric"
                                        placeholder="Enter the payment amount"
                                        editable={ownerEditable}
                                    />
                                    {errors.amount_payments && <Text style={baseStyles.errorText}>{errors.amount_payments}</Text>}
                                </View>
                                <View>
                                    <Text style={baseStyles.label}>Payment Interval</Text>
                                    {promise.admin ? (
                                        <TextInput
                                            style={[baseStyles.input, baseStyles.disabledInput]}
                                            value={promise.payment_period}
                                        />
                                    ) : (
                                        <Picker
                                            selectedValue={promise.payment_period || 'month'}
                                            onValueChange={(payment_period) => handleChange('payment_period', payment_period)}
                                            style={[baseStyles.picker, { height: 50, width: '100%' }]}
                                            itemStyle={{ color: 'black' }} >
                                            <Picker.Item label="Day" value="day" />
                                            <Picker.Item label="Week" value="week" />
                                            <Picker.Item label="Bi-week" value="biweek" />
                                            <Picker.Item label="Month" value="month" />
                                        </Picker>)}
                                    {errors.payment_period && <Text style={baseStyles.errorText}>{errors.payment_period}</Text>}
                                </View>
                            </View>
                        )}

                        {step === 2 && (
                            <View style={{ gap: 20, marginTop: 20 }}>
                                <Text style={[baseStyles.title15, { fontSize: 22, fontWeight: 'bold', marginBottom: 10 }]}>
                                    Financial Details
                                </Text>
                                <View style={{ marginBottom: 15 }}>
                                    <Text style={baseStyles.label}>Interest (%)</Text>
                                    <TextInput
                                        style={baseStyles.input}
                                        value={promise.interest || ''} 
                                        onChangeText={(interest) => handleChange('interest', interest)}
                                        keyboardType="numeric"
                                        placeholder="Enter the interest rate"
                                        editable={adminEditable}
                                    />
                                </View>
                                <View style={{ marginBottom: 15 }}>
                                    <Text style={baseStyles.label}>Total With Interest</Text>
                                    <TextInput
                                        style={[baseStyles.input, baseStyles.disabledInput]}
                                        value={(promise.total * percent_interest).toFixed(1) || ''}
                                    />
                                </View>
                                {promise.total && percent_interest && promise.amount_payments && (
                                    <View>
                                        <Text style={baseStyles.label}>Total Payments</Text>
                                        <Text style={[baseStyles.input, baseStyles.disabledInput]}>
                                            {Math.ceil(promise.total * percent_interest / promise.amount_payments)}
                                        </Text>
                                    </View>
                                )}
                            </View>
                        )}

                        <View style={[baseStyles.buttonContainer, { flexDirection: 'row', justifyContent: 'space-between', marginTop: 30 }]}>
                            {step > 1 && (
                                <TouchableOpacity
                                    style={[baseStyles.button, baseStyles.cancelButton, { flex: 1, marginRight: 10 }]}
                                    onPress={() => setStep(step - 1)}
                                >
                                    <Text style={baseStyles.buttonText}>Back</Text>
                                </TouchableOpacity>
                            )}
                            {step < 2 && (
                                <TouchableOpacity
                                    style={[baseStyles.button, baseStyles.saveButton, { flex: 1, marginLeft: step > 1 ? 10 : 0 }]}
                                    onPress={handleNextStep}
                                >
                                    <Text style={baseStyles.buttonText}>Next</Text>
                                </TouchableOpacity>
                            )}
                            {step === 2 && (
                                <TouchableOpacity
                                    style={[baseStyles.button, baseStyles.saveButton, { flex: 1, marginLeft: 10 }]}
                                    onPress={handleSave}
                                >
                                    <Text style={baseStyles.buttonText}>Save</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>
                </ScrollView>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}