import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Platform, Modal } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { createPayment, updatePayment } from '@/services/api';
import { useTranslation } from 'react-i18next';
import * as Haptics from 'expo-haptics';
import DateTimePicker from '@react-native-community/datetimepicker';

import { colors, spacing, shadows } from '@/theme';
import SegmentedControl from '@/presentational/SegmentedControl';
import Avatar from '@/presentational/Avatar';
import SuccessPaymentModal from '@/presentational/SuccessPaymentModal';
import PaymentKeyPad from '@/presentational/PaymentKeypad';
import CustomTextInput from '@/presentational/CustomTextInput';

/**
 * formPayment - Single-page form matching reference design
 * Toggle at top controls split type and shows/hides "Who paid what?" section
 */

const CATEGORIES = [
  { value: 'food', label: 'Food & Dining', emoji: '🍔' },
  { value: 'transportation', label: 'Transportation', emoji: '🚗' },
  { value: 'activities', label: 'Entertainment', emoji: '🎭' },
  { value: 'utilities', label: 'Utilities', emoji: '💡' },
  { value: 'accommodation', label: 'Rent & Housing', emoji: '🏠' },
  { value: 'groceries', label: 'Shopping', emoji: '🛍️' },
  { value: 'other', label: 'Other', emoji: '⚪' },
];

