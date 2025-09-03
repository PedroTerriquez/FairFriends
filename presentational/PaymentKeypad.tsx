import { Text, TextInput, TouchableOpacity, View } from "react-native";
import baseStyles from "@/presentational/BaseStyles";

export default function PaymentKeyPad({ amount, amountSuggestion, onKeyPress, handleSubmit }) {
  return (
    <View style={[baseStyles.containerCard, { flex: 1 }]}>
      <View style={{ flex: 1 }}>
        {amountSuggestion && (<Text style={[baseStyles.textCenter, baseStyles.label14, baseStyles.textGray]}>Suggested amount ${amountSuggestion}</Text>)}
        <TextInput
          placeholder="0"
          placeholderTextColor="#666"
          style={[baseStyles.money, { width: '100%', marginBottom: 0, textAlign: "center", fontSize: amount.length < 4 ? 100 : 400 / amount.length, marginVertical: 10 }]}
          value={`$ ${amount}`}
          editable={false}
          keyboardType="numeric"
        />
      </View>

      <View style={{ flex: 4 }}>
        {[
          [1, 2, 3],
          [4, 5, 6],
          [7, 8, 9],
          ['.', '0', '⌫'],
        ].map((row, id) => (
          <View key={id} style={[baseStyles.keypadRow]}>
            {row.map((num) => (
              <TouchableOpacity
                key={num}
                style={baseStyles.keypadButton}
                onPress={() => onKeyPress(num.toString())}
              >
                <Text style={baseStyles.keypadText}>{num}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
        <View style={[baseStyles.keypadRow, { flex: 1 }]}>
          <TouchableOpacity
            style={[baseStyles.button, baseStyles.saveButton, { paddingHorizontal: '30%' }]}
            onPress={handleSubmit}
          >
            <Text style={baseStyles.buttonText}>Fair Pay</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )

}