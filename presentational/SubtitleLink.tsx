import { Pressable, Text } from "react-native";
import baseStyles from "@/presentational/BaseStyles";
import { FontAwesome } from "@expo/vector-icons";

export default function SubtitleLink ({text, onPress}) {
    return (
        <Pressable style={{ flexDirection: 'row', gap: 10, paddingVertical: 10 }} onPress={onPress}>
            <Text style={[baseStyles.label17, { fontWeight: 600 }]}>{text}</Text>
            <FontAwesome name="angle-right" size={20}/>
        </Pressable>
    );
}