export default function FormPayment() {
  const { t } = useTranslation();
  const router = useRouter();
  const params = useLocalSearchParams();

  const isBalance = params.type === 'Balance';
  const isEditing = !!params.payment_id;
  const members = params.members ? JSON.parse(params.members) : [];

  // Form state
  const [splitType, setSplitType] = useState('equal');
  const [title, setTitle] = useState(params.title || '');
  const [total, setTotal] = useState(params.amount ? String(params.amount).replace(/[^0-9.]/g, '') : '0');
  const [category, setCategory] = useState(params.category || '');
  const [location, setLocation] = useState(params.location || '');
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState('');
  const [receipt, setReceipt] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showKeyPad, setShowKeyPad] = useState(false);

  // Who paid what - for unequal split
  const [payers, setPayers] = useState([
    { id: 1, userId: members[0]?.id || null, name: 'You', amount: '0.00' }
  ]);

  const [isModalVisible, setModalVisible] = useState(false);
  const [showMemberSelector, setShowMemberSelector] = useState(false);
  const [selectingForPayerId, setSelectingForPayerId] = useState(null);

  const handleSplitTypeChange = (key) => {
    setSplitType(key);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleCategorySelect = (value) => {
    setCategory(value);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleAddPayer = () => {
    setPayers([...payers, { id: Date.now(), userId: null, name: '', amount: '0.00' }]);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleRemovePayer = (id) => {
    if (payers.length > 1) {
      setPayers(payers.filter(p => p.id !== id));
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const handleKeyPress = (key) => {
    if (key === '⌫') {
      setTotal(prev => prev.slice(0, -1) || '0');
    } else {
      setTotal(prev => prev === '0' ? key : prev + key);
    }
  };

  const updatePayerAmount = (id, amount) => {
    setPayers(payers.map(p => p.id === id ? { ...p, amount } : p));

    // Auto-calculate total if unequal split
    if (splitType === 'uneven') {
      const sum = payers.reduce((acc, p) => {
        const amt = p.id === id ? amount : p.amount;
        return acc + (parseFloat(amt.replace(/[^0-9.]/g, '')) || 0);
      }, 0);
      setTotal(sum.toFixed(2));
    }
  };

  const updatePayerSelection = (id, userId, name) => {
    setPayers(payers.map(p => p.id === id ? { ...p, userId, name } : p));
  };

  const handleOpenMemberSelector = (payerId) => {
    setSelectingForPayerId(payerId);
    setShowMemberSelector(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleSelectMember = (member) => {
    updatePayerSelection(selectingForPayerId, member.id, member.name);
    setShowMemberSelector(false);
    setSelectingForPayerId(null);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  // Get available members (not already selected)
  const getAvailableMembers = () => {
    const selectedUserIds = payers.map(p => p.userId).filter(Boolean);
    return members.filter(m => !selectedUserIds.includes(m.id));
  };

  const handleSubmit = async () => {
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      const isUnevenSplit = isBalance && splitType === 'uneven';

      const paymentParams = {
        title,
        amount: parseFloat(total.replace(/[^0-9.]/g, '')),
        category,
        creator_id: payers[0].userId || members[0]?.id,
        paymentable_id: params.paymentable_id,
        paymentable_type: params.type,
        location,
        recipient_id: params.recipient_id,
        date: date.toISOString(),
        notes,
        ...(isUnevenSplit && {
          uneven_amounts: payers
            .filter(p => p.userId)
            .map(p => ({
              user_id: p.userId,
              amount: parseFloat(String(p.amount).replace(/[^0-9.]/g, '')) || 0,
            })),
        }),
      };

      if (isEditing) {
        await updatePayment(params.payment_id, { ...paymentParams, id: params.payment_id });
      } else {
        await createPayment(paymentParams);
      }

      setModalVisible(true);
    } catch (error) {
      console.error('Error:', error);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  };

  const formatDateDisplay = (date) => {
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  return (
    <>
      <View style={styles.container}>
        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Split Type Toggle - Only for balances */}
          {isBalance && (
            <View style={styles.section}>
              <SegmentedControl
                segments={[
                  { key: 'equal', label: 'Split Equally' },
                  { key: 'uneven', label: 'Split Unequally' },
                ]}
                selectedKey={splitType}
                onSelect={handleSplitTypeChange}
              />
            </View>
          )}

          {/* What was this for? */}
          <CustomTextInput
            testID="payment-title-input"
            label="What was this for?"
            value={title}
            onChangeText={setTitle}
            placeholder="e.g., Dinner at Italian restaurant"
          />

          {/* Total (only show if split equally, or not a balance) */}
          {(splitType === 'equal' || !isBalance) && (
            <View style={styles.section}>
              <Text style={styles.label}>Total {splitType === 'uneven' && '(calculated)'}</Text>
              <View style={styles.amountInputWrapper}>
                <Text style={styles.currencySymbol}>$</Text>
                <TextInput
                  testID="payment-total-input"
                  style={styles.amountInput}
                  value={total}
                  onFocus={() => setShowKeyPad(true)}
                  placeholder="0.00"
                  keyboardType="decimal-pad"
                  placeholderTextColor={colors.text.tertiary}
                  editable={splitType === 'equal'}
                />
              </View>
            </View>
          )}

          {/* Category */}
          <View style={styles.section}>
            <Text style={styles.label}>Category</Text>
            <View style={styles.categoryGrid}>
              {CATEGORIES.map((cat) => (
                <TouchableOpacity
                  key={cat.value}
                  testID={`payment-category-${cat.value}`}
                  style={[
                    styles.categoryButton,
                    category === cat.value && styles.categoryButtonSelected,
                  ]}
                  onPress={() => handleCategorySelect(cat.value)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.categoryEmoji}>{cat.emoji}</Text>
                  <Text style={[
                    styles.categoryText,
                    category === cat.value && styles.categoryTextSelected
                  ]}>
                    {cat.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Who paid what? - Show if unequal split */}
          {isBalance && splitType === 'uneven' && (
            <View style={styles.section}>
              <Text style={styles.label}>Who paid what?</Text>

              {payers.map((payer, index) => (
                <View key={payer.id} style={styles.payerRow}>
                  <View style={styles.payerCard}>
                    {/* Person selector */}
                    <View style={styles.payerHeader}>
                      {index === 0 ? (
                        <View style={styles.payerInfoRow}>
                          <Avatar name="You" size={32} />
                          <Text style={styles.payerName}>You</Text>
                        </View>
                      ) : (
                        <TouchableOpacity
                          style={styles.payerSelector}
                          onPress={() => handleOpenMemberSelector(payer.id)}
                          activeOpacity={0.7}
                        >
                          {payer.userId ? (
                            <View style={styles.payerInfoRow}>
                              <Avatar name={payer.name} size={24} />
                              <Text style={styles.payerSelectedText}>{payer.name}</Text>
                            </View>
                          ) : (
                            <Text style={styles.payerSelectorText}>Select person...</Text>
                          )}
                          <Ionicons name="chevron-down" size={20} color={colors.text.secondary} />
                        </TouchableOpacity>
                      )}

                      {index > 0 && (
                        <TouchableOpacity
                          onPress={() => handleRemovePayer(payer.id)}
                          style={styles.removeButton}
                        >
                          <Ionicons name="close-circle" size={20} color={colors.text.tertiary} />
                        </TouchableOpacity>
                      )}
                    </View>

                    {/* Amount input */}
                    <View style={styles.amountInputWrapper}>
                      <Text style={styles.currencySymbol}>$</Text>
                      <TextInput
                        style={styles.amountInput}
                        value={payer.amount}
                        onChangeText={(text) => updatePayerAmount(payer.id, text)}
                        placeholder="0.00"
                        keyboardType="decimal-pad"
                        placeholderTextColor={colors.text.tertiary}
                      />
                    </View>
                  </View>
                </View>
              ))}

              {/* Add Person Button */}
              {payers.length < members.length && (
                <TouchableOpacity
                  style={styles.addPersonButton}
                  onPress={handleAddPayer}
                  activeOpacity={0.7}
                >
                  <Ionicons name="add" size={20} color={colors.primary} />
                  <Text style={styles.addPersonText}>Add Person</Text>
                </TouchableOpacity>
              )}

              {/* Show calculated total */}
              <View style={[styles.section, { marginTop: spacing.md }]}>
                <Text style={styles.label}>Total (calculated)</Text>
                <View style={styles.amountInputWrapper}>
                  <Text style={styles.currencySymbol}>$</Text>
                  <TextInput
                    style={[styles.amountInput, { color: colors.text.secondary }]}
                    value={total}
                    editable={false}
                    placeholder="0.00"
                    placeholderTextColor={colors.text.tertiary}
                  />
                </View>
              </View>
            </View>
          )}

          {/* Location (Optional) */}
          <View style={styles.section}>
            <Text style={styles.label}>Location (Optional)</Text>
            <View style={styles.inputWithIcon}>
              <Ionicons name="location-outline" size={20} color={colors.text.secondary} />
              <TextInput
                style={[styles.textInput, { width: '100%' }]}
                value={location}
                onChangeText={setLocation}
                placeholder="Where did this happen?2"
                placeholderTextColor={colors.text.tertiary}
              />
            </View>
          </View>

          {/* Date */}
          <View style={styles.section}>
            <Text style={styles.label}>Date</Text>
            <TouchableOpacity
              style={styles.inputWithIcon}
              onPress={() => setShowDatePicker(true)}
            >
              <Ionicons name="calendar-outline" size={20} color={colors.text.secondary} />
              <Text style={styles.dateText}>{formatDateDisplay(date)}</Text>
            </TouchableOpacity>

            {showDatePicker && (
              <DateTimePicker
                value={date}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={(event, selectedDate) => {
                  setShowDatePicker(Platform.OS === 'ios');
                  if (selectedDate) {
                    setDate(selectedDate);
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  }
                }}
              />
            )}
          </View>

          {/* Add Receipt (Optional) */}
          <View style={styles.section}>
            <Text style={styles.label}>Add Receipt (Optional)</Text>
            <TouchableOpacity
              style={styles.receiptUpload}
              activeOpacity={0.7}
            >
              <Ionicons name="image-outline" size={40} color={colors.text.tertiary} />
              <Text style={styles.receiptText}>Tap to upload image</Text>
            </TouchableOpacity>
          </View>

          {/* Notes (Optional) */}
          <View style={styles.section}>
            <Text style={styles.label}>Notes (Optional)</Text>
            <TextInput
              style={[styles.textInput, styles.notesInput]}
              value={notes}
              onChangeText={setNotes}
              placeholder="Add any additional details..."
              placeholderTextColor={colors.text.tertiary}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>

          <View style={{ height: 100 }} />
        </ScrollView>

        {/* Submit Button */}
        <View style={styles.footer}>
          <TouchableOpacity
            testID="payment-submit"
            style={styles.submitButton}
            onPress={handleSubmit}
            activeOpacity={0.8}
          >
            <Text style={styles.submitButtonText}>
              {isEditing ? 'Update Payment' : 'Add Payment'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {showKeyPad && (
        <View style={[styles.container, { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 999, elevation: 999 }]}>
          <PaymentKeyPad
            amount={total}
            amountSuggestion={params.amount_payments}
            onKeyPress={handleKeyPress}
            handleSubmit={() => setShowKeyPad(false)}
          />
        </View>
      )}

      <SuccessPaymentModal
        visible={isModalVisible}
        total={total}
        onClose={() => setModalVisible(false)}
        onBack={() => router.back()}
      />

      {/* Member Selector Modal */}
      <Modal
        visible={showMemberSelector}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowMemberSelector(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.memberSelectorModal}>
            <View style={styles.memberSelectorHeader}>
              <Text style={styles.memberSelectorTitle}>Select Member</Text>
              <TouchableOpacity onPress={() => setShowMemberSelector(false)}>
                <Ionicons name="close" size={24} color={colors.text.secondary} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.memberList}>
              {getAvailableMembers().map((member) => (
                <TouchableOpacity
                  key={member.id}
                  style={styles.memberOption}
                  onPress={() => handleSelectMember(member)}
                  activeOpacity={0.7}
                >
                  <Avatar name={member.name} size={40} />
                  <Text style={styles.memberOptionText}>{member.name}</Text>
                  <Ionicons name="chevron-forward" size={20} color={colors.text.tertiary} />
                </TouchableOpacity>
              ))}
              {getAvailableMembers().length === 0 && (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyStateText}>All members already added</Text>
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  backButton: {
    padding: spacing.xs,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text.primary,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: spacing.lg,
  },
  section: {
    marginBottom: spacing.lg,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  textInput: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.md,
    fontSize: 16,
    color: colors.text.primary,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  amountInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    gap: spacing.xs,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  currencySymbol: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text.secondary,
  },
  amountInput: {
    flex: 1,
    fontSize: 20,
    fontWeight: '600',
    color: colors.text.primary,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  categoryButton: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.md,
    gap: spacing.sm,
    borderWidth: 2,
    borderColor: colors.border.light,
    ...shadows.sm,
  },
  categoryButtonSelected: {
    backgroundColor: '#FFF3E0',
    borderColor: '#FF9800',
  },
  categoryEmoji: {
    fontSize: 24,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
    flex: 1,
  },
  categoryTextSelected: {
    color: '#F57C00',
  },
  payerRow: {
    marginBottom: spacing.sm,
  },
  payerCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  payerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  payerInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flex: 1,
  },
  payerName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
  },
  payerSelector: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderRadius: 8,
    padding: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  payerSelectorText: {
    fontSize: 15,
    color: colors.text.tertiary,
  },
  payerSelectedText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text.primary,
  },
  removeButton: {
    padding: spacing.xs,
  },
  addPersonButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.md,
    gap: spacing.xs,
    borderWidth: 1,
    borderColor: colors.border.light,
    borderStyle: 'dashed',
  },
  addPersonText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.primary,
  },
  dateText: {
    fontSize: 16,
    color: colors.text.primary,
    flex: 1,
  },
  receiptUpload: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.border.light,
    borderStyle: 'dashed',
    minHeight: 120,
  },
  receiptText: {
    fontSize: 14,
    color: colors.text.tertiary,
    marginTop: spacing.sm,
  },
  notesInput: {
    height: 80,
    paddingTop: spacing.md,
  },
  footer: {
    padding: spacing.md,
    backgroundColor: 'transparent',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.06)',
    paddingBottom: Platform.OS === 'ios' ? spacing.xl : spacing.md,
  },
  submitButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: spacing.lg,
    alignItems: 'center',
    ...shadows.md,
  },
  submitButtonText: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.surface,
  },
  // Member Selector Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  memberSelectorModal: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '70%',
    ...shadows.lg,
  },
  memberSelectorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  memberSelectorTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text.primary,
  },
  memberList: {
    padding: spacing.lg,
  },
  memberOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.background,
    borderRadius: 12,
    marginBottom: spacing.sm,
    gap: spacing.sm,
  },
  memberOptionText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
  },
  emptyState: {
    padding: spacing.xl,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 15,
    color: colors.text.secondary,
  },
});
