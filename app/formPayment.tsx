import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Platform,
  Modal,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { createPayment, updatePayment } from '@/services/api';
import { useSession } from '@/services/authContext';
import { useTranslation } from 'react-i18next';
import * as Haptics from 'expo-haptics';
import DateTimePicker from '@react-native-community/datetimepicker';

import { colors, spacing, shadows } from '@/theme';
import SegmentedControl from '@/presentational/SegmentedControl';
import Avatar from '@/presentational/Avatar';
import SuccessPaymentModal from '@/presentational/SuccessPaymentModal';
import PaymentKeyPad from '@/presentational/PaymentKeypad';
import CustomTextInput from '@/presentational/CustomTextInput';
import ContactSelector from '@/presentational/ContactSelector';

const CATEGORIES = [
  { value: 1, label: 'Transportation', emoji: '🚗' },
  { value: 2, label: 'Entertainment', emoji: '🎭' },
  { value: 3, label: 'Utilities', emoji: '💡' },
  { value: 4, label: 'Rent & Housing', emoji: '🏠' },
  { value: 5, label: 'Shopping', emoji: '🛍️' },
  { value: 6, label: 'Social', emoji: '🎉' },
  { value: 7, label: 'Food & Dining', emoji: '🍔' },
  { value: 0, label: 'Other', emoji: '⚪' },
];

// 'total' or a payer id (number from Date.now())
type KeyPadTarget = 'total' | number;

