import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { spacing, typography } from '../theme';
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

  // Background color matches the prominent button language used
  // elsewhere on the balance screen (Trip Itinerary / Trip Highlights / WhatsApp)
  const getBackgroundColor = () => {
    switch (type) {
      case 'fairness':
        return '#F59E0B'; // amber
      case 'settlement':
        return '#3B82F6'; // blue
      case 'pace':
        return '#10B981'; // emerald
    }
  };

  const displayIcon = icon || getDefaultIcon();
  const backgroundColor = getBackgroundColor();

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
        style={[styles.container, { backgroundColor }]}
        onPress={onPress}
        onPressIn={() => setIsPressed(true)}
        onPressOut={() => setIsPressed(false)}
        activeOpacity={0.9}
        disabled={!onPress}
      >
        <View style={styles.row}>
          <View style={styles.iconContainer}>
            <Ionicons name={displayIcon} size={28} color="#FFFFFF" />
          </View>
          <View style={styles.headerText}>
            <Text style={styles.title}>{title}</Text>
            {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
          </View>
        </View>

        {children && <View style={styles.content}>{children}</View>}
      </TouchableOpacity>
    </MotiView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
    borderRadius: 24,
    padding: spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  iconContainer: {
    width: 56,
    height: 56,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    flex: 1,
  },
  title: {
    ...typography.h4,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 20,
  },
  content: {
    marginTop: spacing.md,
  },
});

export default InsightCard;
