import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, TouchableWithoutFeedback, Keyboard, Modal, ScrollView, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

import baseStyles from '@/presentational/BaseStyles';
import AvatarInfoHeader from '@/presentational/AvatarInfoHeader';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import { createPayment, updatePayment } from '@/services/api';
import { Picker } from '@react-native-picker/picker';
import InputWithLabel from '@/presentational/InputWithLabel';

function Keypad({ onKeyPress, onSubmit, submitLabel }) {
  return (
    <View style={{flex: 3}}>
      {[
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
        ['.', '0', '⌫'],
      ].map((row, id) => (
        <View key={id} style={[baseStyles.keypadRow]}>
          {row.map((num) => (
        <TouchableOpacity
          key={num}
          style={baseStyles.keypadButton}
          onPress={() => onKeyPress(num.toString())}
        >
          <Text style={baseStyles.keypadText}>{num}</Text>
        </TouchableOpacity>
          ))}
        </View>
      ))}
      <View style={[baseStyles.keypadRow, { flex: 1 }]}>
        <TouchableOpacity
          style={[baseStyles.button, baseStyles.saveButton, { paddingHorizontal: '30%' }]}
          onPress={onSubmit}
        >
          <Text style={baseStyles.buttonText}>{submitLabel}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function SuccessModal({ visible, total, onClose, onBack }) {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={baseStyles.modalContainer}>
        <View style={baseStyles.modalContent}>
          <Feather name="check-circle" size={120} style={{ marginTop: 50 }} color="#4CAF50" />
          <Text style={[baseStyles.title24, { marginBottom: 50 }]}>Payment Successful</Text>
          <Text style={[baseStyles.titleBold40, { marginBottom: 50 }]}>${total}</Text>
          <TouchableOpacity
            style={[baseStyles.circleButton, baseStyles.saveButton, { width: 60, height: 60, borderRadius: 50 }]}
            onPress={onBack}
          >
            <MaterialIcons name="navigate-next" size={50} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

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

  const handleAmountChange = (text) => {
    setAmount(text);
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
          <AvatarInfoHeader user={params.recipient_name} text={`Sending to`} />
          {/* Amount Display Section */}
          {step === 1 && (
            <View style={[baseStyles.containerCard, { gap: 15, marginVertical: 10, padding: 20, flex: 1 }]}>
              <Text style={[baseStyles.title17]}> Payment Information </Text>
              <InputWithLabel label='Concept' name='concept' value={concept} onChangeText={(_name, value) => setConcept(value)} placeholder="Add a concept" error={null} editable={true} />
              {params.members && (
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
              <Pressable style={[baseStyles.button, baseStyles.saveButton, { position: 'absolute', padding: 15, bottom: 50, width: '100%', justifyContent: 'center', alignItems: 'center' , alignSelf: 'center'}]} onPress={() => setStep(2)}>
                <Text style={baseStyles.buttonText}>Next</Text>
              </Pressable>
            </View>
          )}
          {
            step === 2 && (
              <View style={[baseStyles.containerCard, { flex: 1 }]}>
                <View style={{ flex: 1 }}>
                  <TextInput
                    placeholder="0"
                    placeholderTextColor="#666"
                    style={[baseStyles.money, { width: '100%', marginBottom: 20, textAlign: "center", fontSize: amount.length < 4 ? 100 : 400 / amount.length, marginTop: 50 }]}
                    value={`$ ${amount}`}
                    onChangeText={handleAmountChange}
                    editable={false}
                    keyboardType="numeric"
                  />
                  {params.amout_payment && (<Text style={[baseStyles.textCenter, baseStyles.label14, baseStyles.textGray]}>Suggested amount ${params.amount_payments}</Text>)}
                </View>

                {/* Keypad Section */}
                <Keypad
                  onKeyPress={handleKeyPress}
                  onSubmit={handleSubmit}
                  submitLabel={params.payment_id ? 'Update Payment' : 'Fair Pay'}
                />
              </View>
            )
          }
        </View>
      </TouchableWithoutFeedback>

      <SuccessModal
        visible={isModalVisible}
        total={amount}
        onClose={() => setModalVisible(false)}
        onBack={() => router.back()}
      />
    </>
  );
}