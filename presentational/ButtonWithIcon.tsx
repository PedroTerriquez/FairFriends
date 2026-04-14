import React, { useRef } from "react";
import { TouchableOpacity, Text, Animated } from "react-native";
import * as Haptics from 'expo-haptics';
import baseStyles from "@/presentational/BaseStyles";

export default function ButtonWithIcon({ onPress, icon, text, style = {}, textStyle ={}, testID}) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
      tension: 300,
      friction: 20,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 300,
      friction: 20,
    }).start();
  };

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onPress();
  };

  return (
    <TouchableOpacity
      testID={testID}
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={1}
    >
      <Animated.View style={[baseStyles.buttonWithIcon, style, { transform: [{ scale: scaleAnim }] }]}>
        {icon}
        <Text style={[baseStyles.textWhite, baseStyles.boldText, { fontSize: 12 }, textStyle]}>{text}</Text>
      </Animated.View>
    </TouchableOpacity>
  );

}