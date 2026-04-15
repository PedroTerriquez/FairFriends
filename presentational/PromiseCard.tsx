import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import baseStyles from './BaseStyles';
import { colors, spacing, shadows } from '@/theme';
import Avatar from "./Avatar";
import AdaptiveText from "./AdaptiveText";
import formatMoney from "@/services/formatMoney";
import { useTranslation } from 'react-i18next';

/**
 * PromiseCard - Clean Splitwise-inspired design
 * Shows promise details with progress in a minimal, professional style
 */

function PromiseCard({ id, title, percentage, user, status, total, paid_amount, interest }) {
  const router = useRouter();
  const { t } = useTranslation();

  const remaining = total - paid_amount;

  // Get status info
  const getStatusInfo = () => {
    switch (status) {
      case 'pending':
        return { text: t('promiseCard.editable'), color: colors.financial.warning };
      case 'accepted':
        return { text: t('promiseCard.open'), color: colors.primary };
      case 'close':
        return { text: t('promiseCard.finished'), color: colors.financial.positive };
      case 'rejected':
        return { text: t('promiseCard.rejected'), color: colors.error };
      default:
        return { text: status, color: colors.text.secondary };
    }
  };

  const statusInfo = getStatusInfo();

  return (
    <TouchableOpacity
      style={[baseStyles.card, styles.card]}
      onPress={() => router.push({ pathname: "/promiseShow", params: { id } })}
      activeOpacity={0.8}
    >
      {/* Header with Avatar and Status */}
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <Avatar name={user} size={40} />
          <View style={styles.userTextContainer}>
            <View>
              <Text style={styles.userName}>{user}</Text>
              <Text style={styles.title}>{title}</Text>
            </View>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: statusInfo.color + '20' }]}>
            <Text style={[styles.statusText, { color: statusInfo.color }]}>
              {statusInfo.text}
            </Text>
          </View>
        </View>
      </View>

      {/* Title */}

      {/* Three-column metrics */}
      <View style={styles.metricsRow}>
        <View style={[styles.metricBox, { backgroundColor: colors.financial.positiveLight }]}>
          <Text style={styles.metricLabel}>Paid</Text>
          <AdaptiveText style={styles.metricValue}>{formatMoney(paid_amount)}</AdaptiveText>
        </View>

        <View style={[styles.metricBox, { backgroundColor: colors.surfaceVariant }]}>
          <Text style={styles.metricLabel}>Total</Text>
          <AdaptiveText style={styles.metricValue}>{formatMoney(total)}</AdaptiveText>
        </View>

        <View style={[styles.metricBox, { backgroundColor: colors.surfaceVariant }]}>
          <Text style={styles.metricLabel}>Remaining</Text>
          <AdaptiveText style={[styles.metricValue, { color: remaining > 0 ? colors.text.primary : colors.financial.positive }]}>
            {formatMoney(remaining)}
          </AdaptiveText>
        </View>
      </View>

      {/* Progress Section */}
      <View style={styles.progressSection}>
        <View style={styles.progressHeader}>
          <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'space-between'}}>
            <Text style={styles.progressLabel}>{`${Math.round(percentage)}% paid`}</Text>
            {!!interest && interest > 0 && (
              <Text style={styles.interestText}>{`+${interest}% interest`}</Text>
            )}
          </View>
        </View>

        {/* Simple horizontal progress bar */}
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
      </View>
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
    marginBottom: spacing.md,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  userTextContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  title: {
    fontSize: 15,
    color: colors.text.primary,
  },
  metricsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  metricBox: {
    flex: 1,
    padding: spacing.md,
    borderRadius: 12,
  },
  metricLabel: {
    fontSize: 13,
    color: colors.text.secondary,
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text.primary,
  },
  progressSection: {
    marginTop: spacing.sm,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  progressLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text.primary,
  },
  interestText: {
    fontSize: 13,
    color: colors.text.secondary,
  },
  progressBar: {
    height: 8,
    backgroundColor: colors.surfaceVariant,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
});

export default React.memo(PromiseCard, (prevProps, nextProps) => {
  return (
    prevProps.id === nextProps.id &&
    prevProps.percentage === nextProps.percentage &&
    prevProps.status === nextProps.status &&
    prevProps.paid_amount === nextProps.paid_amount
  );
});