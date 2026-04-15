import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Animated } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { acceptPayment, rejectPayment } from "@/services/api";
import * as Haptics from 'expo-haptics';

import { colors, spacing, typography, shadows } from '@/theme';
import Avatar from "./Avatar";
import { CATEGORY_CONFIG } from '@/services/categoryConfig';

function Payment({
  id,
  admin,
  amount,
  canEdit,
  creatorName,
  date,
  members,
  paymentableId,
  paymentableType,
  parentTitle,
  status,
  title,
  handleAccept,
  location,
  image,
  category
}) {
  const [mutableStatus, setMutableStatus] = useState(status);
  const scaleAnim = useState(new Animated.Value(1))[0];

  const isPending = (!canEdit || admin) && mutableStatus === "pending";
  const isAccepted = mutableStatus === "accepted";
  const isRejected = mutableStatus === "rejected";
  const slug = (title || parentTitle || `id-${id}`).toString().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const categoryConfig = CATEGORY_CONFIG[category] || CATEGORY_CONFIG[0] ;

  // Format relative time
  const getRelativeTime = (dateStr) => {
    const now = new Date();
    const then = new Date(dateStr);
    const diffMs = now.getTime() - then.getTime();
    const diffDays = Math.floor(diffMs / 86400000);
    const diffHours = Math.floor(diffMs / 3600000);

    if (diffDays === 0 && diffHours < 1) return 'Just now';
    if (diffDays === 0) return `${diffHours}h ago`;
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    return then.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push({ pathname: paymentableType.toLowerCase() + 'Show', params: { id: paymentableId } });
  };

  const handleAcceptPayment = async () => {
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      // Celebration animation
      Animated.sequence([
        Animated.spring(scaleAnim, {
          toValue: 1.05,
          useNativeDriver: true,
          tension: 200,
          friction: 10,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          tension: 200,
          friction: 15,
        }),
      ]).start();

      const response = await acceptPayment(id);
      setMutableStatus('accepted');
      handleAccept?.(response.data);
    } catch (error) {
      console.error('Error accepting payment:', error);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  };

  const handleRejectPayment = async () => {
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      await rejectPayment(id);
      setMutableStatus('rejected');
    } catch (error) {
      console.error('Error rejecting payment:', error);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        testID={`payment-card-${slug}`}
        style={[
          styles.card,
          isPending && styles.cardPending
        ]}
        onPress={handlePress}
        activeOpacity={0.9}
      >
      {/* Main Content */}
      <View style={styles.content}>
        {/* Avatar */}
        <Avatar name={creatorName} size={48} />

        {/* Center: Info */}
        <View style={styles.centerSection}>
          <View style={styles.topRow}>
            <View style={{ width: '70%' }}>
              <Text style={styles.personName} numberOfLines={1}>
                {creatorName}
              </Text>
              <Text style={[styles.description, { flexShrink: 1 }]} numberOfLines={1} ellipsizeMode="tail">
              {title || parentTitle || 'Payment'}
            </Text>
            </View>
            <View style={{ gap: spacing.xs }}>
              {/* Amount */}
              <Text style={[
                styles.amount,
                typography.h4,
                {
                  color: isAccepted ? colors.financial.positive :
                    isRejected ? colors.financial.negative :
                      colors.text.primary
                }
              ]}>
                {isAccepted ? '+' : ''}{ amount }
              </Text>
              {/* Time - Right aligned */}
              <Text style={styles.timeText}>{getRelativeTime(date)}</Text>
            </View>
          </View>


          {/* Badges Row */}
          <View style={styles.badgesRow}>
            {/* Category Badge */}
            <View style={styles.categoryBadge}>
              <Text style={styles.badgeEmoji}>{categoryConfig.emoji}</Text>
              <Text style={styles.badgeText}>{categoryConfig.label}</Text>
            </View>

            {/* Status Badge - Only show if accepted or rejected */}
            {isAccepted && (
              <View style={[styles.statusBadge, styles.statusAccepted]}>
                <Ionicons name="checkmark" size={14} color={colors.financial.positive} />
                <Text style={[styles.statusText, { color: colors.financial.positive }]}>
                  Accepted
                </Text>
              </View>
            )}

            {isRejected && (
              <View style={[styles.statusBadge, styles.statusRejected]}>
                <Ionicons name="close" size={14} color={colors.financial.negative} />
                <Text style={[styles.statusText, { color: colors.financial.negative }]}>
                  Rejected
                </Text>
              </View>
            )}

            {isPending && (
              <View style={[styles.statusBadge, styles.statusPending]}>
                <Ionicons name="close" size={14} color={ "#B45309"} />
                <Text style={[styles.statusText, { color: "#B45309" }]}>
                  Pending
                </Text>
              </View>

            )}

          </View>
        </View>
      </View>

      {/* Action Buttons - Only for pending */}
      {isPending && (
        <View style={styles.actionsRow}>
          <TouchableOpacity
            testID={`payment-reject-${slug}`}
            style={[styles.actionButton, styles.rejectButton]}
            onPress={handleRejectPayment}
            activeOpacity={0.8}
          >
            <Ionicons name="close" size={20} color={colors.text.primary} />
            <Text style={styles.rejectButtonText}>Reject</Text>
          </TouchableOpacity>

          <TouchableOpacity
            testID={`payment-accept-${slug}`}
            style={[styles.actionButton, styles.acceptButton]}
            onPress={handleAcceptPayment}
            activeOpacity={0.8}
          >
            <Ionicons name="checkmark" size={20} color={colors.surface} />
            <Text style={styles.acceptButtonText}>Accept</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Edit Button - For pending payments the user can edit */}
      {canEdit && mutableStatus === "pending" && (
        <TouchableOpacity
          testID={`payment-edit-${slug}`}
          style={styles.editButton}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            router.push({
              pathname: 'formPayment',
              params: {
                admin: admin,
                amount: String(amount).replace(/[^0-9.]/g, ''),
                members: members,
                category,
                location,
                payment_id: id,
                paymentable_id: paymentableId,
                title,
                type: paymentableType,
              },
            });
          }}
          activeOpacity={0.8}
        >
          <Text style={styles.editButtonText}>Edit Payment</Text>
        </TouchableOpacity>
      )}
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  cardPending: {
    borderColor: '#FFD54F',
    borderWidth: 2,
  },
  content: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  centerSection: {
    flex: 1,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  personName: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.text.primary,
    flex: 1,
  },
  amount: {
    fontSize: 20,
    fontWeight: '700',
    marginLeft: spacing.sm,
  },
  description: {
    fontSize: 15,
    color: colors.text.secondary,
    marginBottom: spacing.sm,
  },
  badgesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flexWrap: 'wrap',
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  badgeEmoji: {
    fontSize: 14,
  },
  badgeText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text.primary,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusAccepted: {
    backgroundColor: colors.financial.positiveLight,
  },
  statusRejected: {
    backgroundColor: colors.financial.negativeLight,
  },
  statusPending: {
    backgroundColor: "#FEF3C7",
  },
  statusText: {
    fontSize: 13,
    fontWeight: '600',
  },
  timeText: {
    fontSize: 13,
    color: colors.text.tertiary,
    marginLeft: 'auto',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.xs,
    borderRadius: 10,
  },
  rejectButton: {
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border.light,
  },
  rejectButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
  },
  acceptButton: {
    backgroundColor: colors.financial.positive,
    ...shadows.sm,
  },
  acceptButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.surface,
  },
  editButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xs,
    marginTop: spacing.sm,
    borderRadius: 10,
    backgroundColor: '#ECEFFE',
    borderWidth: 1.5,
    borderColor: '#C5CFFF',
  },
  editButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
  },
});

// Memoize component to prevent unnecessary re-renders
export default React.memo(Payment, (prevProps, nextProps) => {
  return (
    prevProps.id === nextProps.id &&
    prevProps.status === nextProps.status &&
    prevProps.amount === nextProps.amount &&
    prevProps.canEdit === nextProps.canEdit
  );
});
