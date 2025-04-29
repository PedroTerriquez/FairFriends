import { StyleSheet } from 'react-native';

const baseStyles = StyleSheet.create({
    viewContainerFull: {
        flex: 1,
        backgroundColor: "#f6f6f6",
        paddingHorizontal: 15
    },
    viewContainerFullOnly: {
        flex: 1,
    },
    viewRowWithSpace: {
        flexDirection: "row",
        justifyContent: "space-around",
        padding: 10,
    },
    viewAsRowCenter: {
        flexDirection: "row",
        justifyContent: "center",
        padding: 10,
    },
    viewRow: {
        flexDirection: "row",
        paddingVertical: 10,
        alignItems: "center",
    },
    bigNumber: {
        fontSize: 40,
        fontWeight: "bold",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
    },
    titleh2: {
        fontSize: 15,
        fontWeight: "bold",
    },
    textCenter: {
        textAlign: "center",
    },
    label: {
        fontSize: 15,
        marginBottom: 5,
    },
    smallLabel: {
        fontSize: 12,
        marginBottom: 5,
    },
    textGray14: {
        fontSize: 14,
        color: 'gray',
    },
    card: {
        backgroundColor: "#fff",
        paddingVertical: 15,
        paddingHorizontal: 20,
        marginVertical: 8,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: "#0000002e",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        overflow: 'visible',
        minHeight: 80,
    },
    cardAccepted: {
        borderWidth: 1,
        borderColor: "#7ECC10",
        shadowColor: "#7ECC10",
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    cardClose: {
        borderWidth: 1,
        borderColor: "#dc3545",
        shadowColor: "#dc3545",
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    cardPending: {
        borderWidth: 1,
        borderColor: "#ffc107",
        shadowColor: "#ffc107",
        shadowOpacity: 0.3, 
        shadowRadius: 8,
    },
    cardNoBorder: {
        backgroundColor: "white",
        padding: 16,
        borderRadius: 8,
        elevation: 3,
    },
    cardContent: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    cardTitle: {
        fontSize: 15,
        fontWeight: "bold",
        marginBottom: 2,
    },
    cardSubtitle: {
        fontSize: 14,
    },
    cardDate: {
        fontSize: 12,
        color: 'gray',
    },
    rowCenter: {
        flexDirection: "row",
        alignItems: "center",
    },
    alignItemsCenter: {
        alignItems: "center",
    },
    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    avatar: {
        width: 30,
        height: 30,
        borderRadius: 20,
        backgroundColor: "#007aff",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 8,
    },
    avatarText: {
        color: "#fff",
        fontSize: 15,
        fontWeight: "bold",
    },
    marginLeft: {
        marginLeft: 10,
    },
    marginLeft5: {
        marginLeft: 5,
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 20,
    },
    button: {
        flex: 1,
        padding: 12,
        borderRadius: 8,
        alignItems: "center",
        marginHorizontal: 5,
        color: "white"
    },
    circleButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 5,
    },
    saveButton: {
        backgroundColor: "#3e8c41",
    },
    cancelButton: {
        backgroundColor: "#a8312e",
    },
    normalButton: {
        backgroundColor: "#007AFF",
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
    input: {
        borderWidth: 1,
        borderColor: "#0000002e",
        borderBottomWidth: 1,
        borderRadius: 8,
        padding: 10,
    },
    picker: {
        height: 50,
        marginBottom: 20,
    },
    disabledInput: {
        backgroundColor: "#f0f0f0"
    },
    floatingBadgeForCard: {
        position: "absolute",
        top: 10, 
        right: 20,
        width: 'auto',
        height: 30,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 20,
        paddingHorizontal: 10,
        flexDirection: "row",
    },
    floatingIconForCard: {
        position: "absolute",
        top: 10, 
        right: 10,
        width: 40,
        height: 40,
        alignItems: "center",
        justifyContent: "center",
        elevation: 5,
        zIndex: 10,
    },
    floatingButton: {
        position: "absolute",
        bottom: 10, 
        right: 10,
        width: 50,
        height: 50,
        backgroundColor: "#007AFF",
        borderRadius: 30,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
        zIndex: 10,
 
    },
    searchBar: {
        paddingHorizontal: 0,
    },
    searchBarInput: {
        backgroundColor: "white",
        borderRadius: 15,
        height: 50,
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 10,
        marginVertical: 10,
    },
    searchBarCancelButton: {
        flex: 1,
        backgroundColor: "white",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 8,
        height: 40,
        marginLeft: 10,
        borderWidth: 0.1,
        borderColor: "#c1c1c1",
    },
    red: {
        backgroundColor: '#a8312e',
    },
    green: {
        backgroundColor: 'green',
    },
    blue: {
        backgroundColor: '#007aff',
    },
    buttonWarning: {
        backgroundColor: "#f8c146",
    },
    buttonSuccess: {
        backgroundColor: "#4CAF50",
    },
    buttonDanger: {
        backgroundColor: "#E53935",
    },
    backgroundGreen: {
        backgroundColor: "#e6ffe6",
    },
    backgroundRed: {
        backgroundColor: "#ffe6e6",
    },
    backgroundOrange: {
        backgroundColor: "#fffcf4",
    },
    boldText: { fontWeight: "bold", },
    greenText: { color: "green", fontWeight: "bold" },
    redText: { color: "red", fontWeight: "bold" },
    orangeText: { color: "orange", fontWeight: "bold" },
    tabBarActive: {
        flex: 1,
        backgroundColor: '#007bff',
        borderRadius: 20,
        paddingHorizontal: 15,
        paddingVertical: 8,
        alignItems: "center",
        justifyContent: "center",
        marginHorizontal: 10,
    },
    tabBarTextActive: {
        color: 'white',
        fontWeight: "bold"
    },
    tabBarInactive: {
        flex: 1,
        backgroundColor: 'white',
        borderRadius: 20,
        paddingHorizontal: 15,
        paddingVertical: 8,
        alignItems: "center",
        justifyContent: "center"
    },
    tabBarTextInactive: {
        color: 'gray',
        fontWeight: "normal"
    },
});

export default baseStyles