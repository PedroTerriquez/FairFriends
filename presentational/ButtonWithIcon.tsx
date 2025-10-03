import { TouchableOpacity, Text } from "react-native";
import baseStyles from "@/presentational/BaseStyles";

export default function ButtonWithIcon({ onPress, icon, text, style, textStyle ={}}) {
  return (
    <TouchableOpacity
      style={[baseStyles.buttonWithIcon, style]}
      onPress={() => onPress() }
    >
      {icon}
      <Text style={[baseStyles.textWhite, { fontSize: 12 }, textStyle]}>{text}</Text>
    </TouchableOpacity>
  );
  
}