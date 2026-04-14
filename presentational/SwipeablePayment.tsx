import React, { useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Swipeable, GestureHandlerRootView } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

import { colors, spacing } from '@/theme';
import Payment from './PaymentCard';

/**
 * SwipeablePayment - Payment card with swipe gestures
 * Swipe right → Accept (green)
 * Swipe left → Reject (red)
 * Only enabled for pending payments
 */

interface SwipeablePaymentProps {
  id: number;
  admin: boolean;
  amount: string;
  canEdit: boolean;
  creatorName: string;
  date: string;
  paymentableId: number;
  paymentableType: string;
  parentTitle?: string;
  status: string;
  title: string;
  handleAccept?: (data: any) => void;
  location?: string;
  image?: string;
  category?: string;
  onAccept: () => void;
  onReject: () => void;
}

export default function SwipeablePayment(props: SwipeablePaymentProps) {
  const swipeableRef = useRef<Swipeable>(null);
  const isPending = props.status === 'pending' && (!props.canEdit || props.admin);

  const handleSwipeRight = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    props.onAccept();
    swipeableRef.current?.close();
  };

  const handleSwipeLeft = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    props.onReject();
    swipeableRef.current?.close();
  };

  const renderRightActions = (progress: Animated.AnimatedInterpolation<number>, dragX: Animated.AnimatedInterpolation<number>) => {
    const scale = dragX.interpolate({
      inputRange: [0, 80],
      outputRange: [0, 1],
      extrapolate: 'clamp',
    });

    return (
      <Animated.View style={[styles.rightAction, styles.acceptAction, { transform: [{ scale }] }]}>
        <Ionicons name="checkmark-circle" size={32} color={colors.surface} />
        <Text style={styles.actionText}>Accept</Text>
      </Animated.View>
    );
  };

  const renderLeftActions = (progress: Animated.AnimatedInterpolation<number>, dragX: Animated.AnimatedInterpolation<number>) => {
    const scale = dragX.interpolate({
      inputRange: [-80, 0],
      outputRange: [1, 0],
      extrapolate: 'clamp',
    });

    return (
      <Animated.View style={[styles.leftAction, styles.rejectAction, { transform: [{ scale }] }]}>
        <Ionicons name="close-circle" size={32} color={colors.surface} />
        <Text style={styles.actionText}>Reject</Text>
      </Animated.View>
    );
  };

  const handleSwipeableOpen = (direction: 'left' | 'right') => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (direction === 'right') {
      handleSwipeRight();
    } else {
      handleSwipeLeft();
    }
  };

  // If not pending, just render the payment without swipe
  if (!isPending) {
    return <Payment {...props} />;
  }

  return (
    <GestureHandlerRootView>
      <Swipeable
        ref={swipeableRef}
        renderRightActions={renderRightActions}
        renderLeftActions={renderLeftActions}
        onSwipeableOpen={handleSwipeableOpen}
        overshootRight={false}
        overshootLeft={false}
        friction={2}
        rightThreshold={80}
        leftThreshold={80}
      >
        <Payment {...props} />
      </Swipeable>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  rightAction: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.sm,
  },
  leftAction: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.sm,
  },
  acceptAction: {
    backgroundColor: colors.financial.positive,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
  rejectAction: {
    backgroundColor: colors.financial.negative,
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
  },
  actionText: {
    color: colors.surface,
    fontSize: 14,
    fontWeight: '700',
    marginTop: spacing.xs,
  },
});
