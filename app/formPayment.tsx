import React, { useState } from 'react';
import { View, Text, TouchableWithoutFeedback, Keyboard, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

import baseStyles from '@/presentational/BaseStyles';
import AvatarInfoHeader from '@/presentational/AvatarInfoHeader';
import { MaterialIcons } from '@expo/vector-icons';
import { createPayment, updatePayment } from '@/services/api';
import { Picker } from '@react-native-picker/picker';
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
  const [creatorId, setCreatorId] = useState(params.members ? params?.members[0]?.id : null);

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
      creator_id: creatorId
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
          <View style={[ step === 2 ? { flex: 0 } : { flex: 6 } ]}>
            <FormStepContainer step={step} setStep={setStep} stepPosition={1}
              icon={<MaterialIcons name="navigate-next" size={32} color="white" />}
              title={'Payment Information'} >
              <View>
                <InputWithLabel label='Concept' name='concept' value={concept}
                  onChangeText={(_name, value) => setConcept(value)}
                  placeholder="Add a concept" error={null} editable={true} />
                {params.members && params.admin == true && (
                  <View>
                    <Text style={baseStyles.label17}>Done by</Text>
                    <Picker
                      selectedValue={creatorId}
                      onValueChange={(member_id) => setCreatorId(member_id)}
                      style={[baseStyles.picker, { height: 100 }]}
                      itemStyle={{ color: 'black' }} >
                      {JSON.parse(params.members).map(member => (
                        <Picker.Item key={member.id} label={member.name} value={member.id} />
                      ))}
                    </Picker>
                  </View>
                )}
              </View>
            </FormStepContainer>
          </View>
          {/* Payment Section */}
          {
            step === 2 && (<PaymentKeyPad amount={amount} amountSuggestion={params.amount_payments} onKeyPress={handleKeyPress} handleSubmit={handleSubmit} />
            )
          }
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
