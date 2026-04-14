import React, { useRef } from "react";
import { TouchableOpacity, Animated } from "react-native";
import * as Haptics from 'expo-haptics';
import baseStyles from "./BaseStyles";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

export default function FloatingButton({ icon, action, style = null, testID }) {
    const scaleAnim = useRef(new Animated.Value(1)).current;

    const handlePressIn = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        Animated.spring(scaleAnim, {
            toValue: 0.9,
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
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        action();
    };

    return (
        <TouchableOpacity
            testID={testID}
            onPress={handlePress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            activeOpacity={1}
        >
            <Animated.View style={[baseStyles.floatingButton, style, { transform: [{ scale: scaleAnim }] }]}>
                {icon === 'add' && <Ionicons name="add" size={31} color="white" />}
                {icon === 'navigate-next' && <MaterialIcons name="navigate-next" size={31} color="white" />}
                {icon === 'close' && <Ionicons name="close-sharp" size={31} color="white" />}
                {icon === 'split' && <MaterialIcons name="call-split" size={31} color="white" />}
            </Animated.View>
        </TouchableOpacity>
    );
}