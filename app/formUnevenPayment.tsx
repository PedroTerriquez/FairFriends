import React, { useState } from 'react';
import { View, Text, TouchableWithoutFeedback, Keyboard, Pressable, TextInput, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

import baseStyles from '@/presentational/BaseStyles';
import AvatarInfoHeader from '@/presentational/AvatarInfoHeader';
import { MaterialIcons } from '@expo/vector-icons';
import { createPayment, updatePayment } from '@/services/api';
import InputWithLabel from '@/presentational/InputWithLabel';
import PaymentKeyPad from '@/presentational/PaymentKeypad';
import SuccessPaymentModal from '@/presentational/SuccessPaymentModal';
import FormStepContainer from '@/presentational/FormStepContainer';
import Avatar from '@/presentational/Avatar';
import { useTranslation } from 'react-i18next';

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

  const { t } = useTranslation(); 

  const handleAmountChange = (id, text) => {
    setAmounts(prev =>
      prev.map(a =>
        a.user_id === id ? { ...a, amount: text } : a
      )
    );
  };

  const amountsSum = () => {
    return amount - amounts.reduce((sum, e) => {
      const amount = e.amount === "" ? 0 : parseInt(e.amount, 10);
      return sum + amount;
    }, 0);
  }

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
            <AvatarInfoHeader user={params.recipient_name} text={t('formUnevenPayment.sendingTo')} />
          </View>
          {/* Payment Information Section */}
          <View style={[ step !== 1 ? { flex: 0 } : { flex: 6 } ]}>
            <FormStepContainer step={step} setStep={setStep} stepPosition={1} icon={<MaterialIcons name="navigate-next" size={32} color="white" />} title={t('formUnevenPayment.paymentInformation')} >
              <View>
                <Text style={[baseStyles.title24, { marginTop: 40, textAlign: 'center' }]}> ⚠️ {t('formUnevenPayment.thisPaymentWillBeSplitUnequally')}</Text>
                <Text style={[baseStyles.label17, { marginTop: 10, marginBottom: 10, textAlign: 'justify' }]}>{t('formUnevenPayment.someMembersPaidMore')}</Text>
                <View style={{ justifyContent: 'center', alignItems: 'center', marginBottom: 40 }}>
                  <MaterialIcons style={{ alignItems: 'center' }} name="currency-exchange" size={50} color="black" />
                </View>
                <InputWithLabel label={t('formUnevenPayment.concept')} name='concept' value={concept} onChangeText={(_name, value) => setConcept(value)} placeholder={t('formUnevenPayment.addAConcept')} error={null} editable={true} />
              </View>
            </FormStepContainer>
          </View>
          {/* Payment Section */}
          {
            step === 2 && (<PaymentKeyPad amount={amount} amountSuggestion={params.amount_payments} onKeyPress={handleKeyPress} handleSubmit={() => setStep(3)} />)
          }
          {/* Split Section */}
          <View style={[ step !== 3 ? { display: 'none' } : { flex: 0 } ]}>
            <FormStepContainer step={step} setStep={setStep} stepPosition={3} icon={<MaterialIcons name="navigate-next" size={32} color="white" />} title={t('formUnevenPayment.splitPaymentAmounts')} onNext={handleSubmit} >
              <ScrollView>
                {amount && (<Text style={[baseStyles.textCenter, baseStyles.titleBold40, { marginTop: 20 }, amountsSum() < 0 ? { color: 'red' } : { color: 'black' }]}>${amountsSum()}</Text>)}
                {users.map(user => {
                  const amountObj = amounts.find(a => a.user_id === user.id);

                  return (
                    <View key={user.id} style={{ marginVertical: 2 }}>
                      <Text>{user.name}</Text>
                      <View style={{
                        flexDirection: 'row', alignItems: 'center',
                        gap: 10,
                      }}>
                        <Avatar name={user.name}></Avatar>
                        <TextInput
                          style={[baseStyles.input, { flex: 1 }]}
                          keyboardType="numeric"
                          value={amountObj ? amountObj.amount : ""}
                          onChangeText={text => handleAmountChange(user.id, text)}
                        />
                      </View>
                    </View>
                  );
                })}
              </ScrollView>
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