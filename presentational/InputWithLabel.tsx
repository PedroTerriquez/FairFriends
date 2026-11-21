import { useState } from "react";
import { TextInput, View, Text } from "react-native";
import baseStyles from "./BaseStyles";
import { colors } from '../theme';

export default function InputWithLabel({ label, name, value, onChangeText, placeholder, numeric = false, error, editable = true }) {
    const [focused, setFocused] = useState(false);
    return (
        <View>
            <Text style={baseStyles.label17}>{label}</Text>
            <TextInput
                style={[baseStyles.input, focused && !error && baseStyles.inputFocused, !editable && baseStyles.disabledInput, error && baseStyles.inputError]}
                value={value != null ? String(value) : ''}
                onChangeText={(newValue) => onChangeText(name, newValue)}
                placeholder={placeholder}
                placeholderTextColor={colors.text.secondary}
                editable={editable}
                keyboardType={numeric ? 'numeric' : 'default'}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
            />
            {error && <Text style={baseStyles.errorText}>{error}</Text>}
        </View >
    )
}
