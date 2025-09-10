import { View, Text } from "react-native";
import baseStyles from "./BaseStyles";

export default function Avatar({ name }) {
    function getRandomColor() {
        const r = Math.floor(100 + Math.random() * 100); // 100-200
        const g = Math.floor(100 + Math.random() * 100);
        const b = Math.floor(100 + Math.random() * 100);
        return `rgb(${r}, ${g}, ${b})`;
    }
    return (
        <View style={[baseStyles.avatar, { backgroundColor: getRandomColor() }]}>
            <Text style={baseStyles.avatarText}>
                {`${name[0]}`}
            </Text>
        </View>
    );
}