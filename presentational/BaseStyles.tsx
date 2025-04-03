import { StyleSheet } from 'react-native';

const baseStyles = StyleSheet.create({
    viewContainer: {
        flex: 1
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
        backgroundColor: 'gray',
        justifyContent: 'center',
        alignItems: 'center',
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
    }
});

export default baseStyles