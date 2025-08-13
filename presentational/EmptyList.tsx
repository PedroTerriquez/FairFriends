import { View, Text, ScrollView } from "react-native";
import baseStyles from "./BaseStyles";
import React from "react";


export default function EmptyList({text, children}) {
    return (
        <ScrollView contentContainerStyle={[{ flex: 1 }, baseStyles.viewContainerFull, baseStyles.center]}>
            <View>
                <Text style={baseStyles.title24}>{text}</Text>
            </View>
            {children}
        </ScrollView>
    )
}
