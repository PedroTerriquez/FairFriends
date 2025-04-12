import { View, Text } from "react-native";
import Avatar from "./Avatar";
import baseStyles from "./BaseStyles";

export default function AvatarInfoHeader({user = '?', text}) {
    return (
      <View style={[baseStyles.alignItemsCenter]}>
        <Text style={[baseStyles.titleh2]}>
          {text}
        </Text>
        <Text style={[baseStyles.email]}>{user}</Text><Avatar name={user} />
      </View>
    )
}   