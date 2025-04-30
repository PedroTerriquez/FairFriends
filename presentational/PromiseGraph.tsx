import { View, StyleSheet } from "react-native";

export default function PromiseGraph({ percentage }) {
  const getColorHex = (value) => {
    let color;

    switch (true) {
      case (value <= 20):
        color = '#FF6F61';
        break;
      case (value <= 40):
        color = '#FFB84D';
        break;
      case (value <= 60):
        color = '#F2E205';
        break;
      case (value <= 80):
        color = '#A8D08D';
        break;
      case (value <= 100):
        color = '#4caf50';
        break;
      default:
        color = '#FF6F61';
    }

    return color;
  };

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