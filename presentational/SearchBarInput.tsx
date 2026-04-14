import { View, TextInput } from "react-native";
import baseStyles from "./BaseStyles";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

export default function SearchBarInput({ text, setText, testID }) {
    const { t } = useTranslation();
    return (
        <View>
            <View style={[baseStyles.searchBarInput, baseStyles.viewRowWithSpace]}>
                <Ionicons name="search" size={20} color="gray" style={{ marginRight: 5 }} />
                <TextInput
                    testID={testID}
                    style={{ flex: 1 }}
                    placeholder={t('searchBarInput.search')}
                    placeholderTextColor="#666"
                    value={text}
                    onChangeText={(newText) => { setText(newText) }}
                    autoFocus={true}
                />
            </View>
        </View>
    );
}