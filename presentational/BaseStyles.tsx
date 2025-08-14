import { StyleSheet } from 'react-native';

const baseStyles = StyleSheet.create({
    //Containers
    viewContainerFull: {
        flex: 1,
        backgroundColor: "white",
        paddingHorizontal: 5
    },
    viewRowWithSpace: {
        flexDirection: "row",
        justifyContent: "space-around",
        padding: 10,
    },
    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    // General Alignments
    rowCenter: {
        flexDirection: "row",
        alignItems: "center",
    },
    alignItemsCenter: {
        alignItems: "center",
    },
    paddingVertical10: {
        paddingVertical: 10,
    },
    // Label Sizes
    titleBold40: {
        fontSize: 40,
        fontWeight: "bold",
    },
    title24: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
    },
    title17: {
        fontSize: 17,
        fontWeight: "bold",
    },
    title15: {
        fontSize: 15,
        fontWeight: "bold",
    },
    label17: {
        fontSize: 17,
        marginBottom: 5,
    },
    label14: {
        fontSize: 14,
    },
    smallLabel: {
        fontSize: 12,
        marginBottom: 5,
    },
    // Text Caracteristics
    textCenter: {
        textAlign: "center",
    },
    textGray: {
        color: "gray",
    },
    textBlack: {
        color: "black",
    },
    textWhite: {
        color: "white",
    },
    boldText: {
        fontWeight: "bold",
    },
    greenText: {
        color: "green",
        fontWeight: "bold"
    },
    errorText: {
        color: "red",
    },
    redText: {
        color: "red",
        fontWeight: "bold"
    },
    orangeText: {
        color: "orange",
        fontWeight: "bold"
    },
    link: {
        color: '#007bff',
    },
    // Backgrounds
    redBG: {
        backgroundColor: '#a8312e',
    },
    greenBG: {
        backgroundColor: 'green',
    },
    blueBG: {
        backgroundColor: '#007aff',
    },
    warningBG: {
        backgroundColor: "#f8c146",
    },
    successBG: {
        backgroundColor: "#4CAF50",
    },
    dangerBG: {
        backgroundColor: "#E53935",
    },
    lightGreenBG: {
        backgroundColor: "#e6ffe6",
    },
    lightBlueBG: {
        backgroundColor: "#e6f3ff",
    },
    lightRedBG: {
        backgroundColor: "#ffe6e6",
    },
    lightOrangeBG: {
        backgroundColor: "#fffcf4",
    },
    // Card Styles
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
        minHeight: 50,
    },
    cardRead: {
        borderColor: "#0000002e",
    },
    cardUnread: {
        backgroundColor: "#2887ec1f",
        borderWidth: 1,
    },
    cardClose: {
        borderWidth: 1,
        borderColor: "#7ECC10",
        shadowColor: "#7ECC10",
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
    cardAccepted: {
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: "blue",
        shadowColor: "blue",
        shadowOpacity: 0.1,
        shadowRadius: 8,
    },
    cardRejected: {
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: "#dc3545",
        shadowColor: "#dc3545",
        shadowOpacity: 0.1,
        shadowRadius: 8,
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
    // Buttons
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 20,
    },
    button: {
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
    },
    // Rest of utilities
    avatar: {
        width: 30,
        height: 30,
        borderRadius: 20,
        backgroundColor: "#007aff",
        justifyContent: "center",
        alignItems: "center",
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
    input: {
        borderWidth: 1,
        borderColor: "#0000002e",
        borderBottomWidth: 1,
        borderRadius: 8,
        padding: 14,
        fontSize: 16,
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
    searchBarInput: {
        backgroundColor: "white",
        borderRadius: 15,
        height: 50,
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 10,
        marginVertical: 10,
    },
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
        backgroundColor: '#f6f6f6',
        borderRadius: 20,
        paddingHorizontal: 15,
        paddingVertical: 8,
        alignItems: "center",
        justifyContent: "center"
    },
    tabBarTextInactive: {
        color: 'black',
        fontWeight: "normal"
    }, 
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '80%',
        height: '50%',
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default baseStyles