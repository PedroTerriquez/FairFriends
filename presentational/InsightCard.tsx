import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, shadows } from '../theme';
import { MotiView } from 'moti';

/**
 * InsightCard Component
 *
 * Displays Balance Intelligence insights:
 * - Fairness: Who should pay next
 * - Settlement: How to close the balance
 * - Pace: Spending velocity (optional - requires budget + dates)
 */

export type InsightType = 'fairness' | 'settlement' | 'pace';

interface InsightCardProps {
  type: InsightType;
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
  onPress?: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
  delay?: number; // Animation delay in ms
}

const InsightCard: React.FC<InsightCardProps> = ({
  type,
  title,
  subtitle,
  children,
  onPress,
  icon,
  delay = 0,
}) => {
  const [isPressed, setIsPressed] = useState(false);
  // Default icons based on type
  const getDefaultIcon = (): keyof typeof Ionicons.glyphMap => {
    switch (type) {
      case 'fairness':
        return 'scale-outline';
      case 'settlement':
        return 'swap-horizontal-outline';
      case 'pace':
        return 'trending-up-outline';
    }
  };

  // Icon color based on type
  const getIconColor = () => {
    switch (type) {
      case 'fairness':
        return colors.financial.pending; // Orange
      case 'settlement':
        return colors.info; // Blue
      case 'pace':
        return colors.financial.positive; // Green
    }
  };

  const displayIcon = icon || getDefaultIcon();
  const iconColor = getIconColor();

  return (
    <MotiView
      from={{ opacity: 0, translateY: 20, scale: 0.95 }}
      animate={{
        opacity: 1,
        translateY: 0,
        scale: isPressed && onPress ? 0.98 : 1,
      }}
      transition={{
        type: 'spring',
        duration: 300,
        delay: isPressed ? 0 : delay,
        damping: 20,
        stiffness: 300,
      }}
    >
      <TouchableOpacity
        style={styles.container}
        onPress={onPress}
        onPressIn={() => setIsPressed(true)}
        onPressOut={() => setIsPressed(false)}
        activeOpacity={1}
        disabled={!onPress}
      >
        {/* Header with icon and title */}
        <View style={styles.header}>
          <View style={[styles.iconContainer, { backgroundColor: iconColor + '20' }]}>
            <Ionicons name={displayIcon} size={20} color={iconColor} />
          </View>
          <View style={styles.headerText}>
            <Text style={styles.title}>{title}</Text>
            {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
          </View>
          {onPress && (
            <Ionicons name="chevron-forward" size={20} color={colors.text.secondary} />
          )}
        </View>

        {/* Content area */}
        {children && <View style={styles.content}>{children}</View>}
      </TouchableOpacity>
    </MotiView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.md,
    marginVertical: spacing.sm,
    ...shadows.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    flex: 1,
    gap: spacing.xs / 2,
  },
  title: {
    ...typography.h4,
    color: colors.text.primary,
  },
  subtitle: {
    ...typography.bodySmall,
    color: colors.text.secondary,
  },
  content: {
    marginTop: spacing.md,
  },
});

export default InsightCard;
