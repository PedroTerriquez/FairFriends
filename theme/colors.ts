/**
 * Color System for Financial Clarity
 *
 * Semantic colors designed specifically for expense tracking and financial data.
 * Each color has a specific meaning in the context of money and fairness.
 */

export const colors = {
  // Primary Brand Color - Clean blue like Splitwise
  primary: '#5B7FFF',           // Primary blue for current user highlights
  primaryLight: '#EFF3FF',      // Very subtle blue background
  primaryDark: '#4A5FCC',       // Darker blue for pressed states

  // Accent - Purple for money highlights (itinerary, highlights)
  accent: '#A855F7',
  accentLight: '#F3E8FF',
  accentDark: '#7E22CE',

  // Financial Colors - SUBTLE, not garish
  financial: {
    // Use green ONLY for text showing positive difference
    positive: '#059669',        // Muted green for "+$X" text only
    positiveLight: '#D1F4E0',   // VERY light green for background cards
    // Use red sparingly - mostly for warning states
    negative: '#DC2626',        // Muted red for "-$X" text
    negativeLight: '#FEF2F2',   // Very light red for backgrounds
    // Default to gray for most elements
    neutral: '#6B7280',         // Gray for balanced states
    neutralLight: '#F9FAFB',    // Very light gray
    // Orange for pending/warnings only
    warning: '#F59E0B',
    warningLight: '#FEF3C7',
  },

  // Background Colors - Clean and minimal
  background: '#F8F9FA',        // Very subtle gray background
  surface: '#FFFFFF',           // Pure white for cards
  surfaceVariant: '#F5F5F5',    // Light gray for subtle sections

  // Text Colors - Clear hierarchy
  text: {
    primary: '#1A1A1A',         // Almost black for headings
    secondary: '#6B7280',       // Medium gray for body text
    tertiary: '#9CA3AF',        // Light gray for captions
    disabled: '#D1D5DB',        // Very light gray for disabled
    inverse: '#FFFFFF',         // White text on dark backgrounds
  },

  // Borders - Subtle
  border: {
    light: '#F0F0F0',           // Very light border
    default: '#E5E7EB',         // Default border
    dark: '#D1D5DB',            // Slightly darker border
  },

  // Semantic Colors - Minimal use
  success: '#10B981',
  successLight: '#D1FAE5',
  error: '#EF4444',
  errorLight: '#FEE2E2',
  info: '#3B82F6',
  infoLight: '#DBEAFE',
  gray: '#edf0f6',
} as const;

/**
 * Usage examples:
 *
 * Financial context:
 * <Text style={{ color: colors.financial.positive }}>+$150</Text>
 * <View style={{ backgroundColor: colors.financial.negativeLight }}>
 *
 * Progress indicators:
 * <View style={{ backgroundColor: colors.progress.good }}>
 *
 * General UI:
 * <Text style={{ color: colors.text.secondary }}>Caption text</Text>
 * <View style={{ backgroundColor: colors.surface }}>
 */
