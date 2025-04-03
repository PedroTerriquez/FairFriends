import { View, Text } from "react-native";
import Avatar from "./Avatar";
import baseStyles from "./BaseStyles";

export default function AvatarInfoHeader({user, text}) {
    return (
      <View style={[baseStyles.card, baseStyles.rightColumn, { marginBottom: 40 }]}>
        <Avatar name={user || '?'} />
        <Text style={[baseStyles.marginLeft]}>
          {text}
        </Text>
      </View>
    )
}   