import axios from 'axios';
import React, { useState } from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity, Text, Dimensions, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { useSession } from '@/services/authContext';
import baseStyles from '@/presentational/BaseStyles';
import AvatarInfoHeader from '@/presentational/AvatarInfoHeader';
import { useToast } from '@/services/ToastContext';

const { height } = Dimensions.get('window');

export default function addPayment() {
  const router = useRouter();
  const { session } = useSession();
  const params = useLocalSearchParams();
  const { showToast } = useToast();
  
  const [showConcept, setShowConcept] = useState(false);
  const [concept, setConcept] = useState(params.title || '');
  const [amount, setAmount] = useState(() => {
    if (!params.amount) return '0';
    return params.amount.replace(/[$,]/g, '') || '0';
  });

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
    if (!session) {
      showToast('No session available');
      return;
    }

    try {
      if (params.payment_id) {
        await axios.patch(
          `${process.env.EXPO_PUBLIC_API}/payments/${params.payment_id}`,
          paymentUpdateValues(),
          session
        );
        showToast('Payment updated successfully', 'success');
      } else {
        await axios.post(
          `${process.env.EXPO_PUBLIC_API}/payments/`,
          paymentCreationValues(),
          session
        );
        showToast('Payment created successfully', 'success');
      }
      router.back();
    } catch (error) {
      console.error('Error:', error);
      showToast(error.response?.data?.message || 'An error occurred');
    }
  };

  return (
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
            <View style={[baseStyles.viewAsRowCenter, { alignItems: 'center' }]}>
              <Text style={baseStyles.titleBold40}>$</Text>
              <TextInput
                placeholder="0"
                placeholderTextColor="#666"
                style={[styles.money, { fontSize: amount.length < 4 ? 100 : 400 / amount.length }]}
                value={amount}
                onChangeText={handleAmountChange}
                editable={false} 
                keyboardType="numeric"
              />
            </View>
            { params.amout_payment && (<Text style={[baseStyles.textCenter, baseStyles.label14, baseStyles.textGray]}>Suggested amount ${params.amount_payments}</Text>)}
          </View>

          {/* Keypad Section */}
          <View style={{ flex: 4 }}>
            <View style={[styles.keypadRow, { flex: 1 }]}>
              <TouchableOpacity style={styles.keypadButton} onPress={() => handleKeyPress('1')}>
                <Text style={styles.keypadText}>1</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.keypadButton} onPress={() => handleKeyPress('2')}>
                <Text style={styles.keypadText}>2</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.keypadButton} onPress={() => handleKeyPress('3')}>
                <Text style={styles.keypadText}>3</Text>
              </TouchableOpacity>
            </View>
            <View style={[styles.keypadRow, { flex: 1 }]}>
              <TouchableOpacity style={styles.keypadButton} onPress={() => handleKeyPress('4')}>
                <Text style={styles.keypadText}>4</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.keypadButton} onPress={() => handleKeyPress('5')}>
                <Text style={styles.keypadText}>5</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.keypadButton} onPress={() => handleKeyPress('6')}>
                <Text style={styles.keypadText}>6</Text>
              </TouchableOpacity>
            </View>
            <View style={[styles.keypadRow, { flex: 1 }]}>
              <TouchableOpacity style={styles.keypadButton} onPress={() => handleKeyPress('7')}>
                <Text style={styles.keypadText}>7</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.keypadButton} onPress={() => handleKeyPress('8')}>
                <Text style={styles.keypadText}>8</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.keypadButton} onPress={() => handleKeyPress('9')}>
                <Text style={styles.keypadText}>9</Text>
              </TouchableOpacity>
            </View>
            <View style={[styles.keypadRow, { flex: 1 }]}>
              <TouchableOpacity style={styles.keypadButton} onPress={() => handleKeyPress('.')}>
                <Text style={styles.keypadText}>.</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.keypadButton} onPress={() => handleKeyPress('0')}>
                <Text style={styles.keypadText}>0</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.keypadButton} onPress={() => handleKeyPress('⌫')}>
                <Text style={styles.keypadText}>⌫</Text>
              </TouchableOpacity>
            </View>
            <View style={[styles.keypadRow, { flex: 1 }]}>
              <TouchableOpacity
                style={[baseStyles.button, baseStyles.saveButton, { paddingHorizontal: '30%'}]}
                onPress={() => handleSubmit()}
              >
                <Text style={baseStyles.buttonText}>
                  {params.payment_id ? 'Update Payment' : 'Fair Pay'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  money: {
    fontSize: 70,
    fontWeight: 'bold',
    textAlign: 'left',
    color: '#000000',
    width: '70%',
  },
  keypadRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: height * 0.01,
  },
  keypadButton: {
    width: height * 0.1,
    height: height * 0.1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: height * 0.05,
    margin: height * 0.01,
  },
  keypadText: {
    fontSize: height * 0.04,
    color: '#000000',
  },
});