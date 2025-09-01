import { View, Text } from "react-native";
import Avatar from "./Avatar";
import baseStyles from "./BaseStyles";

export default function AvatarInfoHeader({user = '?', text}) {
    return (
      <View style={[baseStyles.alignItemsCenter, baseStyles.containerCard, {padding: 15 }]}>
        <Avatar name={user} />
        <Text style={[baseStyles.title15]}>
          {text}
        </Text>
        <Text style={[baseStyles.graySubtitle]}>{user}</Text>
      </View>
    )
}   