import { TextInput, View, Text } from "react-native";
import baseStyles from "./BaseStyles";

export default function InputWithLabel({ label, name, value, onChangeText, placeholder, numeric = false, error, editable = true }) {
    return (
        <View>
            <Text style={baseStyles.label17}>{label}</Text>
            <TextInput
                style={[baseStyles.input, !editable && baseStyles.disabledInput, error && baseStyles.inputError]}
                value={value != null ? String(value) : ''}
                onChangeText={(newValue) => onChangeText(name, newValue)}
                placeholder={placeholder}
                editable={editable}
                keyboardType= {numeric ? 'numeric' : 'default'}
            />
            {error && <Text style={baseStyles.errorText}>{error}</Text>}
        </View >
    )
}