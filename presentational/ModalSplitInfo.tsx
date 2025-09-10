import { View, Text, Modal, TouchableOpacity, ScrollView } from "react-native";
import baseStyles from "./BaseStyles";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import ButtonWithIcon from "./ButtonWithIcon";

export default function ModalInfoSplit({ balanceSplittedInfo, visible, onClose }) {
    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="slide"
            onRequestClose={onClose}
        >
            <ScrollView contentContainerStyle={baseStyles.modalContainer}>
                <View style={[baseStyles.modalContent, { alignItems: "flex-start", justifyContent: "space-between" } ]}>
                    <Text style={[baseStyles.title24, { marginBottom: 20 }]}>Split</Text>
                    <Text style={[baseStyles.label17, { marginBottom: 20 }]}>We've split the payment and will show how much each member owes.</Text>
                    <Text style={[baseStyles.title24, { marginTop: 30 }]}>Settlements</Text>
                    <View style={{marginTop: 10, width: '100%'}}>
                        {balanceSplittedInfo.payments.map((payment, index) => (
                            <View
                                key={index}
                                style={{
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                    paddingVertical: 4
                                }}
                            >
                                <Text style={{ flex: 5 }}>
                                    {payment.from} owes {payment.to}
                                </Text>
                                <Text style={{ flex: 2, textAlign: "right" }}>
                                    ${payment.amount}
                                </Text>
                            </View>
                        ))}
                    </View>
                    <Text style={[baseStyles.title24, { marginTop: 80 }]}>Detail</Text>
                    <Text style={[baseStyles.title15, { marginTop: 15 }]}>Debt per member: {balanceSplittedInfo.debt_per_member} </Text>
                    <Text style={[baseStyles.title15, { marginTop: 15 }]}>Paid per member</Text>
                    <View style={{marginTop: 10, width: '100%'}}>
                        {
                            balanceSplittedInfo.paid_per_member.map((payment, index) => (
                            <View
                                key={index}
                                style={{
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                    paddingVertical: 4
                                }}
                            >
                                <Text style={{ flex: 1 }}>
                                    {payment[0]}
                                </Text>
                                <Text style={{ flex: 1, textAlign: "left" }}>
                                    Paid ${payment[1]}
                                </Text>
                                <Text style={{ flex: 1, textAlign: "left" }}>
                                    Paying ${-1*(payment[1] - balanceSplittedInfo.debt_per_member)}
                                </Text>
                            </View>
                        ))}
                    </View>
                    <Text style={[baseStyles.title15, { marginTop: 15 }]}>Uneven payments (personal):</Text>
                    <View style={{marginTop: 10, width: '100%'}}>
                        {
                            balanceSplittedInfo.unevent_payments.map((payment, index) => (
                                <View
                                    key={index}
                                    style={{
                                        flexDirection: "row",
                                        justifyContent: "space-between",
                                        paddingVertical: 4
                                    }}
                                >
                                    <Text style={{ flex: 5 }}>
                                        {payment.from} owes {payment.to}
                                    </Text>
                                    <Text style={{ flex: 2, textAlign: "right" }}>
                                        ${payment.amount}
                                    </Text>
                                </View>
                        ))}
                    </View>
                    <ButtonWithIcon
                        style={[baseStyles.successBG, { marginTop: 50 }]}
                        textStyle={{ fontSize: 20, marginLeft: 5 }}
                        text='Close'
                        onPress={() => onClose(false)}
                        icon={<Ionicons name="close-sharp" size={25} color="white" />}
                    />
                </View>
            </ScrollView>
        </Modal>
    )
}