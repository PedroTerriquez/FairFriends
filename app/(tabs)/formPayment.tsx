import axios from 'axios';
import React, { useState } from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity, Text } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { useSession } from '@/services/authContext';
import Avatar from '@/presentational/Avatar';
import baseStyles from '@/presentational/BaseStyles';

export default function addPayment() {
  const router = useRouter();
  const { session } = useSession();
  const params = useLocalSearchParams();
  
  const [title, setTitle] = useState(params.title || '');
  const [amount, setAmount] = useState(params.amount || '');

  const paymentCreationValues = () => {
    return {
      title,
      amount,
      paymentable_id: params.paymentable_id,
      paymentable_type: params.type,
      recipient_id: params.recipient_id,
    };
  };

  const paymentUpdateValues = () => {
    return {
      id: params.payment_id,
      title,
      amount,
    };
  };

  const handleSubmit = async () => {
    if (!session) {
      console.error('No session available');
      return;
    }

    try {
        debugger
      if (params.payment_id) {
        await axios.patch(
          `${process.env.EXPO_PUBLIC_API}/payments/${params.payment_id}`,
          paymentUpdateValues(),
          session
        );
      } else {
        await axios.post(
          `${process.env.EXPO_PUBLIC_API}/payments/`,
          paymentCreationValues(),
          session
        );
      }
      router.back();
    } catch (error: any) {
      console.error('Error:', error);
    }
  };

  return (
    <View style={[baseStyles.viewContainer, baseStyles.card]}>
      <View style={[baseStyles.card, baseStyles.rightColumn, { marginBottom: 40 }]}>
        <Avatar name={params.recipient_name[0] || '?'} />
        <Text style={[styles.marginTop10, baseStyles.marginLeft]}>
          Sending payment to {params.recipient_name}
        </Text>
      </View>
      
      <TextInput
        autoFocus
        style={baseStyles.title}
        placeholder="Editable text payment title"
        value={title}
        onChangeText={setTitle}
      />
      
      <View style={styles.inlineElements}>
        <Text style={styles.boldText60}>$</Text>
        <TextInput
          placeholder="0"
          style={styles.money}
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
        />
      </View>
      
      <View style={styles.inlineElements}>
        <TouchableOpacity
          style={[baseStyles.button, baseStyles.saveButton]}
          onPress={handleSubmit}
        >
          <Text style={baseStyles.buttonText}>
            {params.payment_id ? 'Update Payment' : 'Cool Pay'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  inlineElements: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
    width: '100%',
  },
  marginTop10: {
    marginTop: 10,
    fontSize: 16,
    color: '#000000',
  },
  boldText60: {
    fontSize: 60,
    fontWeight: 'bold',
    color: '#000000',
    textAlign: 'center',
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingLeft: 6,
    marginVertical: 20,
    color: '#000000',
  },
  money: {
    fontSize: 50,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#000000',
    width: 200,
    padding: 0,
  },
  email: {
    color: '#666',
    marginBottom: 20,
  },
});