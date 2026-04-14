/**
 * Typography System
 *
 * Semantic type scale for consistent text hierarchy.
 * Uses system fonts (SF Pro on iOS, Roboto on Android) for native feel.
 */

export const typography = {
  // Display - Large numbers and hero text
  display1: {
    fontSize: 48,
    lineHeight: 56,
    fontWeight: '700' as const,
  },
  display2: {
    fontSize: 40,
    lineHeight: 48,
    fontWeight: '700' as const,
  },

  // Headings
  h1: {
    fontSize: 32,
    lineHeight: 40,
    fontWeight: '700' as const,
  },
  h2: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: '600' as const,
  },
  h3: {
    fontSize: 20,
    lineHeight: 28,
    fontWeight: '600' as const,
  },
  h4: {
    fontSize: 17,
    lineHeight: 24,
    fontWeight: '600' as const,
  },

  // Body text
  bodyLarge: {
    fontSize: 17,
    lineHeight: 24,
    fontWeight: '400' as const,
  },
  body: {
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '400' as const,
  },
  bodySmall: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400' as const,
  },

  // UI elements
  button: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '600' as const,
  },
  caption: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '400' as const,
  },
  overline: {
    fontSize: 10,
    lineHeight: 16,
    fontWeight: '700' as const,
    textTransform: 'uppercase' as const,
  },
} as const;

/**
 * Usage examples:
 *
 * <Text style={typography.h2}>Heading Text</Text>
 * <Text style={typography.body}>Body text</Text>
 * <Text style={typography.caption}>Small caption</Text>
 */
