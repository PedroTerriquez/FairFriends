import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, typography } from '@/theme';
import { MaterialIcons } from '@expo/vector-icons';
import formatMoney from '@/services/formatMoney';

/**
 * BudgetTracking - Comprehensive budget tracking component
 * Shows spending progress, time progress, pace insights, and projections
 */

interface BudgetTrackingProps {
  spent: number;
  budget: number;
  startDate: Date | string;
  endDate: Date | string;
  currentDate?: Date;
}

export default function BudgetTracking({
  spent,
  budget,
  startDate,
  endDate,
  currentDate = new Date(),
}: BudgetTrackingProps) {
  // Calculate spending metrics
  const remaining = budget - spent;
  const spendingPercent = (spent / budget) * 100;

  // Calculate time metrics
  const start = new Date(startDate);
  const end = new Date(endDate);
  const now = typeof currentDate === 'string' ? new Date(currentDate) : currentDate;

  const totalDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  const elapsedDays = Math.ceil((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  const timePercent = Math.min((elapsedDays / totalDays) * 100, 100);

  // Calculate pace
  const expectedSpending = budget * (timePercent / 100);
  const paceAmount = expectedSpending - spent;
  const isUnderPace = paceAmount > 0;
  const isOverPace = paceAmount < 0;

  // Calculate projection
  const dailyRate = spent / (elapsedDays || 1);
  const projectedTotal = dailyRate * totalDays;
  const projectedRemaining = budget - projectedTotal;

  // Format dates
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Budget Tracking</Text>
        <Text style={styles.percentText}>{Math.round(spendingPercent)}% used</Text>
      </View>

      {/* Spending Progress Bar */}
      <View style={styles.progressBarThick}>
        <View
          style={[
            styles.progressFillThick,
            {
              width: `${Math.min(spendingPercent, 100)}%`,
              backgroundColor: spendingPercent > 100 ? colors.financial.negative : colors.text.primary,
            },
          ]}
        />
      </View>

      {/* Spending amounts */}
      <View style={styles.amountsRow}>
        <Text style={styles.amountText}>
          {formatMoney(spent)} / {formatMoney(budget)}
        </Text>
        <Text style={[styles.remainingText, { color: remaining >= 0 ? colors.financial.positive : colors.financial.negative }]}>
          Remaining: {formatMoney(Math.abs(remaining))}
        </Text>
      </View>

      {/* Time Progress Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Time Progress</Text>
          <Text style={styles.sectionPercent}>{Math.round(timePercent)}% elapsed</Text>
        </View>

        {/* Time Progress Bar */}
        <View style={styles.progressBarThin}>
          <View
            style={[
              styles.progressFillThin,
              {
                width: `${Math.min(timePercent, 100)}%`,
                backgroundColor: colors.text.primary,
              },
            ]}
          />
        </View>

        {/* Dates */}
        <View style={styles.datesRow}>
          <Text style={styles.dateText}>Start{'\n'}{formatDate(start)}</Text>
          <Text style={[styles.dateText, { textAlign: 'right' }]}>{formatDate(end)}</Text>
        </View>
      </View>

      {/* Pace Insight Card */}
      {isUnderPace && (
        <View style={[styles.insightCard, { backgroundColor: colors.primaryLight }]}>
          <View style={styles.insightHeader}>
            <MaterialIcons name="trending-down" size={20} color={colors.primary} />
            <Text style={[styles.insightTitle, { color: colors.primary }]}>
              Spending slower than expected
            </Text>
          </View>
          <Text style={styles.insightText}>
            You're {formatMoney(Math.abs(paceAmount))} under the expected pace.
          </Text>
          <Text style={styles.insightText}>
            You have room in the budget.
          </Text>
        </View>
      )}

      {isOverPace && (
        <View style={[styles.insightCard, { backgroundColor: colors.financial.negativeLight }]}>
          <View style={styles.insightHeader}>
            <MaterialIcons name="trending-up" size={20} color={colors.financial.negative} />
            <Text style={[styles.insightTitle, { color: colors.financial.negative }]}>
              Spending faster than expected
            </Text>
          </View>
          <Text style={styles.insightText}>
            You're {formatMoney(Math.abs(paceAmount))} over the expected pace.
          </Text>
          <Text style={styles.insightText}>
            Consider slowing down to stay within budget.
          </Text>
        </View>
      )}

      {/* Projection Section */}
      <View style={styles.projectionSection}>
        <Text style={styles.projectionLabel}>Projection</Text>
        <Text style={styles.projectionText}>
          At this pace, you'll finish {projectedRemaining >= 0 ? 'under' : 'over'} budget by{' '}
          <Text style={{ fontWeight: '700', color: projectedRemaining >= 0 ? colors.financial.positive : colors.financial.negative }}>
            {formatMoney(Math.abs(projectedRemaining))}
          </Text>
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text.primary,
  },
  percentText: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  progressBarThick: {
    height: 12,
    backgroundColor: colors.surfaceVariant,
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: spacing.sm,
  },
  progressFillThick: {
    height: '100%',
    borderRadius: 6,
  },
  amountsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  amountText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
  },
  remainingText: {
    fontSize: 14,
    fontWeight: '700',
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text.primary,
  },
  sectionPercent: {
    fontSize: 13,
    color: colors.text.secondary,
  },
  progressBarThin: {
    height: 8,
    backgroundColor: colors.surfaceVariant,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: spacing.sm,
  },
  progressFillThin: {
    height: '100%',
    borderRadius: 4,
  },
  datesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dateText: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  insightCard: {
    padding: spacing.md,
    borderRadius: 12,
    marginBottom: spacing.md,
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
    gap: spacing.xs,
  },
  insightTitle: {
    fontSize: 15,
    fontWeight: '600',
  },
  insightText: {
    fontSize: 14,
    color: colors.text.secondary,
    marginTop: 4,
  },
  projectionSection: {
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
  },
  projectionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  projectionText: {
    fontSize: 14,
    color: colors.text.primary,
  },
});
