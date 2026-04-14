import { View, Text, StyleSheet } from "react-native";

/**
 * Avatar - Bright circular avatar with white initials
 * Consistent colors based on name (same name = same color)
 */

const AVATAR_COLORS = [
  '#3B82F6', // Bright blue
  '#10B981', // Bright green
  '#F59E0B', // Bright orange
  '#EF4444', // Bright red
  '#EC4899', // Bright pink
  '#8B5CF6', // Bright purple
  '#14B8A6', // Bright teal
  '#F97316', // Bright orange-red
];

export default function Avatar({ name, size = 40 }) {
    // Hash function to get consistent color for same name
    function getColorForName(name: string) {
        if (!name) return AVATAR_COLORS[0];
        let hash = 0;
        for (let i = 0; i < name.length; i++) {
            hash = name.charCodeAt(i) + ((hash << 5) - hash);
        }
        return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
    }

    const backgroundColor = getColorForName(name);
    const initial = name ? name[0].toUpperCase() : '?';

    return (
        <View style={[
            styles.avatar,
            {
                backgroundColor,
                width: size,
                height: size,
                borderRadius: size / 2,
            }
        ]}>
            <Text style={[styles.avatarText, { fontSize: size * 0.45 }]}>
                {initial}{initial}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    avatar: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarText: {
        color: '#FFFFFF',
        fontWeight: '600',
    },
});