import { View, Text, ScrollView } from "react-native";
import baseStyles from "./BaseStyles";

export default function EmptyList(text: string) {
    return (
        <ScrollView contentContainerStyle={[baseStyles.viewContainerFull, baseStyles.center]}>
            <View>
                <Text style={baseStyles.boldText}>{text}</Text>
            </View>
        </ScrollView>
    )
}