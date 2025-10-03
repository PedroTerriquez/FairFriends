import { View, Text } from "react-native";
import baseStyles from "./BaseStyles";

export default function Avatar({ name, size = 30}) {
    function getRandomColor() {
        const r = Math.floor(100 + Math.random() * 100); // 100-200
        const g = Math.floor(100 + Math.random() * 100);
        const b = Math.floor(100 + Math.random() * 100);
        return `rgb(${r}, ${g}, ${b})`;
    }
    return (
        <View style={[baseStyles.avatar, { backgroundColor: getRandomColor(), width: size || 40, height: size || 40, borderRadius: (size || 40) / 2 }]}>
            <Text style={[baseStyles.avatarText, { fontSize: (size || 40) / 2 }]}>
                {`${name[0]}`}
            </Text>
        </View>
    );
}