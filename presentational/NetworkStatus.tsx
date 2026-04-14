import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MotiView } from 'moti';
import NetInfo from '@react-native-community/netinfo';
import { colors, spacing, typography } from '@/theme';

export default function NetworkStatus() {
  const [isConnected, setIsConnected] = useState(true);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      const connected = state.isConnected ?? true;
      setIsConnected(connected);

      if (!connected) {
        setShowBanner(true);
      } else {
        // Show "Back online" briefly before hiding
        if (showBanner) {
          setTimeout(() => setShowBanner(false), 2000);
        }
      }
    });

    return () => unsubscribe();
  }, [showBanner]);

  if (!showBanner) return null;

  return (
    <MotiView
      from={{ translateY: -100 }}
      animate={{ translateY: 0 }}
      exit={{ translateY: -100 }}
      transition={{
        type: 'spring',
        damping: 20,
      }}
      style={[
        styles.banner,
        isConnected ? styles.bannerOnline : styles.bannerOffline
      ]}
    >
      <Ionicons
        name={isConnected ? 'cloud-done' : 'cloud-offline'}
        size={20}
        color={colors.surface}
      />
      <Text style={styles.bannerText}>
        {isConnected ? 'Back online' : 'No internet connection'}
      </Text>
    </MotiView>
  );
}

const styles = StyleSheet.create({
  banner: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    zIndex: 9999,
  },
  bannerOffline: {
    backgroundColor: colors.financial.negative,
  },
  bannerOnline: {
    backgroundColor: colors.financial.positive,
  },
  bannerText: {
    ...typography.body,
    color: colors.surface,
    fontWeight: '600',
  },
});
