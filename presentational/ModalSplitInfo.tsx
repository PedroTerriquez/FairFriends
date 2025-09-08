import { View, Text, Modal, TouchableOpacity } from "react-native";
import baseStyles from "./BaseStyles";
import { MaterialIcons } from "@expo/vector-icons";

export default function ModalInfoSplit({ payments, visible, onClose }) {
    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="slide"
            onRequestClose={onClose}
        >
            <View style={baseStyles.modalContainer}>
                <View style={baseStyles.modalContent}>
                    <Text style={[baseStyles.title24, { marginBottom: 20 }]}>Split</Text>
                    <Text style={[baseStyles.label17, { marginBottom: 20 }]}>We've split the payment and will show how much each member owes.</Text>
                    <Text style={[baseStyles.title17, { marginTop: 30 }]}>Settlements:</Text>
                    <View style={{marginTop: 10}}>
                        {payments.map((payment, index) => (
                            <Text key={index}>• {payment.from} owes {payment.to} ${payment.amount}</Text>
                        ))}
                    </View>
                    <TouchableOpacity
                        style={[baseStyles.circleButton, baseStyles.saveButton, { width: 60, height: 60, borderRadius: 50, marginTop: 'auto' }]}
                        onPress={onClose}
                    >
                        <MaterialIcons name="close" size={50} color="white" />
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    )
}