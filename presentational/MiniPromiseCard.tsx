import React, { useRef } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Animated } from "react-native";
import { router } from "expo-router";
import { colors, spacing, shadows } from '@/theme';
import Avatar from "./Avatar";
import formatMoney from "@/services/formatMoney";

/**
 * MiniPromiseCard - Horizontal clean design
 * Matches reference: avatar + name/description + remaining amount + thin progress bar
 */

function MiniPromiseCard({ id, name, description, paidAmount, total })  {
  const percentage = (paidAmount / total * 100);
  const remaining = total - paidAmount;
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
      onPress={() => router.push({ pathname: '/promiseShow', params: { id } })}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={1}
    >
      <Animated.View
        style={[
          styles.card,
          { transform: [{ scale: scaleAnim }] }
        ]}
      >
      <View style={styles.content}>
        {/* Left: Avatar */}
        <Avatar name={name} size={48} />

        {/* Center: Name and description */}
        <View style={styles.info}>
          <Text style={styles.name} numberOfLines={1}>{name}</Text>
          <Text style={styles.description} numberOfLines={1}>{description}</Text>

        </View>
      </View>

      {/* Remaining label */}
      {/* Right: Amount */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%', marginBottom: spacing.sm }}>
        <Text style={styles.remainingLabel}>Remaining</Text>
        <Text style={styles.amount}>{formatMoney(remaining)}</Text>
      </View>

      {/* Thin progress bar */}
      <View style={styles.progressBar}>
        <View
          style={[
            styles.progressFill,
            {
              width: `${Math.min(percentage, 100)}%`,
              backgroundColor: colors.primary,
            },
          ]}
        />
      </View>

      {/* Percentage below bar */}
      <Text style={styles.percentageText}>{Math.round(percentage)}% paid</Text>
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.md,
    marginRight: spacing.md,
    width: 280,
    ...shadows.sm,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  info: {
    flex: 1,
    marginLeft: spacing.sm,
    marginRight: spacing.sm,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 2,
  },
  description: {
    fontSize: 13,
    color: colors.text.secondary,
    marginBottom: spacing.sm,
  },
  remainingLabel: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  amount: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.financial.positive,
  },
  progressBar: {
    height: 3,
    backgroundColor: colors.surfaceVariant,
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 6,
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  percentageText: {
    fontSize: 12,
    color: colors.text.secondary,
  },
});

export default React.memo(MiniPromiseCard, (prevProps, nextProps) => {
  return (
    prevProps.id === nextProps.id &&
    prevProps.paidAmount === nextProps.paidAmount &&
    prevProps.total === nextProps.total
  );
});
