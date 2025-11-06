import { View, Text, Modal, TouchableOpacity, ScrollView } from "react-native";
import baseStyles from "./BaseStyles";
import { Ionicons } from "@expo/vector-icons";
import ButtonWithIcon from "./ButtonWithIcon";
import Avatar from "./Avatar";

export default function ModalInfoSplit({ balanceSplittedInfo, visible, onClose }) {
    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="slide"
            onRequestClose={onClose}
        >
            <View style={{ flex: 1 }}>
                <ScrollView contentContainerStyle={baseStyles.modalContainer}>
                    <View style={[baseStyles.modalContent, { alignItems: "flex-start", justifyContent: "space-between" } ]}>
                        <Text style={[baseStyles.title32, { marginBottom: 20, marginTop: 60 }]}>Split</Text>
                        <Text style={[baseStyles.label17]}>We've split the payment and will show how much each member owes.</Text>
                        <Text style={[baseStyles.title24, { marginTop: 30 }]}>Settlements</Text>
                        <View style={{marginTop: 10, width: '100%'}}>
                            {balanceSplittedInfo.payments.map((payment: { from: string; to: string; amount: number }, index: number) => (
                                <View
                                    key={index}
                                    style={[baseStyles.card, {
                                        flexDirection: "row",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                    }]}
                                >
                                    <Avatar name={payment.from} />
                                    <Avatar name={payment.to} />
                                    <Text style={{ flex: 3, alignItems: 'center' }}>
                                        {payment.from} owes {payment.to}
                                    </Text>
                                    <Text style={{ flex: 2, textAlign: "right", fontWeight: "bold" }}>
                                        ${payment.amount}
                                    </Text>
                                </View>
                            ))}
                        </View>
                        <Text style={[baseStyles.title24, { marginTop: 40 }]}>Detail</Text>
                        <Text style={[baseStyles.title17, { marginTop: 15 }]}>Balance debt</Text>
                        <View style={[baseStyles.card, { marginTop: 10, width: '100%' }]}>
                            <View style={[baseStyles.tableRow, { borderBottomWidth: 1, borderBottomColor: 'black' }]}>
                                <Text style={{ flex: 1 }}>Name</Text>
                                <Text style={{ flex: 1.5 }}>Paid</Text>
                                <Text style={{ flex: 1.5 }}>Getting Back/Owes</Text>
                            </View>
                            {balanceSplittedInfo.paid_per_member.map((payment: [string, number], index: number) => {
                                const owesOrGetsBack = payment[1] - balanceSplittedInfo.debt_per_member;
                                return (
                                    <View key={index} style={baseStyles.tableRow}>
                                        <Text style={{ flex: 1 }}>
                                            {payment[0].length > 8 ? payment[0].slice(0, 8) + "..." : payment[0]}
                                        </Text>
                                        <Text style={{ flex: 1.5 }}>${payment[1]}</Text>
                                        <Text
                                            style={{
                                                flex: 1.5,
                                                color: owesOrGetsBack < 0 ? baseStyles.negativeValueText.color : baseStyles.greenText.color,
                                                fontWeight: "bold",
                                                textAlign: "right",
                                            }}
                                        >
                                            ${Math.abs(owesOrGetsBack)}
                                        </Text>
                                    </View>
                                );
                            })}
                            <View style={baseStyles.tableRow}>
                                <Text style={{ flex: 1, fontWeight: 'bold' }}>
                                    {"Total"}
                                </Text>
                                <Text style={{ flex: 1.5, fontWeight: 'bold' }}>${balanceSplittedInfo.total}</Text>
                                <Text
                                    style={{
                                        flex: 1.5,
                                        fontWeight: "bold",
                                        textAlign: "right",
                                    }}
                                >
                                    ${Math.abs(balanceSplittedInfo.debt_per_member)}
                                </Text>
                            </View>
                        </View>
                        <Text style={[baseStyles.title15, { marginTop: 15 }]}>Balance payments</Text>
                        <View style={[baseStyles.card, { marginTop: 10, width: '100%' }]}>
                            {balanceSplittedInfo.balance_payments.map((payment: { from: string; to: string; amount: number }, index: number) => (
                                <View
                                    key={index}
                                    style={{
                                        flexDirection: "row",
                                        justifyContent: "space-between",
                                        paddingVertical: 4,
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
                        <Text style={[baseStyles.title15, { marginTop: 15 }]}>Uneven payments</Text>
                        <View style={[baseStyles.card, { marginTop: 10, width: '100%' }]}>
                            {balanceSplittedInfo.uneven_payments.map((payment: { from: string; to: string; amount: number }, index: number) => (
                                <View
                                    key={index}
                                    style={{
                                        flexDirection: "row",
                                        justifyContent: "space-between",
                                        paddingVertical: 4,
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
                        <Text style={[baseStyles.title15, { marginTop: 15 }]}>All payments ordered</Text>
                        <View style={[baseStyles.card, { marginTop: 10, width: '100%' }]}>
                            {balanceSplittedInfo.ordered_payments.map((payment: { from: string; to: string; amount: number }, index: number) => (
                                <View
                                    key={index}
                                    style={{
                                        flexDirection: "row",
                                        justifyContent: "space-between",
                                        paddingVertical: 4,
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
                    </View>
                </ScrollView>

                <View style={{ position: "absolute", left: 20, right: 20, bottom: 20, justifyContent: "center", alignItems: "center", zIndex: 999 }}>
                    <TouchableOpacity style={{ backgroundColor: 'red', borderRadius: 50, padding: 20, borderColor: 'white', borderWidth: 1 }} onPress={() => onClose(false)}>
                        <Ionicons name="close-sharp" size={25} color="white" />
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    )
}