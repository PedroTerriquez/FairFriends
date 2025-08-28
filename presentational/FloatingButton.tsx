import { TouchableOpacity } from "react-native";
import baseStyles from "./BaseStyles";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

export default function FloatingButton({ icon, action, style = null }) {
    return (
        <TouchableOpacity style={[baseStyles.floatingButton, style]}
            onPress={() => action()}>
            {icon === 'add' && <Ionicons name="add" size={31} color="white" />}
            {icon === 'navigate-next' && <MaterialIcons name="navigate-next" size={31} color="white" />}
            {icon === 'close' && <Ionicons name="close-sharp" size={31} color="white" />}
            {icon === 'split' && <MaterialIcons name="call-split" size={31} color="white" />}
        </TouchableOpacity>
    );
}