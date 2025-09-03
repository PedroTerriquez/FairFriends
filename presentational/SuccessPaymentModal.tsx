import { View, TouchableOpacity, Text, Modal } from 'react-native';
import baseStyles from '@/presentational/BaseStyles';
import { Feather, MaterialIcons } from '@expo/vector-icons';

export default function SuccessPaymentModal({ visible, total, onClose, onBack }) {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={baseStyles.modalContainer}>
        <View style={baseStyles.modalContent}>
          <Feather name="check-circle" size={120} style={{ marginTop: 50 }} color="#4CAF50" />
          <Text style={[baseStyles.title24, { marginBottom: 50 }]}>Payment Successful</Text>
          <Text style={[baseStyles.titleBold40, { marginBottom: 50 }]}>${total}</Text>
          <TouchableOpacity
            style={[baseStyles.circleButton, baseStyles.saveButton, { width: 60, height: 60, borderRadius: 50 }]}
            onPress={onBack}
          >
            <MaterialIcons name="navigate-next" size={50} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

