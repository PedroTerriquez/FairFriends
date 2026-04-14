import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, shadows } from '../theme';
import { MotiView } from 'moti';

/**
 * Balance Intelligence Preview Component
 *
 * Shows the top financial insight on the home screen.
 * Insights priority:
 * 1. Fairness imbalance ("Pedro should pay next - he's $89 below average")
 * 2. Spending pace (optional - if balance has budget + dates)
 * 3. Positive reinforcement ("All balances are fair 🎯")
 */

export interface BalanceInsight {
  type: 'fairness' | 'pace' | 'positive';
  title: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
  balanceId?: string;
}

interface BalanceIntelligencePreviewProps {
  insight?: BalanceInsight;
  onPress?: () => void;
  loading?: boolean;
}

const BalanceIntelligencePreview: React.FC<BalanceIntelligencePreviewProps> = ({
  insight,
  onPress,
  loading = false,
}) => {
  // Default insight when no data
  const defaultInsight: BalanceInsight = {
    type: 'positive',
    title: 'All balances are fair',
    subtitle: 'Everyone is contributing equally',
    icon: 'trophy',
  };

  const currentInsight = insight || defaultInsight;

  // Icon color based on insight type
  const getIconColor = () => {
    switch (currentInsight.type) {
      case 'fairness':
        return colors.financial.pending; // Orange for attention
      case 'pace':
        return colors.info; // Blue for information
      case 'positive':
        return colors.financial.positive; // Green for positive
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={[styles.loadingPlaceholder, { width: '30%', height: 20 }]} />
        <View style={[styles.loadingPlaceholder, { width: '60%', height: 16, marginTop: 8 }]} />
      </View>
    );
  }

  return (
    <MotiView
      from={{ opacity: 0, scale: 0.95, translateY: 20 }}
      animate={{ opacity: 1, scale: 1, translateY: 0 }}
      transition={{
        type: 'timing',
        duration: 300,
      }}
    >
      <TouchableOpacity
        style={styles.container}
        onPress={onPress}
        activeOpacity={0.7}
        disabled={!onPress}
      >
        <View style={styles.content}>
          {/* Icon */}
          <View style={[styles.iconContainer, { backgroundColor: getIconColor() + '20' }]}>
            <Ionicons name={currentInsight.icon} size={24} color={getIconColor()} />
          </View>

          {/* Text Content */}
          <View style={styles.textContainer}>
            <Text style={styles.title}>{currentInsight.title}</Text>
            <Text style={styles.subtitle}>{currentInsight.subtitle}</Text>
          </View>

          {/* Arrow indicator */}
          {onPress && (
            <Ionicons name="chevron-forward" size={20} color={colors.text.secondary} />
          )}
        </View>
      </TouchableOpacity>
    </MotiView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: 15,
    padding: spacing.md,
    marginVertical: spacing.sm,
    ...shadows.sm,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
    gap: spacing.xs,
  },
  title: {
    ...typography.h4,
    color: colors.text.primary,
  },
  subtitle: {
    ...typography.bodySmall,
    color: colors.text.secondary,
  },
  loadingPlaceholder: {
    backgroundColor: colors.surfaceVariant,
    borderRadius: 8,
  },
});

export default BalanceIntelligencePreview;
