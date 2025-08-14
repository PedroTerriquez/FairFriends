import { View, TextInput } from "react-native";
import baseStyles from "./BaseStyles";
import { Ionicons } from "@expo/vector-icons";

export default function SearchBarInput({ text, setText }) {
    return (
        <View>
            <View style={[baseStyles.searchBarInput, baseStyles.viewRowWithSpace]}>
                <Ionicons name="search" size={20} color="gray" style={{ marginRight: 5 }} />
                <TextInput
                    style={{ flex: 1 }}
                    placeholder="Search"
                    placeholderTextColor="#666"
                    value={text}
                    onChangeText={(newText) => { setText(newText) }}
                    autoFocus={true}
                />
            </View>
        </View>
    );
}