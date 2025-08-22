import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text } from "react-native";
import baseStyles from "./BaseStyles";

export default function AcceptButton({ onPressAction }) {
    return (
        <Pressable
            style={[baseStyles.circleButton, baseStyles.successBG]}
            onPress={onPressAction}>
            <Ionicons name="checkmark" size={21} color="white" />
        </Pressable>

    )
}

export function RejectButton({ onPressAction }) {
    return (
        <Pressable
            style={[baseStyles.circleButton, baseStyles.redBG]}
            onPress={onPressAction}>
            <Ionicons name="close" size={21} color="white" />
        </Pressable>
    )
}

export function PendingButton({ onPressAction }) {
    return (
        <Pressable
            style={[baseStyles.circleButton, baseStyles.warningBG]}
            onPress={onPressAction}>
            <Ionicons name="warning" size={21} color="white" />
        </Pressable>
    )
}

export function EditButton({ onPressAction }) {
    return (
        <Pressable
            style={[baseStyles.circleButton, baseStyles.warningBG]}
            onPressIn={() => onPressAction()} >
            <Text style={baseStyles.buttonText}>✎</Text>
        </Pressable>
    )

}