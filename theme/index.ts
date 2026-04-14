/**
 * Design System - Central Export
 *
 * Import design tokens from a single location:
 * import { spacing, typography, colors, shadows } from '../theme';
 */

export { spacing } from './spacing';
export { typography } from './typography';
export { colors } from './colors';
export { shadows } from './shadows';

// Re-export all as a theme object for convenience
export const theme = {
  spacing: require('./spacing').spacing,
  typography: require('./typography').typography,
  colors: require('./colors').colors,
  shadows: require('./shadows').shadows,
} as const;
