import { updatePromise, createPromise, getPromiseDetail, findFriends } from "@/services/api";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
  StyleSheet,
  Platform
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { router, useLocalSearchParams } from "expo-router";
import * as Haptics from 'expo-haptics';
import { useTranslation } from 'react-i18next';

import LabeledInput from "@/presentational/LabeledInput";
import MoneyInput from "@/presentational/MoneyInput";
import PercentageInput from "@/presentational/PercentageInput";
import DateInput from "@/presentational/DateInput";
import ContactSelector from "@/presentational/ContactSelector";
import { colors, spacing, typography, shadows } from '@/theme';

export default function FormPromise() {
  const { t } = useTranslation();
  const { administrator_id, paymentable_id } = useLocalSearchParams();
  const [friends, setFriends] = useState([]);
  const [selectedContactId, setSelectedContactId] = useState(administrator_id || null);
  const [promise, setPromise] = useState({
    title: '',
    total: '',
    amount_payments: '',
    payment_period: 'month',
    interest: '',
    start_date: new Date(),
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchFriends();
    if (paymentable_id) {
      fetchPromiseData();
    }
  }, [paymentable_id]);

  const fetchFriends = async () => {
    try {
      const response = await findFriends("");
      setFriends(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchPromiseData = async () => {
    try {
      const response = await getPromiseDetail(paymentable_id);
      setPromise({
        ...response.data.promise,
        start_date: new Date(response.data.promise.start_date || Date.now())
      });
      setSelectedContactId(response.data.promise.administrator_id);
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (field, value) => {
    setPromise((prevPromise) => ({
      ...prevPromise,
      [field]: value,
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!selectedContactId) newErrors.contact = "Please select a contact";
    if (!promise.title) newErrors.title = "Title is required";
    if (!promise.total) newErrors.total = "Total amount is required";
    if (isNaN(promise.total)) newErrors.total = "Amount must be a valid number";
    if (!promise.amount_payments) newErrors.amount_payments = "Payment amount is required";
    if (isNaN(promise.amount_payments)) newErrors.amount_payments = "Payment amount must be a valid number";
    if (!promise.payment_period) newErrors.payment_period = "Payment interval is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    const promiseData = {
      ...promise,
      administrator_id: selectedContactId,
    };

    if (paymentable_id) {
      updatePromise(paymentable_id, promiseData)
        .then((response) => {
          router.replace({ pathname: '/promiseShow', params: { id: paymentable_id } });
        })
        .catch((error) => {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        });
    } else {
      createPromise(promiseData)
        .then((response) => {
          router.replace({ pathname: '/promiseShow', params: { id: response.data.id } });
        })
        .catch((error) => {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        });
    }
  };

  const canCreate = selectedContactId && promise.title && promise.total && promise.amount_payments;

  return (
    <>
      <View style={styles.container}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Contact Selector */}
          <ContactSelector
            label="Select Contact"
            contacts={friends}
            selectedContactId={selectedContactId}
            onSelectContact={setSelectedContactId}
          />

          {/* Title */}
          <LabeledInput
            testID="promise-title-input"
            label="Title"
            value={promise.title}
            onChangeText={(text) => handleChange('title', text)}
            placeholder="e.g., Laptop loan, Concert tickets"
            error={errors.title}
          />

          {/* Total Amount */}
          <MoneyInput
            testID="promise-total-input"
            label="Total Amount"
            value={promise.total}
            onChangeText={(text) => handleChange('total', text)}
            error={errors.total}
          />

          {/* Interest (Optional) */}
          <PercentageInput
            label="Interest (Optional)"
            value={promise.interest}
            onChangeText={(text) => handleChange('interest', text)}
            subtitle="Interest rate as a percentage"
          />

          {/* Payment Schedule Section */}
          <View style={styles.scheduleSection}>
            <Text style={styles.scheduleTitle}>Payment Schedule</Text>

            {/* Payment Amount */}
            <MoneyInput
              testID="promise-payment-amount-input"
              label="Payment Amount"
              value={promise.amount_payments}
              onChangeText={(text) => handleChange('amount_payments', text)}
              error={errors.amount_payments}
            />

            {/* Payment Interval */}
            <View style={styles.pickerContainer}>
              <Text style={styles.pickerLabel}>Payment Interval</Text>
              <View style={styles.pickerWrapper}>
                <Picker
                  selectedValue={promise.payment_period}
                  onValueChange={(value) => handleChange('payment_period', value)}
                  style={styles.picker}
                >
                  <Picker.Item label="Daily" value="day" />
                  <Picker.Item label="Weekly" value="week" />
                  <Picker.Item label="Bi-weekly" value="biweek" />
                  <Picker.Item label="Monthly" value="month" />
                </Picker>
              </View>
              {errors.payment_period && (
                <Text style={styles.errorText}>{errors.payment_period}</Text>
              )}
            </View>

            {/* Start Date */}
            <DateInput
              label="Start Date"
              value={promise.start_date}
              onChange={(date) => handleChange('start_date', date)}
            />
          </View>

          {/* Bottom Spacing */}
          <View style={{ height: spacing.xl }} />
        </ScrollView>

        {/* Create Promise Button - Bottom Fixed */}
        <View style={styles.bottomButtonContainer}>
          <TouchableOpacity
            testID="promise-create-submit"
            style={[
              styles.createButton,
              !canCreate && styles.createButtonDisabled
            ]}
            onPress={handleSave}
            disabled={!canCreate}
            activeOpacity={0.8}
          >
            <Text style={[
              styles.createButtonText,
              !canCreate && styles.createButtonTextDisabled
            ]}>
              {paymentable_id ? 'Update Promise' : 'Create Promise'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: 100,
  },
  scheduleSection: {
    backgroundColor: '#eef2ff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#c6d2ff',
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  scheduleTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: spacing.lg,
  },
  pickerContainer: {
    marginBottom: spacing.lg,
  },
  pickerLabel: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  pickerWrapper: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border.light,
    overflow: 'hidden',
  },
  picker: {
    height: Platform.OS === 'ios' ? 150 : 50,
    width: '100%',
  },
  errorText: {
    fontSize: 13,
    color: colors.financial.negative,
    marginTop: spacing.xs,
  },
  bottomButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
    ...shadows.md,
  },
  createButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: spacing.md,
    alignItems: 'center',
    ...shadows.sm,
  },
  createButtonDisabled: {
    backgroundColor: colors.surfaceVariant,
  },
  createButtonText: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.surface,
  },
  createButtonTextDisabled: {
    color: colors.text.tertiary,
  },
});
