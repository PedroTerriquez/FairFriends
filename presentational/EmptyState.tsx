import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MotiView } from 'moti';
import { colors, spacing, typography } from '@/theme';

export type EmptyStateType = 'no-data' | 'no-results' | 'error' | 'no-internet' | 'no-notifications';

interface EmptyStateProps {
  type?: EmptyStateType;
  title: string;
  subtitle?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  actionText?: string;
  onAction?: () => void;
  children?: React.ReactNode;
}

export default function EmptyState({
  type = 'no-data',
  title,
  subtitle,
  icon,
  actionText,
  onAction,
  children,
}: EmptyStateProps) {
  const getDefaultIcon = (): keyof typeof Ionicons.glyphMap => {
    switch (type) {
      case 'no-data':
        return 'document-text-outline';
      case 'no-results':
        return 'search-outline';
      case 'error':
        return 'alert-circle-outline';
      case 'no-internet':
        return 'cloud-offline-outline';
      case 'no-notifications':
        return 'notifications-off-outline';
      default:
        return 'document-text-outline';
    }
  };

  const getIconColor = () => {
    switch (type) {
      case 'error':
        return colors.financial.negative;
      case 'no-internet':
        return colors.financial.warning;
      default:
        return colors.text.tertiary;
    }
  };

  const displayIcon = icon || getDefaultIcon();
  const iconColor = getIconColor();

  return (
    <MotiView
      from={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{
        type: 'timing',
        duration: 400,
      }}
      style={styles.container}
    >
      {/* Icon */}
      <View style={[styles.iconContainer, { backgroundColor: iconColor + '15' }]}>
        <Ionicons name={displayIcon} size={48} color={iconColor} />
      </View>

      {/* Title */}
      <Text style={styles.title}>{title}</Text>

      {/* Subtitle */}
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}

      {/* Custom Children */}
      {children && <View style={styles.childrenContainer}>{children}</View>}

      {/* Action Button */}
      {actionText && onAction && (
        <TouchableOpacity
          style={styles.actionButton}
          onPress={onAction}
          activeOpacity={0.7}
        >
          <Text style={styles.actionButtonText}>{actionText}</Text>
        </TouchableOpacity>
      )}
    </MotiView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xxl,
  },
  iconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  title: {
    ...typography.h3,
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.body,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  childrenContainer: {
    marginBottom: spacing.lg,
  },
  actionButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: 12,
    marginTop: spacing.md,
  },
  actionButtonText: {
    ...typography.button,
    color: colors.surface,
  },
});
