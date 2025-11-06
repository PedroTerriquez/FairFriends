import { StyleSheet } from 'react-native';

const baseStyles = StyleSheet.create({
    //Containers
    generalBackground: {
        backgroundColor: '#F2F4F5',
    },
    viewContainerFull: {
        flex: 1,
        backgroundColor: '#EFEEF3',
        paddingHorizontal: 15,
        paddingVertical: 5,
    },
    viewContainerFullScrollable: {
        flexGrow: 1,
        backgroundColor: '#f6f6f6',
        padding: 5,
    },
    containerCard: {
        backgroundColor: 'white',
        borderRadius: 15,
        padding: 10,
        borderWidth: 0.3,
        borderColor: "#0404044c",
        marginVertical: 5,
    },
    viewRowWithSpace: {
        flexDirection: "row",
        justifyContent: "space-around",
    },
    fullWidth: {
        width: '90%',
    },
    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    }, 
    spinnerContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(255,255,255,0.5)", // Optional: semi-transparent overlay
    },
    leftSection: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start',
    },
    rightSection: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    rowCenter: {
        flexDirection: "row",
        alignItems: "center",
    },
    rowSpaceBetween: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    columnCenter: {
        flexDirection: "column",
        alignItems: "center",
    },
    alignItemsCenter: {
        alignItems: "center",
    },
    // Label Sizes
    titleBold40: {
        fontSize: 40,
        fontWeight: "bold",
    },
    title32: {
        fontSize: 32,
        fontWeight: 'bold',
    },
    title24: {
        fontSize: 24,
        fontWeight: "bold",
    },
    title26: {
        fontSize: 26,
        fontWeight: "bold",
    },
    title20: {
        fontSize: 20,
        fontWeight: "bold",
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
    textLightBlack: {
        color: "#4b4b4bff",
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
    postiveValueText: {
        color: "green",
    },
    negativeValueText: {
        color: "#dc3545",
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
        color: '#2F66FF',
    },
    // Backgrounds
    redBG: {
        backgroundColor: '#a8312e',
    },
    blackBG: {
        backgroundColor: 'black',
    },
    greenBG: {
        backgroundColor: 'green',
    },
    blueBG: {
        backgroundColor: '#449cfaff',
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
    grayBG: {
        backgroundColor: "#b5b5b5ff",
    },
    lightRedBG: {
        backgroundColor: "#ffe6e6",
    },
    lightOrangeBG: {
        backgroundColor: "#fffcf4",
    },
    blueLogo: {
        color: '#2F66FF',
    },
    graySubtitle: {
        color: '#666',
    },
    // Card Styles
    card: {
        backgroundColor: "white",
        paddingVertical: 15,
        paddingHorizontal: 20,
        marginVertical: 5,
        borderRadius: 15,
        overflow: 'visible',
    },
    cardRead: {
        borderColor: "#0000002e",
    },
    cardUnread: {
        backgroundColor: "#F3F5FE",
    },
    cardClose: {
        shadowColor: "#7ECC10",
    },
    cardPending: {
        shadowColor: "#ffc107",
    },
    cardAccepted: {
        shadowColor: "#4CAF50",
    },
    cardRejected: {
        shadowColor: "#ffe6e6",
    },
    cardContent: {
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
        padding: 10,
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
    loginButton: {
        flexDirection: 'row',
        backgroundColor: '#2F66FF',
        paddingHorizontal: 30,
        paddingVertical: 15,
        borderRadius: 25,
        alignItems: 'center',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
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
    buttonWithIcon: {
        flexDirection: 'column',
        padding: 5,
        gap: 3,
        minWidth: 75,
        borderRadius: 10,
        alignItems: 'center',
        backgroundColor: "white",
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
    marginLeft10: {
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
        marginVertical: 10,
    },
    grayInput: {
        backgroundColor: '#e7e7e7ff',
        borderColor: "#0000002e",
        borderWidth: 1,
        padding: 15,
        borderRadius: 10,
        marginBottom: 15,
        fontSize: 16,
    },
    picker: {
        height: 50,
        marginBottom: 20,
    },
    disabledInput: {
        backgroundColor: "#f0f0f0"
    },
    inputError: {
        borderColor: "red",
    },
    badge: {
        borderRadius: 10,
        padding: 5,
    },
    quantityBadge: {
        borderRadius: 15,
        paddingHorizontal: 5,
        paddingVertical: 3,
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
        bottom: 20, 
        right: 20,
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
        width: '100%',
    },
    tabBarContainer: {
        backgroundColor: '#f0f0f0ff',
        borderRadius: 20,
        alignItems: "center",
        justifyContent: "center",
        borderColor: "#0000002e",
        borderWidth: 0.5,
    },
    tabBarActive: {
        flex: 1,
        backgroundColor: 'white',
        borderRadius: 20,
        paddingHorizontal: 10,
        paddingVertical: 10,
        alignItems: "center",
        justifyContent: "center",
        borderColor: "#0000002e",
        borderWidth: 1,
    },
    tabBarTextActive: {
        color: 'black',
    },
    tabBarInactive: {
        flex: 1,
        borderRadius: 20,
        alignItems: "center",
        justifyContent: "center",
    },
    tabBarTextInactive: {
        color: '#5f5f5fff',
    }, 
    modalContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
    },
    modalContent: {
        width: '100%',
        height: '100%',
        padding: 10,
        backgroundColor: '#EFEEF3',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    // Payment Screen Styles---
    money: {
        fontSize: 70,
        fontWeight: 'bold',
        color: '#000000',
    },
    keypadRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 5, 
        gap: 10
    },
    keypadButton: {
        width: 80,
        height: 80,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#c8c8c8ff',
        borderRadius: 40,
        margin: 5,
    },
    keypadText: {
        fontSize: 32,
        color: '#000000',
    },
    // Table
    table: {
        borderWidth: 1,
        borderColor: '#0000002e',
        borderRadius: 10,
        overflow: 'hidden',
        padding: 15,
    },
    tableRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 4,
        alignItems: "center",
    },

    // Header
    header: {
        backgroundColor: 'white',
        paddingBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
});

export default baseStyles