/**
 * Shadow/Elevation System
 *
 * Consistent elevation levels for depth and hierarchy.
 * Includes both iOS (shadow) and Android (elevation) properties.
 */

export const shadows = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },

  // Small elevation - Subtle depth
  // Use for: List items, subtle cards
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },

  // Medium elevation - Standard cards
  // Use for: Cards, raised buttons
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },

  // Large elevation - Prominent elements
  // Use for: Floating action buttons, important cards
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 6,
  },

  // Extra large elevation - Modals and overlays
  // Use for: Modals, bottom sheets, popovers
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.16,
    shadowRadius: 16,
    elevation: 10,
  },
} as const;

/**
 * Usage by context:
 *
 * - List items: shadows.sm
 * - Standard cards: shadows.md
 * - Floating buttons: shadows.lg
 * - Modals: shadows.xl
 * - Pressed state: Transition from shadows.md to shadows.lg
 *
 * Usage examples:
 *
 * <View style={[styles.card, shadows.md]}>
 * <TouchableOpacity style={[styles.button, shadows.lg]}>
 */
