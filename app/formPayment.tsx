import axios from 'axios';
import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, Dimensions, TouchableWithoutFeedback, Keyboard, Modal } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

import baseStyles from '@/presentational/BaseStyles';
import AvatarInfoHeader from '@/presentational/AvatarInfoHeader';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import { createPayment, updatePayment } from '@/services/api';

const { height } = Dimensions.get('window');

function Keypad({ onKeyPress, onSubmit, submitLabel }) {
  return (
    <View style={{ flex: 4 }}>
      {[
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
        ['.', '0', '⌫'],
      ].map((row, id) => (
        <View key={id} style={[baseStyles.keypadRow, { flex: 1 }]}>
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

function SuccessModal({ visible, onClose, onBack }) {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={baseStyles.modalContainer}>
        <View style={baseStyles.modalContent}>
          <Feather name="check-circle" size={120} color="#4CAF50" />
          <Text style={[baseStyles.title24, { marginBottom: 100 }]}>Payment Successful</Text>
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
  
  const [showConcept, setShowConcept] = useState(false);
  const [concept, setConcept] = useState(params.title || '');
  const [amount, setAmount] = useState(() => {
    if (!params.amount) return '0';
    return params.amount.replace(/[$,]/g, '') || '0';
  });
  const [isModalVisible, setModalVisible] = useState(false);

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
    };
  };

  const paymentUpdateValues = () => {
    return {
      id: params.payment_id,
      title: concept,
      amount: parseFloat(amount),
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
        <View style={[baseStyles.viewContainerFull, { flex: 1 }]}>
          <View style={{ flex: 1 }}>
            {/* Header Section */}
            <View style={{ flex: 1.5 }}>
              <View style={[baseStyles.alignItemsCenter, { marginVertical: 20 }]}>
                <AvatarInfoHeader user={params.recipient_name} text={`Sending to`} />
              </View>
              <View style={{ paddingHorizontal: 40 }}>
                {!showConcept && <TouchableOpacity
                  style={[baseStyles.button, baseStyles.normalButton, { marginBottom: 10 }]}
                  onPress={() => setShowConcept(!showConcept)}
                >
                  <Text style={baseStyles.buttonText}>Add concept</Text>
                </TouchableOpacity>}

                {showConcept && (
                  <View>
                    <TextInput
                      style={baseStyles.input}
                      value={concept}
                      placeholder="Add a concept"
                      placeholderTextColor="#666"
                      onChangeText={(text) => setConcept(text)}
                    />
                  </View>
                )}
              </View>
            </View>

            {/* Amount Display Section */}
            <View style={{ flex: 1.5, justifyContent: 'center' }}>
              <View style={[baseStyles.rowCenter, { alignItems: 'center', padding: 30 }]}>
                <Text style={baseStyles.titleBold40}>$</Text>
                <TextInput
                  placeholder="0"
                  placeholderTextColor="#666"
                  style={[baseStyles.money, { fontSize: amount.length < 4 ? 100 : 400 / amount.length }]}
                  value={amount}
                  onChangeText={handleAmountChange}
                  editable={false} 
                  keyboardType="numeric"
                />
              </View>
              { params.amout_payment && (<Text style={[baseStyles.textCenter, baseStyles.label14, baseStyles.textGray]}>Suggested amount ${params.amount_payments}</Text>)}
            </View>

            {/* Keypad Section */}
            <Keypad
              onKeyPress={handleKeyPress}
              onSubmit={handleSubmit}
              submitLabel={params.payment_id ? 'Update Payment' : 'Fair Pay'}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>

      {/* Success Modal */}
      <SuccessModal
        visible={isModalVisible}
        onClose={() => setModalVisible(false)}
        onBack={() => router.back()}
      />
    </>
  );
}