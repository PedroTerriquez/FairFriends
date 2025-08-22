import { TouchableOpacity } from "react-native";
import baseStyles from "./BaseStyles";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

export default function FloatingButton({ icon, action }) {
    return (
        <TouchableOpacity style={baseStyles.floatingButton}
            onPress={() => action()}>
            {icon === 'add' && <Ionicons name="add" size={31} color="white" />}
            {icon === 'navigate-next' && <MaterialIcons name="navigate-next" size={31} color="white" />}
        </TouchableOpacity>
    );
}