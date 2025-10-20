import { Ionicons, MaterialIcons } from "@expo/vector-icons";
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

export function InSplitButton({ onPressAction }) {
    return (
        <Pressable
            style={[baseStyles.circleButton, baseStyles.grayBG]}
            onPress={onPressAction}>
            <MaterialIcons name="call-split" size={23} color="white" />
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
            <MaterialIcons name="edit" size={21} color="white" />
        </Pressable>
    )

}