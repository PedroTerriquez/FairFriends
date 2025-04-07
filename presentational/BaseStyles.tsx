import { StyleSheet } from 'react-native';

const baseStyles = StyleSheet.create({
    viewContainer: {
        flex: 1
    },
    viewContainerTwo: {
        flex: 2,
    },
    viewContainerThree: {
        flex: 3,
    },
    viewContainerFour: {
        flex: 4,
    },
    viewBackground: {
      flexDirection: "row",
      justifyContent: "space-around",
      padding: 10,
      backgroundColor: "#eee" 
    },
    card: {
        backgroundColor: "#fff",
        padding: 16,
        marginVertical: 4,
        borderRadius: 10,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    cardAccepted: {
        backgroundColor: "#f4fff6",
        borderWidth: 1,
        borderColor: "#7ECC10",
        shadowColor: "#7ECC10",
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    cardClose: {
        backgroundColor: "#fff4f4", 
        borderWidth: 1,
        borderColor: "#dc3545",
        shadowColor: "#dc3545",
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    cardPending: {
        backgroundColor: "#fffcf4",
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
    rowCenter: {
        flexDirection: "row",
        alignItems: "center",
    },
    rightColumn: {
        alignItems: "center",
    },
    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "#007aff",
        justifyContent: "center",
        alignItems: "center",
    },
    avatarText: {
        color: "#fff",
        fontSize: 18,
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
        marginTop: 10,
    },
    saveButton: {
        backgroundColor: "#3e8c41",
    },
    cancelButton: {
        backgroundColor: "#a8312e",
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
    label: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 5,
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        padding: 10,
        marginBottom: 15,
    },
    picker: {
        height: 50,
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 20,
    },
    email: {
        fontSize: 14,
        color: 'gray',
    },
    disabledInput: {
        backgroundColor: "#f0f0f0"
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
        width: 60,
        height: 60,
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
        flexDirection: "row",
        padding: 10,
        backgroundColor: "#f0f0f0",
        height: 60,
    },
    searchBarInput: {
        flex: 4,
        backgroundColor: "white",
        borderRadius: 8,
        height: 40,
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 10,
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
    cardTitle: {
        fontSize: 15,
        fontWeight: "bold",
        marginBottom: 2,
    },
    cardSubtitle: {
        fontSize: 14,
    },
    cardDate: {
        fontSize: 13,
        color: 'gray',
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
    boldText: { fontWeight: "bold", },
    greenText: { color: "green", fontWeight: "bold" },
    redText: { color: "red", fontWeight: "bold" },
    orangeText: { color: "orange", fontWeight: "bold" },
});

export default baseStyles