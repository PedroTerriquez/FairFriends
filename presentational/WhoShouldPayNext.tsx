import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, shadows } from '@/theme';
import Avatar from './Avatar';
import formatMoney from '@/services/formatMoney';
import { MaterialIcons } from '@expo/vector-icons';

/**
 * WhoShouldPayNext - Prominent display of fairness insight
 * THE key differentiator - shows who should pay next with visual emphasis
 */

interface WhoShouldPayNextProps {
  name: string;
  amountBelow: number;
  percentBelow: number;
}

export default function WhoShouldPayNext({
  name,
  amountBelow,
  percentBelow,
}: WhoShouldPayNextProps) {
  return (
    <View style={styles.container}>
      {/* Icon indicator */}
      <View style={styles.iconContainer}>
        <MaterialIcons name="person-outline" size={24} color={colors.primary} />
      </View>

      {/* Main content */}
      <View style={styles.content}>
        <Text style={styles.label}>NEXT PAYMENT FROM</Text>

        <View style={styles.personRow}>
          <Avatar name={name} size={48} />
          <View style={styles.info}>
            <Text style={styles.name}>{name}</Text>
            <Text style={styles.subtitle}>
              {percentBelow}% below average
            </Text>
          </View>
        </View>

        <View style={styles.amountContainer}>
          <Text style={styles.amountLabel}>Should contribute</Text>
          <Text style={styles.amount}>{formatMoney(amountBelow)}</Text>
        </View>
      </View>

      {/* Visual emphasis - arrow or highlight */}
      <View style={styles.emphasisBar} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.primaryLight,
    borderRadius: 16,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 2,
    borderColor: colors.primary,
    ...shadows.md,
  },
  iconContainer: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    gap: spacing.md,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    color: colors.primary,
  },
  personRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 15,
    color: colors.text.secondary,
  },
  amountContainer: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  amountLabel: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  amount: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.primary,
  },
  emphasisBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    backgroundColor: colors.primary,
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
  },
});
