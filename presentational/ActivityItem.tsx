import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { router } from "expo-router";
import { colors, spacing, shadows } from '@/theme';
import Avatar from "./Avatar";
import formatMoney from "@/services/formatMoney";
import formatDate from "@/services/formatDate";

/**
 * ActivityItem - Clean activity feed item
 * Matches reference: avatar + action text + description + amount + timestamp
 */

interface ActivityItemProps {
  id: number;
  type: 'received' | 'sent';
  name: string;
  description: string;
  amount: number;
  date: Date | string;
  linkedItem?: string; // Optional blue link text (e.g., "Weekend Ski Trip")
  paymentableId?: number;
  paymentableType?: string;
}

export default function ActivityItem({
  id,
  type,
  name,
  description,
  amount,
  date,
  linkedItem,
  paymentableId,
  paymentableType,
}: ActivityItemProps) {
  const isReceived = type === 'received';
  const actionText = isReceived ? `${name} paid you` : `You paid ${name}`;
  const amountColor = isReceived ? colors.financial.positive : colors.text.primary;
  const amountSign = isReceived ? '+' : '-';

  const handlePress = () => {
    if (paymentableId && paymentableType) {
      router.push({
        pathname: paymentableType.toLowerCase() as any,
        params: { id: paymentableId }
      });
    }
  };

  // Format relative time (like "5 hours ago", "2 days ago")
  const getRelativeTime = (dateValue: Date | string) => {
    const now = new Date();
    const then = typeof dateValue === 'string' ? new Date(dateValue) : dateValue;
    const diffMs = now.getTime() - then.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    const diffWeeks = Math.floor(diffMs / 604800000);

    if (diffMins < 60) return `${diffMins} ${diffMins === 1 ? 'minute' : 'minutes'} ago`;
    if (diffHours < 24) return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
    if (diffDays < 7) return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
    if (diffWeeks < 4) return `${diffWeeks} ${diffWeeks === 1 ? 'week' : 'weeks'} ago`;
    return formatDate(then);
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        {/* Left: Avatar */}
        <Avatar name={name} size={40} />

        {/* Center: Info */}
        <View style={styles.info}>
          <Text style={styles.actionText}>{actionText}</Text>
          <Text style={styles.description} numberOfLines={1}>
            {description}
          </Text>
          {linkedItem && (
            <Text style={styles.linkedItem} numberOfLines={1}>
              {linkedItem}
            </Text>
          )}
        </View>

        {/* Right: Amount and time */}
        <View style={styles.rightSection}>
          <Text style={[styles.amount, { color: amountColor }]}>
            {amountSign}{formatMoney(Math.abs(amount))}
          </Text>
          <Text style={styles.timestamp}>{getRelativeTime(date)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.sm,
    ...shadows.sm,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  info: {
    flex: 1,
    marginLeft: spacing.sm,
    marginRight: spacing.sm,
  },
  actionText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 2,
  },
  description: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 2,
  },
  linkedItem: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
  },
  rightSection: {
    alignItems: 'flex-end',
  },
  amount: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 4,
  },
  timestamp: {
    fontSize: 12,
    color: colors.text.secondary,
  },
});
