import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { MotiView } from 'moti';
import { colors, spacing, typography } from '@/theme';

interface LoadingStateProps {
  message?: string;
  fullScreen?: boolean;
}

export default function LoadingState({
  message = 'Loading...',
  fullScreen = true,
}: LoadingStateProps) {
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={[styles.container, fullScreen && styles.fullScreen]}>
      <MotiView
        from={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          type: 'spring',
          damping: 15,
        }}
        style={styles.content}
      >
        {/* Spinner */}
        <Animated.View style={[styles.spinner, { transform: [{ rotate }] }]}>
          <View style={styles.spinnerInner} />
        </Animated.View>

        {/* Message */}
        {message && <Text style={styles.message}>{message}</Text>}

        {/* Pulsing Dots */}
        <View style={styles.dotsContainer}>
          {[0, 1, 2].map((index) => (
            <MotiView
              key={index}
              from={{ opacity: 0.3 }}
              animate={{ opacity: 1 }}
              transition={{
                type: 'timing',
                duration: 600,
                delay: index * 200,
                loop: true,
              }}
              style={styles.dot}
            />
          ))}
        </View>
      </MotiView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  fullScreen: {
    flex: 1,
  },
  content: {
    alignItems: 'center',
  },
  spinner: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 4,
    borderColor: colors.surfaceVariant,
    borderTopColor: colors.primary,
    marginBottom: spacing.lg,
  },
  spinnerInner: {
    width: '100%',
    height: '100%',
  },
  message: {
    ...typography.body,
    color: colors.text.secondary,
    marginBottom: spacing.md,
  },
  dotsContainer: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
});
