import React from 'react';
import { View, TouchableOpacity, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { spacing, colors, shadows } from '../theme';

/**
 * Card Component - Unified card system with variants and sizes
 *
 * A flexible card component that provides consistent styling across the app.
 * Supports multiple variants, sizes, and status colors for different use cases.
 */

export type CardVariant =
  | 'elevated'    // Shadow, white bg - for primary content
  | 'outlined'    // Border, no shadow - for secondary content
  | 'filled'      // Colored bg - for status/alerts
  | 'interactive' // Elevated + press animation
  | 'minimal';    // No border/shadow - for lists

export type CardSize =
  | 'small'       // 140x100px (mini cards)
  | 'medium'      // full-width x 120px (default)
  | 'large'       // full-width x 200px (detail cards)
  | 'full';       // full-width x dynamic

export type CardStatus =
  | 'success'     // Green - positive balance, completed
  | 'warning'     // Orange - pending, attention needed
  | 'error'       // Red - rejected, overdue
  | 'info'        // Blue - information, neutral
  | 'neutral';    // White/gray - default

interface CardProps {
  children: React.ReactNode;
  variant?: CardVariant;
  size?: CardSize;
  status?: CardStatus;
  pressable?: boolean;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

/**
 * Get size styles based on CardSize
 */
const getSizeStyles = (size: CardSize): ViewStyle => {
  switch (size) {
    case 'small':
      return {
        width: 140,
        minHeight: 100,
      };
    case 'medium':
      return {
        width: '100%',
        minHeight: 120,
      };
    case 'large':
      return {
        width: '100%',
        minHeight: 200,
      };
    case 'full':
      return {
        width: '100%',
      };
  }
};

/**
 * Get variant styles based on CardVariant
 */
const getVariantStyles = (variant: CardVariant): ViewStyle => {
  switch (variant) {
    case 'elevated':
      return {
        backgroundColor: colors.surface,
        borderRadius: 15,
        ...shadows.sm,
      };
    case 'outlined':
      return {
        backgroundColor: colors.surface,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: colors.border.default,
      };
    case 'filled':
      return {
        backgroundColor: colors.surfaceVariant,
        borderRadius: 15,
      };
    case 'interactive':
      return {
        backgroundColor: colors.surface,
        borderRadius: 15,
        ...shadows.md,
      };
    case 'minimal':
      return {
        backgroundColor: 'transparent',
      };
  }
};

/**
 * Get status-based background colors
 */
const getStatusStyles = (status?: CardStatus): ViewStyle => {
  if (!status || status === 'neutral') {
    return {};
  }

  switch (status) {
    case 'success':
      return {
        backgroundColor: colors.financial.positiveLight,
        borderColor: colors.financial.positive,
      };
    case 'warning':
      return {
        backgroundColor: colors.financial.pendingLight,
        borderColor: colors.financial.pending,
      };
    case 'error':
      return {
        backgroundColor: colors.financial.negativeLight,
        borderColor: colors.financial.negative,
      };
    case 'info':
      return {
        backgroundColor: colors.primaryLight,
        borderColor: colors.primary,
      };
  }
};

/**
 * Card Component
 *
 * @example
 * // Basic elevated card
 * <Card variant="elevated" size="medium">
 *   <Text>Content</Text>
 * </Card>
 *
 * @example
 * // Interactive card with status
 * <Card
 *   variant="interactive"
 *   size="large"
 *   status="success"
 *   pressable
 *   onPress={() => navigate('/details')}
 * >
 *   <Text>Tap me</Text>
 * </Card>
 *
 * @example
 * // Outlined card for secondary content
 * <Card variant="outlined" size="small">
 *   <Text>Secondary info</Text>
 * </Card>
 */
const Card: React.FC<CardProps> = ({
  children,
  variant = 'elevated',
  size = 'medium',
  status,
  pressable = false,
  onPress,
  style,
  testID,
}) => {
  const baseStyles = styles.base;
  const sizeStyles = getSizeStyles(size);
  const variantStyles = getVariantStyles(variant);
  const statusStyles = getStatusStyles(status);

  const combinedStyles = [
    baseStyles,
    sizeStyles,
    variantStyles,
    statusStyles,
    style,
  ];

  // If pressable or has onPress, use TouchableOpacity
  if (pressable || onPress) {
    return (
      <TouchableOpacity
        style={combinedStyles}
        onPress={onPress}
        activeOpacity={0.7}
        testID={testID}
      >
        {children}
      </TouchableOpacity>
    );
  }

  // Otherwise, use plain View
  return (
    <View style={combinedStyles} testID={testID}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    padding: spacing.md,
    overflow: 'hidden',
  },
});

export default Card;
