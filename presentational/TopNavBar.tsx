import { Pressable, Text, View } from "react-native";
import baseStyles from "./BaseStyles";
import { useTranslation } from 'react-i18next';

export default function TopNavBar({menus, quantityPerMenu = {}, setActiveTab, activeTab}) {
  const { t } = useTranslation();
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
            <View style={[ { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }, isActive ? baseStyles.tabBarTextActive : baseStyles.tabBarTextInactive as any]}>
              <Text>{t(`topNavBar.${menu}`)}</Text>
              { quantityPerMenu[menu] > 0 && 
              <Text style={[baseStyles.quantityBadge, baseStyles.warningBG, {marginLeft: 4}]}>{quantityPerMenu[menu]}</Text> }
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}
