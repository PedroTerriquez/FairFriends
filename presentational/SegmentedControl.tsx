import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  ScrollView,
  LayoutChangeEvent,
} from 'react-native';
import { colors, spacing } from '@/theme';

/**
 * SegmentedControl — animated toggle with optional count badges and horizontal
 * scrolling when the segments don't fit the screen width.
 *
 * segments: [{ key, label, count? }]
 *   - `key`     stable identifier used for selection state
 *   - `label`   visible text
 *   - `count`   optional number; renders a pill badge when > 0
 * selectedKey: the currently-active segment key
 * onSelect:    called with the new segment key when a segment is tapped
 */

export default function SegmentedControl({ segments, selectedKey, onSelect }) {
  const selectedIndex = Math.max(0, segments.findIndex((s) => s.key === selectedKey));

  const selectionOffset = useRef(new Animated.Value(selectedIndex)).current;
  const segmentLayoutsRef = useRef([]);
  const [segmentLayouts, setSegmentLayouts] = useState([]);
  const [viewportWidth, setViewportWidth] = useState(0);
  const scrollRef = useRef(null);
  const isMeasured = segmentLayouts.length === segments.length;

  useEffect(() => {
    Animated.spring(selectionOffset, {
      toValue: selectedIndex,
      useNativeDriver: false,
      tension: 200,
      friction: 25,
    }).start();

    // Auto-scroll so the selected segment is centered when the track overflows.
    if (isMeasured && viewportWidth > 0 && scrollRef.current) {
      const layout = segmentLayouts[selectedIndex];
      if (layout) {
        const targetX = Math.max(0, layout.x + layout.width / 2 - viewportWidth / 2);
        scrollRef.current.scrollTo({ x: targetX, animated: true });
      }
    }
  }, [selectedIndex, isMeasured, viewportWidth, segmentLayouts]);

  const measureSegment = (index) => (event: LayoutChangeEvent) => {
    const { x, width } = event.nativeEvent.layout;
    segmentLayoutsRef.current[index] = { x, width };
    const collected = segmentLayoutsRef.current;
    if (collected.length === segments.length && collected.every((l) => l && typeof l.width === 'number')) {
      setSegmentLayouts([...collected]);
    }
  };

  const handleViewportLayout = (event: LayoutChangeEvent) => {
    setViewportWidth(event.nativeEvent.layout.width);
  };

  const inputRange = segments.map((_, i) => i);
  const translateX = isMeasured
    ? selectionOffset.interpolate({
        inputRange,
        outputRange: segmentLayouts.map((l) => l.x + 2),
      })
    : 0;
  const sliderWidth = isMeasured
    ? selectionOffset.interpolate({
        inputRange,
        outputRange: segmentLayouts.map((l) => Math.max(0, l.width - 4)),
      })
    : 0;

  return (
    <View style={styles.viewport} onLayout={handleViewportLayout}>
      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        bounces={false}
      >
        <View style={[styles.container, viewportWidth > 0 && { minWidth: viewportWidth }]}>
          {isMeasured && (
            <Animated.View
              style={[
                styles.slidingBackground,
                { width: sliderWidth, transform: [{ translateX }] },
              ]}
            />
          )}

          {segments.map((segment, index) => {
            const isSelected = index === selectedIndex;
            const showBadge = typeof segment.count === 'number' && segment.count > 0;

            return (
              <TouchableOpacity
                key={segment.key}
                style={styles.segment}
                onPress={() => onSelect(segment.key)}
                onLayout={measureSegment(index)}
                activeOpacity={0.7}
              >
                <Text style={[styles.label, isSelected && styles.labelSelected]}>
                  {segment.label}
                </Text>
                {showBadge && <CountBadge count={segment.count} isSelected={isSelected} />}
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

function CountBadge({ count, isSelected }) {
  const displayCount = count > 99 ? '99+' : String(count);
  return (
    <View style={[styles.badge, isSelected ? styles.badgeSelected : styles.badgeUnselected]}>
      <Text style={[styles.badgeText, isSelected ? styles.badgeTextSelected : styles.badgeTextUnselected]}>
        {displayCount}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  viewport: {
    width: '100%',
  },
  scrollContent: {
    flexGrow: 1,
  },
  container: {
    flexDirection: 'row',
    backgroundColor: colors.background,
    borderRadius: 10,
    padding: 4,
    position: 'relative',
  },
  slidingBackground: {
    position: 'absolute',
    left: 0,
    top: 4,
    bottom: 4,
    backgroundColor: colors.surface,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  segment: {
    flexGrow: 1,
    flexShrink: 0,
    flexBasis: 'auto',
    flexDirection: 'row',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  label: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.text.secondary,
  },
  labelSelected: {
    fontWeight: '600',
    color: colors.text.primary,
  },
  badge: {
    marginLeft: 6,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    paddingHorizontal: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeSelected: {
    backgroundColor: colors.primary,
  },
  badgeUnselected: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
    lineHeight: 14,
  },
  badgeTextSelected: {
    color: colors.text.inverse,
  },
  badgeTextUnselected: {
    color: colors.text.secondary,
  },
});
