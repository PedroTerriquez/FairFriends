import { View, TouchableOpacity, Text, Modal } from 'react-native';
import baseStyles from '@/presentational/BaseStyles';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import { t } from 'i18next';

export default function SuccessPaymentModal({ visible, total, onClose, onBack }) {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={baseStyles.modalContainer}>
        {/* Centered content */}
        <View style={[baseStyles.modalContent, { justifyContent: 'center', alignItems: 'center', paddingVertical: 30 }]}>
          <Feather name="check-circle" size={120} color="#4CAF50" />
          <Text style={[baseStyles.titleBold40, { marginTop: 20 }]}>{`$${total}`}</Text>
          <Text style={[baseStyles.title24, { marginTop: 10 }]}>{t('successPaymentModal.payment_successful')}</Text>
        </View>

        {/* Button pinned to the bottom */}
        <View style={{ position: 'absolute', bottom: 30, left: 0, right: 0, alignItems: 'center' }}>
          <TouchableOpacity
            style={[baseStyles.circleButton, baseStyles.saveButton, { width: 60, height: 60, borderRadius: 30 }]}
            onPress={onBack}
          >
            <MaterialIcons name="navigate-next" size={50} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

