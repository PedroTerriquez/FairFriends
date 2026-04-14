import React, { useRef } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Animated } from "react-native";
import { router } from "expo-router";
import baseStyles from "./BaseStyles";
import { colors, spacing, shadows } from '@/theme';
import Avatar from "./Avatar";
import formatMoney from "@/services/formatMoney";

/**
 * MiniBalanceCard - Clean, minimal design
 * Simple card showing balance name and your amount vs average
 */

function MiniBalanceCard({ id, total, name, members, myTotal }) {
  const avg = total / members;
  const difference = myTotal - avg;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.96,
      useNativeDriver: true,
      tension: 300,
      friction: 20,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 300,
      friction: 20,
    }).start();
  };

  return (
    <TouchableOpacity
      onPress={() => router.push({ pathname: '/balanceShow', params: { id } })}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={1}
    >
      <Animated.View
        style={[
          baseStyles.card,
          styles.card,
          { transform: [{ scale: scaleAnim }] }
        ]}
      >
      {/* Name */}
      <Text style={styles.name} numberOfLines={1}>{name}</Text>

      {/* Members count */}
      <Text style={styles.membersText}>{members} people</Text>

      {/* Your amount - large and prominent */}
      <Text style={styles.label}>You paid</Text>
      <Text style={styles.amount}>{formatMoney(myTotal)}</Text>

      {/* Difference indicator - subtle */}
      {difference !== 0 && (
        <View style={[
          styles.differenceBox,
          { backgroundColor: difference > 0 ? colors.financial.positiveLight : colors.surfaceVariant }
        ]}>
          <Text style={[
            styles.differenceText,
            { color: difference > 0 ? colors.financial.positive : colors.text.secondary }
          ]}>
            {difference > 0 ? '+' : ''}{formatMoney(Math.abs(difference))} vs avg
          </Text>
        </View>
      )}
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    minWidth: 160,
    minHeight: 160,
    padding: spacing.md,
    ...shadows.sm,
  },
  name: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  membersText: {
    fontSize: 13,
    color: colors.text.secondary,
    marginBottom: spacing.lg,
  },
  label: {
    fontSize: 12,
    color: colors.text.secondary,
    marginBottom: 4,
  },
  amount: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  differenceBox: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  differenceText: {
    fontSize: 12,
    fontWeight: '600',
  },
});

export default React.memo(MiniBalanceCard, (prevProps, nextProps) => {
  return (
    prevProps.id === nextProps.id &&
    prevProps.total === nextProps.total &&
    prevProps.myTotal === nextProps.myTotal &&
    prevProps.members === nextProps.members
  );
});
