import { createGroup, findFriends, getBalanceDetail, updateBalance } from "@/services/api";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState, useRef } from "react";
import {
  View,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  Text,
  TouchableOpacity,
  TextInput,
  Animated,
  StyleSheet,
  Switch,
  Platform
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from 'expo-haptics';
import DateTimePicker from '@react-native-community/datetimepicker';

import Avatar from "@/presentational/Avatar";
import { colors, spacing, typography, shadows } from '@/theme';
import { useTranslation } from "react-i18next";

export default function FormBalance() {
  const { t } = useTranslation();
  const { id } = useLocalSearchParams();
  const isEdit = !!id;
  const [friends, setFriends] = useState([]);
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [groupName, setGroupName] = useState("");
  const [description, setDescription] = useState("");
  const [showContacts, setShowContacts] = useState(true);
  const [budget, setBudget] = useState("");
  const [showBudget, setShowBudget] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000));
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const budgetHeightAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isEdit) {
      prefillFromBalance();
    } else {
      fetchFriends();
    }
  }, []);

  const parseISODate = (s) => {
    const [y, m, d] = s.split('-').map(Number);
    return new Date(y, m - 1, d);
  };

  const toISODate = (d) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };

  const prefillFromBalance = async () => {
    const response = await getBalanceDetail(id);
    if (!response) return;
    const b = response.data.balance;
    setGroupName(b.name || "");
    if (b.budget) {
      setBudget(String(b.budget));
      setShowBudget(true);
    }
    if (b.start_date) setStartDate(parseISODate(b.start_date));
    if (b.end_date) setEndDate(parseISODate(b.end_date));
  };

  useEffect(() => {
    Animated.spring(budgetHeightAnim, {
      toValue: showBudget ? 1 : 0,
      useNativeDriver: false,
      tension: 200,
      friction: 25,
    }).start();
  }, [showBudget]);

  const fetchFriends = async () => {
    try {
      const response = await findFriends("");
      setFriends(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const toggleSelectFriend = (friendId) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedFriends((prev) => {
      if (prev.find(f => f.id === friendId)) {
        return prev.filter((f) => f.id !== friendId);
      } else {
        const friend = friends.find(f => f.id === friendId);
        return [...prev, { id: friendId, name: friend?.name || "", email: friend?.email || "" }];
      }
    });
  };

  const submitHandler = () => {
    const nameValid = groupName.trim();
    const membersValid = isEdit || selectedFriends.length > 0;
    if (!nameValid || !membersValid) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    const budgetValue = showBudget && budget ? parseFloat(budget) : null;
    const startValue = showBudget ? toISODate(startDate) : null;
    const endValue = showBudget ? toISODate(endDate) : null;

    if (isEdit) {
      updateBalance(id, {
        name: groupName,
        budget: budgetValue,
        start_date: startValue,
        end_date: endValue,
      })
        .then((response) => {
          if (response) router.back();
        })
        .catch((error) => {
          console.log(error);
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        });
      return;
    }

    const memberIds = selectedFriends.map(f => f.id);
    createGroup(memberIds, groupName, budgetValue, startValue, endValue)
      .then((response) => {
        router.replace({
          pathname: '/balanceShow',
          params: { id: response.data.id }
        });
      })
      .catch((error) => {
        console.log(error);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      });
  };

  const canCreate = groupName.trim() && (isEdit || selectedFriends.length > 0);

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Balance Name */}
          <View style={styles.section}>
            <Text style={styles.label}>Balance Name</Text>
            <TextInput
              testID="balance-name-input"
              style={styles.input}
              value={groupName}
              onChangeText={setGroupName}
              placeholder="e.g., Weekend Trip, Apartment 3B"
              placeholderTextColor={colors.text.tertiary}
            />
          </View>

          {/* Description (Optional) */}
          <View style={styles.section}>
            <Text style={styles.label}>{t('balanceForm.description_label')}</Text>
            <TextInput
              style={[styles.input, styles.descriptionInput]}
              value={description}
              onChangeText={setDescription}
              placeholder={t('balanceForm.description_placeholder')}
              placeholderTextColor={colors.text.tertiary}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>

          {/* Members */}
          {!isEdit && (
          <View style={styles.section}>
            <Text style={styles.label}>Members</Text>

            {/* Selected members chips */}
            {selectedFriends.length > 0 && (
              <View style={styles.chipsCard}>
                {selectedFriends.map((f) => (
                  <TouchableOpacity
                    key={f.id}
                    style={styles.chip}
                    onPress={() => toggleSelectFriend(f.id)}
                    activeOpacity={0.7}
                  >
                    <Avatar name={f.name} size={28} />
                    <Text style={styles.chipText}>{f.name}</Text>
                    <Ionicons name="close" size={16} color={colors.text.secondary} />
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* Hide/Show Contacts Toggle */}
            <TouchableOpacity
              style={styles.contactsToggle}
              onPress={() => setShowContacts(!showContacts)}
              activeOpacity={0.7}
            >
              <View style={styles.contactsToggleLeft}>
                <Ionicons
                  name="people-outline"
                  size={20}
                  color={colors.text.primary}
                />
                <Text style={styles.contactsToggleText}>
                  {showContacts ? 'Hide Contacts' : 'Add Members'}
                </Text>
              </View>
              <Ionicons
                name={showContacts ? 'chevron-up' : 'chevron-down'}
                size={20}
                color={colors.text.secondary}
              />
            </TouchableOpacity>

            {/* Contacts List */}
            {showContacts && (
              <ScrollView
              style={[
                styles.contactsList,
                { maxHeight: require('react-native').Dimensions.get('window').height * 0.40 }
              ]}
              contentContainerStyle={{}}
              showsVerticalScrollIndicator={true}
              persistentScrollbar={true}
              nestedScrollEnabled={true}
              >
              {friends.map((friend) => {
                const isSelected = selectedFriends.find(f => f.id === friend.id);
                return (
                <TouchableOpacity
                  key={friend.id}
                  testID={`balance-member-${friend.id}`}
                  style={styles.contactItem}
                  onPress={() => toggleSelectFriend(friend.id)}
                  activeOpacity={0.7}
                >
                  <Avatar name={friend.name} size={48} />
                  <View style={styles.contactInfo}>
                  <Text style={styles.contactName}>{friend.name}</Text>
                  <Text style={styles.contactEmail}>{friend.email}</Text>
                  </View>
                  <View style={[
                  styles.checkCircle,
                  isSelected && styles.checkCircleSelected
                  ]}>
                  {isSelected && (
                    <Ionicons name="checkmark" size={16} color={colors.surface} />
                  )}
                  </View>
                </TouchableOpacity>
                );
              })}
              </ScrollView>
            )}
          </View>
          )}

          {/* Set a Budget */}
          <View style={[styles.purpleSection]}>
            <View style={styles.budgetHeader}>
              <View>
                <Text style={styles.budgetTitle}>Set a Budget</Text>
                <Text style={styles.budgetSubtitle}>Track spending against a limit</Text>
              </View>
              <Switch
                value={showBudget}
                onValueChange={(value) => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setShowBudget(value);
                }}
                trackColor={{
                  false: colors.border.light,
                  true: colors.primary
                }}
                thumbColor={colors.surface}
                ios_backgroundColor={colors.border.light}
              />
            </View>

            {/* Budget Fields - Expandable */}
            <Animated.View
              style={[
                styles.budgetFields,
                {
                  maxHeight: budgetHeightAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 200]
                  }),
                  opacity: budgetHeightAnim,
                }
              ]}
            >
              {/* Total Budget */}
              <View style={styles.budgetInputSection}>
                <Text style={styles.budgetInputLabel}>Total Budget</Text>
                <View style={styles.budgetInputContainer}>
                  <Text style={styles.currencySymbol}>$</Text>
                  <TextInput
                    style={styles.budgetInput}
                    value={budget}
                    onChangeText={setBudget}
                    placeholder="0.00"
                    keyboardType="decimal-pad"
                    placeholderTextColor={colors.text.tertiary}
                  />
                </View>
              </View>

              {/* Date Inputs Side by Side */}
              <View style={styles.dateRow}>
                {/* Start Date */}
                <View style={styles.dateColumn}>
                  <Text style={styles.budgetInputLabel}>Start Date</Text>
                  <TouchableOpacity
                    style={styles.dateInput}
                    onPress={() => setShowStartPicker(true)}
                  >
                    <Ionicons
                      name="calendar-outline"
                      size={20}
                      color={colors.text.secondary}
                    />
                    <Text style={styles.dateText}>{formatDate(startDate)}</Text>
                  </TouchableOpacity>
                </View>

                {/* End Date */}
                <View style={styles.dateColumn}>
                  <Text style={styles.budgetInputLabel}>End Date</Text>
                  <TouchableOpacity
                    style={styles.dateInput}
                    onPress={() => setShowEndPicker(true)}
                  >
                    <Ionicons
                      name="calendar-outline"
                      size={20}
                      color={colors.text.secondary}
                    />
                    <Text style={styles.dateText}>{formatDate(endDate)}</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {showStartPicker && (
                <DateTimePicker
                  value={startDate}
                  mode="date"
                  onChange={(event, date) => {
                    setShowStartPicker(Platform.OS === 'ios');
                    if (date) setStartDate(date);
                  }}
                />
              )}

              {showEndPicker && (
                <DateTimePicker
                  value={endDate}
                  mode="date"
                  onChange={(event, date) => {
                    setShowEndPicker(Platform.OS === 'ios');
                    if (date) setEndDate(date);
                  }}
                />
              )}
            </Animated.View>
          </View>

          {/* Bottom Spacing */}
          <View style={{ height: spacing.xl }} />
        </ScrollView>

        {/* Create Balance Button - Bottom Fixed */}
        <View style={styles.bottomButtonContainer}>
          <TouchableOpacity
            testID="balance-create-submit"
            style={[
              styles.createButton,
              !canCreate && styles.createButtonDisabled
            ]}
            onPress={submitHandler}
            disabled={!canCreate}
            activeOpacity={0.8}
          >
            <Text style={[
              styles.createButtonText,
              !canCreate && styles.createButtonTextDisabled
            ]}>
              {isEdit ? t('balanceForm.save_changes') : 'Create Balance'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
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
  section: {
    marginBottom: spacing.xl,
  },
  label: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  input: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    fontSize: 16,
    color: colors.text.primary,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  descriptionInput: {
    minHeight: 80,
    paddingTop: spacing.md,
  },
  chipsCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border.light,
    padding: spacing.md,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.surfaceVariant,
    borderRadius: 999,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
  },
  chipText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text.primary,
  },
  textArea: {
    height: 80,
    paddingTop: spacing.md,
  },
  contactsToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  contactsToggleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  contactsToggleText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text.primary,
  },
  contactsList: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border.light,
    maxHeight: 300,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 2,
  },
  contactEmail: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  checkCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.border.light,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkCircleSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  purpleSection: {
    backgroundColor: '#eef2ff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#c6d2ff',
    padding: spacing.lg,
  },
  budgetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  budgetTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 4,
  },
  budgetSubtitle: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  budgetFields: {
    overflow: 'hidden',
  },
  budgetInputSection: {
    marginVertical: spacing.md,
  },
  budgetInputLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  budgetInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  currencySymbol: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.secondary,
    marginRight: spacing.xs,
  },
  budgetInput: {
    flex: 1,
    fontSize: 16,
    color: colors.text.primary,
    paddingVertical: spacing.md,
  },
  dateRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.md
  },
  dateColumn: {
    flex: 1,
  },
  dateInput: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  dateText: {
    fontSize: 15,
    color: colors.text.primary,
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