export default function FormPayment() {
  const { t } = useTranslation();
  const router = useRouter();
  const params = useLocalSearchParams();
  const { user } = useSession();

  const isBalance = params.type === 'Balance';
  const isEditing = !!params.payment_id;
  const members = params.members ? JSON.parse(params.members as string) : [];
  const admin = params.admin === 'true';

  // ── Form state ──────────────────────────────────────────────────────
  const [splitType, setSplitType] = useState('equal');
  const [title, setTitle] = useState((params.title as string) || '');
  const [total, setTotal] = useState(
    params.amount ? String(params.amount).replace(/[^0-9.]/g, '') : '0'
  );
  const [category, setCategory] = useState(params.category || '');
  const [location, setLocation] = useState((params.location as string) || '');
  const [creator, setCreator] = useState(user?.id);
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState('');
  const [receipt, setReceipt] = useState(null);

  // ── Date picker ─────────────────────────────────────────────────────
  // tempDate holds the in-progress selection; only committed on "Confirm"
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [tempDate, setTempDate] = useState(new Date());

  // ── Keypad ──────────────────────────────────────────────────────────
  const [showKeyPad, setShowKeyPad] = useState(false);
  const [keyPadTarget, setKeyPadTarget] = useState<KeyPadTarget>('total');

  // ── Payers (uneven split) ───────────────────────────────────────────
  const [payers, setPayers] = useState([]);

  // ── Modals ──────────────────────────────────────────────────────────
  const [isModalVisible, setModalVisible] = useState(false);
  const [showMemberSelector, setShowMemberSelector] = useState(false);
  const [selectingForPayerId, setSelectingForPayerId] = useState(null);

  // ── Keypad helpers ──────────────────────────────────────────────────
  const openKeyPadForTotal = () => {
    setKeyPadTarget('total');
    setShowKeyPad(true);
  };

  const openKeyPadForPayer = (payerId: number) => {
    setKeyPadTarget(payerId);
    setShowKeyPad(true);
  };

  const closeKeyPad = () => setShowKeyPad(false);

  const getKeyPadAmount = (): string => {
    if (keyPadTarget === 'total') return total;
    const payer = payers.find(p => p.id === keyPadTarget);
    return payer ? String(payer.amount) : '0';
  };

  const handleKeyPress = (key: string) => {
    if (keyPadTarget === 'total') {
      setTotal(prev => {
        if (key === '⌫') return prev.slice(0, -1) || '0';
        return prev === '0' ? key : prev + key;
      });
    } else {
      setPayers(prev => {
        const updated = prev.map(p => {
          if (p.id !== keyPadTarget) return p;
          const current = String(p.amount);
          const next =
            key === '⌫'
              ? current.slice(0, -1) || '0'
              : current === '0' ? key : current + key;
          return { ...p, amount: next };
        });
        const sum = updated.reduce(
          (acc, p) => acc + (parseFloat(String(p.amount).replace(/[^0-9.]/g, '')) || 0),
          0
        );
        setTotal(sum.toFixed(2));
        return updated;
      });
    }
  };

  // ── Other handlers ──────────────────────────────────────────────────
  const handleSplitTypeChange = (key: string) => {
    setSplitType(key);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleCategorySelect = (value) => {
    setCategory(value);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleAddPayer = () => {
    setPayers([...payers, { id: Date.now(), userId: null, name: '', amount: '0' }]);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleRemovePayer = (id: number) => {
    if (payers.length > 1) {
      setPayers(prev => {
        const updated = prev.filter(p => p.id !== id);
        const sum = updated.reduce(
          (acc, p) => acc + (parseFloat(String(p.amount).replace(/[^0-9.]/g, '')) || 0),
          0
        );
        setTotal(sum.toFixed(2));
        return updated;
      });
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const updatePayerSelection = (id, userId, name) => {
    setPayers(payers.map(p => (p.id === id ? { ...p, userId, name } : p)));
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
        creator_id: creator || user?.id,
        paymentable_id: params.paymentable_id,
        paymentable_type: params.type,
        location,
        recipient_id: params.recipient_id,
        agreement_date: date.toISOString(),
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

  const formatDateDisplay = (d: Date) =>
    d.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });

  const formatAmountDisplay = (value: string) =>
    !value || value === '0' ? '0.00' : value;

  const isZeroAmount = (value: string) => !value || value === '0';

  // ── Render ───────────────────────────────────────────────────────────
  return (
    <>
      <View style={styles.container}>
        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Split Type Toggle */}
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

          {/* Paid on behalf of another member */}
          {admin && (
            <ContactSelector
              label="Another member paid for this?"
              contacts={members}
              selectedContactId={creator}
              onSelectContact={setCreator}
            />
          )}

          {/* Title */}
          <CustomTextInput
            testID="payment-title-input"
            label="What was this for?"
            value={title}
            onChangeText={setTitle}
            placeholder="e.g., Dinner at Italian restaurant"
          />

          {/* Total — TouchableOpacity prevents native keyboard on iOS */}
          {(splitType === 'equal' || !isBalance) && (
            <View style={styles.section}>
              <Text style={styles.label}>Total</Text>
              <TouchableOpacity
                testID="payment-total-input"
                style={styles.amountInputWrapper}
                onPress={openKeyPadForTotal}
                activeOpacity={0.7}
              >
                <Text style={styles.currencySymbol}>$</Text>
                <Text
                  style={[
                    styles.amountInput,
                    isZeroAmount(total) && styles.amountPlaceholder,
                  ]}
                >
                  {formatAmountDisplay(total)}
                </Text>
                <Ionicons name="pencil-outline" size={16} color={colors.text.tertiary} />
              </TouchableOpacity>
            </View>
          )}

          {/* Category */}
          <View style={styles.section}>
            <Text style={styles.label}>Category</Text>
            <View style={styles.categoryGrid}>
              {CATEGORIES.map(cat => (
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
                  <Text
                    style={[
                      styles.categoryText,
                      category === cat.value && styles.categoryTextSelected,
                    ]}
                  >
                    {cat.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Who paid what? (uneven split) */}
          {isBalance && splitType === 'uneven' && (
            <View style={styles.section}>
              <Text style={styles.label}>Who paid what?</Text>

              {payers.map((payer, index) => (
                <View key={payer.id} style={styles.payerRow}>
                  <View style={styles.payerCard}>
                    <View style={styles.payerHeader}>
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

                      {index > 0 && (
                        <TouchableOpacity
                          onPress={() => handleRemovePayer(payer.id)}
                          style={styles.removeButton}
                        >
                          <Ionicons name="close-circle" size={20} color={colors.text.tertiary} />
                        </TouchableOpacity>
                      )}
                    </View>

                    {/* Payer amount — no native keyboard */}
                    <TouchableOpacity
                      style={styles.amountInputWrapper}
                      onPress={() => openKeyPadForPayer(payer.id)}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.currencySymbol}>$</Text>
                      <Text
                        style={[
                          styles.amountInput,
                          isZeroAmount(String(payer.amount)) && styles.amountPlaceholder,
                        ]}
                      >
                        {formatAmountDisplay(String(payer.amount))}
                      </Text>
                      <Ionicons name="pencil-outline" size={16} color={colors.text.tertiary} />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}

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

              {/* Calculated total */}
              <View style={[styles.section, { marginTop: spacing.md }]}>
                <Text style={styles.label}>Total (calculated)</Text>
                <View style={[styles.amountInputWrapper, styles.amountInputReadOnly]}>
                  <Text style={styles.currencySymbol}>$</Text>
                  <Text style={[styles.amountInput, { color: colors.text.secondary }]}>
                    {formatAmountDisplay(total)}
                  </Text>
                </View>
              </View>
            </View>
          )}

          {/* Location */}
          <View style={styles.section}>
            <Text style={styles.label}>Location (Optional)</Text>
            <View style={styles.inputWithIcon}>
              <Ionicons name="location-outline" size={20} color={colors.text.secondary} />
              <TextInput
                style={styles.inlineTextInput}
                value={location}
                onChangeText={setLocation}
                placeholder="Where did this happen?"
                placeholderTextColor={colors.text.tertiary}
              />
            </View>
          </View>

          {/* Date — tapping opens a bottom-sheet modal with explicit white background */}
          <View style={styles.section}>
            <Text style={styles.label}>Date</Text>
            <TouchableOpacity
              style={styles.inputWithIcon}
              onPress={() => {
                setTempDate(date); // seed picker with current committed date
                setShowDatePicker(true);
              }}
              activeOpacity={0.7}
            >
              <Ionicons name="calendar-outline" size={20} color={colors.text.secondary} />
              <Text style={styles.dateText}>{formatDateDisplay(date)}</Text>
              <Ionicons name="chevron-forward" size={16} color={colors.text.tertiary} />
            </TouchableOpacity>
          </View>

          {/* Receipt */}
          <View style={styles.section}>
            <Text style={styles.label}>Add Receipt (Optional)</Text>
            <TouchableOpacity style={styles.receiptUpload} activeOpacity={0.7}>
              <Ionicons name="image-outline" size={40} color={colors.text.tertiary} />
              <Text style={styles.receiptText}>Tap to upload image</Text>
            </TouchableOpacity>
          </View>

          {/* Notes */}
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

        {/* Submit */}
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

      {/* ── Custom KeyPad overlay ───────────────────────────────────────── */}
      {showKeyPad && (
        <View style={styles.keyPadOverlay}>
          <PaymentKeyPad
            amount={getKeyPadAmount()}
            amountSuggestion={params.amount_payments}
            onKeyPress={handleKeyPress}
            handleSubmit={closeKeyPad}
          />
        </View>
      )}

      {/* ── Success modal ───────────────────────────────────────────────── */}
      <SuccessPaymentModal
        visible={isModalVisible}
        total={total}
        onClose={() => setModalVisible(false)}
        onBack={() => router.back()}
      />

      {/* ── Member selector modal ───────────────────────────────────────── */}
      <Modal
        visible={showMemberSelector}
        transparent
        animationType="slide"
        onRequestClose={() => setShowMemberSelector(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.bottomSheet}>
            <View style={styles.bottomSheetHandle} />
            <View style={styles.bottomSheetHeader}>
              <Text style={styles.bottomSheetTitle}>Select Member</Text>
              <TouchableOpacity onPress={() => setShowMemberSelector(false)}>
                <Ionicons name="close" size={24} color={colors.text.secondary} />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.memberList}>
              {getAvailableMembers().map(member => (
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

      {/* ── Date picker modal ───────────────────────────────────────────── */}
      {/*
        The iOS spinner inherits whatever background colour surrounds it, which
        on this app is a very light grey → grey text on grey bg = unreadable.
        Fix: wrap in an explicit #FFFFFF View, pass themeVariant="light" and
        textColor="#111111" so the picker always renders dark text on white.
        Changes are staged in tempDate and only committed when the user taps
        "Confirm", matching standard iOS date-picker UX.
      */}
      <Modal
        visible={showDatePicker}
        transparent
        animationType="slide"
        onRequestClose={() => setShowDatePicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.bottomSheet}>
            <View style={styles.bottomSheetHandle} />

            {/* Cancel | Select Date | Confirm */}
            <View style={styles.datePickerHeader}>
              <TouchableOpacity
                onPress={() => setShowDatePicker(false)}
                style={styles.datePickerHeaderBtn}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Text style={styles.datePickerCancel}>Cancel</Text>
              </TouchableOpacity>

              <Text style={styles.bottomSheetTitle}>Select Date</Text>

              <TouchableOpacity
                onPress={() => {
                  setDate(tempDate);
                  setShowDatePicker(false);
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }}
                style={styles.datePickerHeaderBtn}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Text style={styles.datePickerConfirm}>Confirm</Text>
              </TouchableOpacity>
            </View>

            {/* Hard-white container fixes grey-on-grey contrast bug */}
            <View style={styles.datePickerBg}>
              <DateTimePicker
                value={tempDate}
                mode="date"
                display="spinner"
                themeVariant="light"
                textColor="#111111"
                style={styles.datePicker}
                onChange={(_event, selectedDate) => {
                  if (selectedDate) setTempDate(selectedDate);
                }}
              />
            </View>

            {/* Live preview of selected date */}
            <View style={styles.datePreview}>
              <Ionicons name="calendar-outline" size={15} color="#6B7280" />
              <Text style={styles.datePreviewText}>{formatDateDisplay(tempDate)}</Text>
            </View>
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
  // Sits inside inputWithIcon — parent provides background & padding
  inlineTextInput: {
    flex: 1,
    fontSize: 16,
    color: colors.text.primary,
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
  amountInputReadOnly: {
    opacity: 0.6,
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
  amountPlaceholder: {
    color: colors.text.tertiary,
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
    marginLeft: spacing.sm,
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
  // ── KeyPad full-screen overlay ──────────────────────────────────────
  keyPadOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 999,
    elevation: 999,
    backgroundColor: colors.background,
  },
  // ── Shared bottom-sheet chrome ──────────────────────────────────────
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  bottomSheet: {
    backgroundColor: '#FFFFFF', // hard white — never inherits app background
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: Platform.OS === 'ios' ? 34 : spacing.lg,
    ...shadows.lg,
  },
  bottomSheetHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#D1D5DB',
    alignSelf: 'center',
    marginTop: spacing.sm,
    marginBottom: spacing.xs,
  },
  bottomSheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  bottomSheetTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111111',
  },
  memberList: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
  },
  memberOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: '#F9F9F9',
    borderRadius: 12,
    marginBottom: spacing.sm,
    gap: spacing.sm,
  },
  memberOptionText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#111111',
  },
  emptyState: {
    padding: spacing.xl,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 15,
    color: '#6B7280',
  },
  // ── Date picker modal ───────────────────────────────────────────────
  datePickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  datePickerHeaderBtn: {
    minWidth: 64,
  },
  datePickerCancel: {
    fontSize: 16,
    color: '#6B7280',
  },
  datePickerConfirm: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
    textAlign: 'right',
  },
  // Explicit white container — this is what actually fixes the contrast bug
  datePickerBg: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: spacing.md,
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: spacing.md,
  },
  datePicker: {
    height: 200,
    backgroundColor: '#FFFFFF',
  },
  datePreview: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.md,
  },
  datePreviewText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#374151',
  },
  // Kept for completeness — referenced nowhere active but harmless
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  backButton: { padding: spacing.xs },
  headerTitle: { fontSize: 18, fontWeight: '700', color: colors.text.primary },
});