import { Pressable, Text } from "react-native";
import baseStyles from "@/presentational/BaseStyles";

export default function SubtitleLink ({text, onPress}) {
    return (
        <Pressable onPress={onPress}>
            <Text style={[baseStyles.label17, { fontWeight: 600 }]}>{text}</Text>
        </Pressable>
    );
}