import { View, Text } from "react-native";
import baseStyles from "./BaseStyles";

export default function Avatar({ name }) {
    return (
        <View style={baseStyles.avatar}>
            <Text style={baseStyles.avatarText}>
                {`${name[0]}`}
            </Text>
        </View>
    );
}