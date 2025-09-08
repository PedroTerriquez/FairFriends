import React, { useState } from 'react';
import { View, Text, TouchableWithoutFeedback, Keyboard, Pressable, TextInput } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

import baseStyles from '@/presentational/BaseStyles';
import AvatarInfoHeader from '@/presentational/AvatarInfoHeader';
import { MaterialIcons } from '@expo/vector-icons';
import { createPayment, updatePayment } from '@/services/api';
import InputWithLabel from '@/presentational/InputWithLabel';
import PaymentKeyPad from '@/presentational/PaymentKeypad';
import SuccessPaymentModal from '@/presentational/SuccessPaymentModal';
import FormStepContainer from '@/presentational/FormStepContainer';

export default function addPayment() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  const [step, setStep] = useState(1);
  const [concept, setConcept] = useState(params.title || '');
  const [amount, setAmount] = useState(() => {
    if (!params.amount) return '0';
    return params.amount.replace(/[$,]/g, '') || '0';
  });
  const [isModalVisible, setModalVisible] = useState(false);
  const [creatorId] = useState(params.members ? params?.members[0]?.id : null);
  const [users] = useState(() => JSON.parse(params.members ?? "[]"));

  const [amounts, setAmounts] = useState(() => {
    return users.map(user => ({ user_id: user.id, amount: "" }));
  });

  const handleAmountChange = (id, text) => {
    setAmounts(prev =>
      prev.map(a =>
        a.user_id === id ? { ...a, amount: text } : a
      )
    );
  };

  const handleKeyPress = (key) => {
    if (key === '⌫') {
      setAmount(prev => prev.slice(0, -1) || '0');
    } else {
      setAmount(prev => prev === '0' ? key : prev + key);
    }
  };

  const paymentCreationValues = () => {
    return {
      title: concept,
      amount: parseFloat(amount),
      paymentable_id: params.paymentable_id,
      paymentable_type: params.type,
      recipient_id: params.recipient_id,
      creator_id: creatorId,
      uneven_amounts: amounts,
    };
  };

  const paymentUpdateValues = () => {
    return {
      id: params.payment_id,
      title: concept,
      amount: parseFloat(amount),
      creator_id: creatorId
    };
  };

  const handleSubmit = async () => {
    try {
      if (params.payment_id) {
        await updatePayment(params.payment_id, paymentUpdateValues())
        setModalVisible(true);
      } else {
        await createPayment(paymentCreationValues())
        setModalVisible(true);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={[baseStyles.viewContainerFull]}>
          <View style={{ flex: 0}}>
            <AvatarInfoHeader user={params.recipient_name} text={`Sending to`} />
          </View>
          {/* Payment Information Section */}
          <View style={[ step !== 1 ? { flex: 0 } : { flex: 6 } ]}>
            <FormStepContainer step={step} setStep={setStep} stepPosition={1} icon={<MaterialIcons name="navigate-next" size={32} color="white" />} title={'Uneven Payment Information'} >
              <View>
                              <Text style={[baseStyles.title17, { marginTop: 40, textAlign: 'center' }]}> ⚠️ This payment was split unequally.</Text>
                              <Text style={[baseStyles.label17, { marginTop: 10, marginBottom: 10, textAlign: 'justify' }]}>Some members paid more. The total will be recorded as a separate 'Promise', not part of the balance.</Text>
                              <View style={{ justifyContent: 'center', alignItems: 'center', marginBottom: 40 }}>
                                  <MaterialIcons style={{ alignItems: 'center' }} name="currency-exchange" size={50} color="black" />
                              </View>
                              <InputWithLabel label='Concept' name='concept' value={concept} onChangeText={(_name, value) => setConcept(value)} placeholder="Add a concept" error={null} editable={true} />
              </View>
            </FormStepContainer>
          </View>
          {/* Payment Section */}
          {
            step === 2 && (<PaymentKeyPad amount={amount} amountSuggestion={params.amount_payments} onKeyPress={handleKeyPress} handleSubmit={() => setStep(3)} />
            )
          }
          {/* Split Section */}
          <View style={[ step !== 3 ? { display: 'none' } : { flex: 0 } ]}>
            <FormStepContainer step={step} setStep={setStep} stepPosition={3} icon={<MaterialIcons name="navigate-next" size={32} color="white" />} title={'Split Payment amounts'} onNext={handleSubmit} >
                <View>
                {users.map(user => {
                  const amountObj = amounts.find(a => a.user_id === user.id);

                  return (
                    <View key={user.id} style={{ marginVertical: 10 }}>
                      <Text>{user.name}</Text>
                      <TextInput
                        style={{
                          borderWidth: 1,
                          borderColor: "#ccc",
                          padding: 8,
                          marginTop: 5,
                        }}
                        keyboardType="numeric"
                        value={amountObj ? amountObj.amount : ""}
                        onChangeText={text => handleAmountChange(user.id, text)}
                      />
                    </View>
                  );
                })}
                </View>
            </FormStepContainer>
          </View>
        </View>
      </TouchableWithoutFeedback>

      <SuccessPaymentModal
        visible={isModalVisible}
        total={amount}
        onClose={() => setModalVisible(false)}
        onBack={() => router.back()}
      />
    </>
  );
}