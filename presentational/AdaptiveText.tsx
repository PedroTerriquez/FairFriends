import React from "react";
import { Text } from "react-native";

function AdaptiveText({ children, style, minimumFontScale = 0.6, ...rest }) {
  return (
    <Text
      {...rest}
      style={style}
      numberOfLines={1}
      adjustsFontSizeToFit
      minimumFontScale={minimumFontScale}
    >
      {children}
    </Text>
  );
}

export default AdaptiveText;
