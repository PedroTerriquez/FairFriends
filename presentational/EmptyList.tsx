import { Text, ScrollView } from "react-native";
import baseStyles from "./BaseStyles";
import React from "react";

export default function EmptyList({ text, children }) {
    return (
        <ScrollView contentContainerStyle={[baseStyles.center, baseStyles.containerCard]}>
            <Text style={[baseStyles.title24, {marginBottom: 10}]}>{text}</Text>
            {children}
        </ScrollView>
    )
}
