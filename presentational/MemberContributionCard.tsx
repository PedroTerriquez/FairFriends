import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MotiView } from 'moti';
import { colors, spacing, typography, shadows } from '@/theme';
import Avatar from './Avatar';
import formatMoney from '@/services/formatMoney';

/**
 * MemberContributionCard
 *
 * Displays a single member's contribution to a balance
 * Shows rank, amount, percentage, and fairness indicator
 */

interface MemberContributionCardProps {
  name: string;
  amount: number;
  percentage: number;
  rank: number;
  totalMembers: number;
  average: number;
  delay?: number;
}

const MemberContributionCard: React.FC<MemberContributionCardProps> = ({
  name,
  amount,
  percentage,
  rank,
  totalMembers,
  average,
  delay = 0,
}) => {
  const difference = amount - average;
  const differencePercent = ((difference / average) * 100).toFixed(0);

  // Determine status
  const isFair = Math.abs(difference) < average * 0.1;
  const isTop = rank === 1;
  const isLowest = rank === totalMembers;

  // Get rank display
  const getRankDisplay = () => {
    if (isTop) return '🏆';
    if (isLowest) return '👇';
    return `#${rank}`;
  };

  // Get status color
  const getStatusColor = () => {
    if (isFair) return colors.financial.neutral;
    if (difference > 0) return colors.financial.positive;
    return colors.financial.negative;
  };

  const statusColor = getStatusColor();

  return (
    <MotiView
      from={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{
        type: 'timing',
        duration: 300,
        delay,
      }}
      style={[
        styles.container,
        isTop && styles.topContainer,
        isLowest && styles.lowestContainer,
      ]}
    >
      {/* Rank Badge */}
      <View style={[styles.rankBadge, isTop && styles.topRankBadge]}>
        <Text style={[styles.rankText, isTop && styles.topRankText]}>
          {getRankDisplay()}
        </Text>
      </View>

      {/* Avatar + Name */}
      <View style={styles.header}>
        <Avatar name={name} size={32} />
        <Text style={styles.nameText} numberOfLines={1}>
          {name}
        </Text>
      </View>

      {/* Amount */}
      <Text style={[styles.amountText, { color: statusColor }]}>
        {formatMoney(amount)}
      </Text>

      {/* Percentage */}
      <Text style={styles.percentageText}>
        {percentage.toFixed(0)}% of total
      </Text>

      {/* Progress Bar */}
      <View style={styles.progressBar}>
        <View
          style={[
            styles.progressFill,
            {
              width: `${Math.min(percentage, 100)}%`,
              backgroundColor: statusColor,
            },
          ]}
        />
      </View>

      {/* Fairness Indicator */}
      <View style={styles.fairnessContainer}>
        <Ionicons
          name={difference > 0 ? 'trending-up' : difference < 0 ? 'trending-down' : 'remove'}
          size={14}
          color={statusColor}
        />
        <Text style={[styles.fairnessText, { color: statusColor }]}>
          {isFair
            ? 'At average'
            : `${Math.abs(Number(differencePercent))}% ${difference > 0 ? 'above' : 'below'} avg`}
        </Text>
      </View>
    </MotiView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.md,
    gap: spacing.sm,
    ...shadows.sm,
    borderWidth: 1,
    borderColor: colors.border?.default || colors.surfaceVariant,
  },
  topContainer: {
    borderColor: colors.financial.positive,
    borderWidth: 2,
    backgroundColor: colors.financial.positiveLight + '20',
  },
  lowestContainer: {
    borderColor: colors.financial.pending,
    borderWidth: 2,
    backgroundColor: colors.financial.pendingLight + '20',
  },
  rankBadge: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    backgroundColor: colors.surfaceVariant,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: 12,
  },
  topRankBadge: {
    backgroundColor: colors.financial.positive + '20',
  },
  rankText: {
    ...typography.caption,
    fontWeight: '700',
    color: colors.text.secondary,
  },
  topRankText: {
    color: colors.financial.positive,
    fontSize: 14,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  nameText: {
    ...typography.bodySmall,
    fontWeight: '600',
    color: colors.text.primary,
    flex: 1,
  },
  amountText: {
    ...typography.h3,
    fontWeight: '700',
    marginTop: spacing.xs,
  },
  percentageText: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  progressBar: {
    height: 6,
    backgroundColor: colors.surfaceVariant,
    borderRadius: 3,
    overflow: 'hidden',
    marginTop: spacing.xs,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  fairnessContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: spacing.xs,
  },
  fairnessText: {
    ...typography.caption,
    fontWeight: '600',
  },
});

export default MemberContributionCard;
