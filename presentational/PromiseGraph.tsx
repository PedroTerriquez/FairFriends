import { View, StyleSheet } from "react-native";
import { getColorHex } from "../services/getColorHex";

export default function PromiseGraph({ percentage }) {
  return (
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${percentage}`, backgroundColor: `${getColorHex(parseInt(percentage))}` }]} />
      </View>
  );
}

const styles = StyleSheet.create({
  progressBar: {
    height: 10,
    backgroundColor: "#ddd",
    borderRadius: 10,
    flex: 1,
    overflow: "hidden",
    marginHorizontal: 5,
  },
  percentageText: {
    color: "#888",
  },
  progressFill: {
    height: "100%",
  },
});