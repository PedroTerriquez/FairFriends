import axios from "axios";
import { useEffect, useState } from "react";
import { View, Text, TextInput, ScrollView, Pressable, TouchableWithoutFeedback, Keyboard, TouchableOpacity } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useSession } from "@/services/authContext";
import baseStyles from "@/presentational/BaseStyles";
import { useLocalSearchParams, useNavigation } from "expo-router";
import AvatarInfoHeader from "@/presentational/AvatarInfoHeader";

export default function formPromise() {
    const { session } = useSession();
    const navigation = useNavigation();
    const { administrator_id, administrator_name, paymentable_id } = useLocalSearchParams();
    const [promise, setPromise] = useState({});
    const [step, setStep] = useState(1);

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
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={[baseStyles.viewContainerFull, {backgroundColor: 'white', paddingTop: 30}]}>
                {paymentable_id ? <AvatarInfoHeader user={promise.admin_name} text={`Editing Promise made to`} /> : <AvatarInfoHeader user={promise.administrator_name} text={`New Promise made to`} />}
                { step == 1 && (<View>
                    <Text style={baseStyles.label}>Concept</Text>
                    <TextInput style={baseStyles.input} value={promise.title} onChangeText={(title) => handleChange('title', title)} editable={promise.mine} />
                    <Text style={baseStyles.label}>Total</Text>
                    <TextInput style={baseStyles.input} value={promise.total} onChangeText={(total) => handleChange('total', total)} keyboardType="numeric" />
                    <View>
                        <Text style={baseStyles.label}>Payment Amount</Text>
                        <TextInput style={baseStyles.input} value={promise.amount_payments} onChangeText={(amountPayments) => handleChange('amount_payments', amountPayments)} keyboardType="numeric" editable={promise.mine} />
                    </View>
                </View>)}
                {step == 2 && (<View id='2'>
                    <View>
                        <Text style={baseStyles.label}>Payment Period</Text>
                        <Picker
                            selectedValue={promise.period || 'month'}
                            onValueChange={(period) => handleChange('period', period)}
                            style={[baseStyles.picker, { height: 'auto', width: '100%' }]}
                            itemStyle={{ color: 'black' }}>
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

                    {promise.total && percent_interest && promise.amount_payments && (
                        <View>
                            <Text style={baseStyles.label}>Total Payments</Text>
                            <Text style={[baseStyles.input, baseStyles.disabledInput]}>
                                {Math.ceil(promise.total * percent_interest / promise.amount_payments)}
                            </Text>
                        </View>
                    )}
                </View>)}
                <View style={[baseStyles.buttonContainer, { heigth: 150}]}>
                    <TouchableOpacity
                        style={[baseStyles.button, baseStyles.cancelButton]}
                        onPress={() => { setStep(step - 1) }}>
                            <Text style={baseStyles.buttonText}>Back</Text>
                    </TouchableOpacity>
                    {step < 2 && (<TouchableOpacity
                        style={[baseStyles.button, baseStyles.saveButton]}
                        onPress={() => { setStep(step + 1) }}>
                            <Text style={baseStyles.buttonText}>Next</Text>
                    </TouchableOpacity>)}
                    {step == 2 && (<TouchableOpacity
                        style={[baseStyles.button, baseStyles.saveButton]}
                        onPress={handleSave}>
                            <Text style={baseStyles.buttonText}>Save</Text>
                    </TouchableOpacity>)
                    }
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
}