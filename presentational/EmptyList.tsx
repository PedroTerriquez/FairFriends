import { View, Text, ScrollView } from "react-native";
import baseStyles from "./BaseStyles";

export default function EmptyList(text: string) {
    return (
        <View style={[baseStyles.viewContainer, baseStyles.center]}>
                    <Text style={baseStyles.boldText}>{text}</Text>
                </View>
    )
}   