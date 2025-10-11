import { Pressable, Text, View } from "react-native";
import baseStyles from "./BaseStyles";

export default function TopNavBar({menus, setActiveTab, activeTab}) {
  return (
    <View style={[baseStyles.viewRowWithSpace, baseStyles.tabBarContainer]}>
      {(menus ?? []).map((menu) => {
        const isActive = activeTab === menu;
        return (
          <Pressable
            key={menu}
            onPress={() => setActiveTab(menu)}
            style={isActive ? baseStyles.tabBarActive : baseStyles.tabBarInactive}
          >
            <Text style={isActive ? baseStyles.tabBarTextActive : baseStyles.tabBarTextInactive}>
              {menu}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}