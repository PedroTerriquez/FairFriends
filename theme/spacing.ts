/**
 * Spacing System - 8pt Grid
 *
 * Consistent spacing tokens for layout and component spacing.
 * All values are multiples of 4 for consistent vertical rhythm.
 */

export const spacing = {
  xxs: 2,   // Extra extra small - Tiny gaps, fine adjustments
  xs: 4,    // Extra small - Icon-text gap, tight spacing
  ssm: 6,   // Super small - Micro adjustments, very tight spacing
  sm: 8,    // Small - Related elements, form field gaps
  md: 16,   // Medium - Section padding, card padding
  lg: 24,   // Large - Major section gaps, screen sections
  xl: 32,   // Extra large - Screen horizontal padding
  xxl: 48,  // Extra extra large - Major vertical spacing between sections
} as const;

/**
 * Usage examples:
 *
 * <View style={{ padding: spacing.md }}>
 * <View style={{ gap: spacing.sm }}>
 * <View style={{ marginTop: spacing.lg, marginHorizontal: spacing.xl }}>
 */
