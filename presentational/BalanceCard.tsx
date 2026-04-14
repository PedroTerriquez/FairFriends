import React, { useRef } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Animated } from "react-native";
import { router } from "expo-router";
import baseStyles from "./BaseStyles";
import { colors, spacing, typography, shadows } from '@/theme';
import formatMoney from "../services/formatMoney";
import { useTranslation } from 'react-i18next';
import Avatar from "./Avatar";

/**
 * BalanceCard - Clean Splitwise-inspired design
 * Shows balance with member contributions in a minimal, professional style
 */

function BalanceCard({ id, total, name, members, myTotal, status, budget }) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const { t } = useTranslation();

  // Calculate metrics
  const avg = total / members.length;
  const difference = myTotal - avg;

  // Sort members by contribution (highest first)
  const sortedMembers = [...members].sort((a, b) => (b.money || 0) - (a.money || 0));

  // Find current user in members
  const currentUserId = members.find(m => m.money === myTotal)?.user_id;

  // Calculate who should pay next (person who paid least)
  const leastPaidMember = [...members].reduce((min, current) =>
    (current.money || 0) < (min.money || 0) ? current : min
  );
  const leastPaidDifference = avg - (leastPaidMember.money || 0);
  const shouldShowNextPayer = leastPaidDifference > avg * 0.1; // Show if >10% below average

  // Get status badge info
  const getStatusBadge = () => {
    switch (status) {
      case 'pending':
        return { text: t('balanceCard.pending'), color: colors.financial.warning, bgColor: colors.financial.warningLight };
      case 'active':
        return { text: t('balanceCard.active'), color: colors.primary, bgColor: colors.primaryLight };
      case 'close':
        return { text: t('balanceCard.closed'), color: colors.text.secondary, bgColor: colors.surfaceVariant };
      default:
        return { text: status, color: colors.text.secondary, bgColor: colors.surfaceVariant };
    }
  };

  const statusBadge = getStatusBadge();

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.98,
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
      onPress={() => router.push({ pathname: 'balanceShow', params: { id } })}
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
      {/* Header with Title and Status Badge */}
      <View style={styles.header}>
        <Text style={styles.title}>{name}</Text>
        <View style={[styles.statusBadge, { backgroundColor: statusBadge.bgColor }]}>
          <Text style={[styles.statusText, { color: statusBadge.color }]}>
            {statusBadge.text}
          </Text>
        </View>
      </View>

      {/* Subtitle */}
      <Text style={styles.subtitle}>
        {members.length} {members.length === 1 ? 'person' : 'people'}
      </Text>

      {/* Three-column metrics - Like reference image */}
      <View style={styles.metricsRow}>
        <View style={[styles.metricBox, { backgroundColor: colors.surfaceVariant }]}>
          <Text style={styles.metricLabel}>You paid</Text>
          <Text style={styles.metricValue}>{formatMoney(myTotal)}</Text>
        </View>

        <View style={[styles.metricBox, { backgroundColor: colors.surfaceVariant }]}>
          <Text style={styles.metricLabel}>Average</Text>
          <Text style={styles.metricValue}>{formatMoney(avg)}</Text>
        </View>

        <View style={[styles.metricBox, { backgroundColor: difference >= 0 ? colors.financial.positiveLight : colors.financial.negativeLight }]}>
          <Text style={styles.metricLabel}>Difference</Text>
          <Text style={[styles.metricValue, { color: difference >= 0 ? colors.financial.positive : colors.financial.negative }]}>
            {difference >= 0 ? '+' : ''}{formatMoney(Math.abs(difference))}
          </Text>
        </View>
      </View>

      {/* Next Payer Indicator - Compact and elegant */}
      {shouldShowNextPayer && (
        <View style={styles.nextPayerBadge}>
          <View style={styles.nextPayerIcon}>
            <Text style={styles.nextPayerEmoji}>⚠️</Text>
          </View>
          <Text style={styles.nextPayerText}>
            {leastPaidMember.name} should pay next
          </Text>
        </View>
      )}

      {/* Member Contributions - Like reference with horizontal bars */}
      <Text style={styles.sectionTitle}>Member Contributions</Text>
      <View style={styles.membersList}>
        {sortedMembers.map((member, index) => {
          const memberAmount = member.money || 0;
          const percentage = (memberAmount / total) * 100;
          const isCurrentUser = member.user_id === currentUserId || member.money === myTotal;

          return (
            <View key={member.user_id || `index+${index}`} style={styles.memberRow}>
              {/* Avatar + Name */}
              <Avatar name={member.name} size={40} />
              <Text style={styles.memberName}>{member.name === myTotal ? 'You' : member.name}</Text>

              {/* Progress Bar - Blue for you, gray for others */}
              <View style={styles.progressBarContainer}>
                <View
                  style={[
                    styles.progressBarFill,
                    {
                      width: `${percentage}%`,
                      backgroundColor: isCurrentUser ? colors.primary : colors.text.tertiary,
                    },
                  ]}
                />
              </View>

              {/* Amount */}
              <Text style={styles.memberAmount}>{formatMoney(memberAmount)}</Text>
            </View>
          );
        })}
      </View>

      {/* Footer with totals and budget */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Total: {formatMoney(total)}</Text>
        {budget && (
          <Text style={styles.budgetText}>Budget: {formatMoney(budget)}</Text>
        )}
      </View>
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    ...shadows.sm,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text.primary,
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  subtitle: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: spacing.lg,
  },
  metricsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  metricBox: {
    flex: 1,
    padding: spacing.md,
    borderRadius: 12,
  },
  metricLabel: {
    fontSize: 12,
    color: colors.text.secondary,
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text.primary,
  },
  nextPayerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8E1',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 8,
    marginVertical: spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: '#FFA726',
  },
  nextPayerIcon: {
    marginRight: spacing.sm,
  },
  nextPayerEmoji: {
    fontSize: 16,
  },
  nextPayerText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#F57C00',
    flex: 1,
    marginVertical: 4
  },
  fairnessMessage: {
    backgroundColor: colors.financial.positiveLight,
    padding: spacing.md,
    borderRadius: 12,
    marginBottom: spacing.md,
  },
  fairnessText: {
    fontSize: 15,
    color: colors.financial.positive,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  membersList: {
    gap: spacing.md,
  },
  memberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  memberName: {
    fontSize: 15,
    color: colors.text.primary,
    width: 80,
  },
  progressBarContainer: {
    flex: 1,
    height: 8,
    backgroundColor: colors.surfaceVariant,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  memberAmount: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text.primary,
    width: 70,
    textAlign: 'right',
  },
  footer: {
    marginTop: spacing.lg,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  budgetText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
});

// Memoize component to prevent unnecessary re-renders
export default React.memo(BalanceCard, (prevProps, nextProps) => {
  return (
    prevProps.id === nextProps.id &&
    prevProps.total === nextProps.total &&
    prevProps.myTotal === nextProps.myTotal &&
    prevProps.members.length === nextProps.members.length
  );
});
