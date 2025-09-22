const mystyle = {
    signin_background: "https://i.pinimg.com/736x/a4/a1/9b/a4a19b940987cb322cf4d75079a8ddc8.jpg",
    menuItemStyle: {
        backgroundColor: "#c0e3a9",
        width: "100%",
    },
};

const signup_signin_style = {
    background: {
        flex: 1,
        resizeMode: "cover",
    },
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
        // backgroundColor: "rgba(255, 255, 255, 1.0)", // Semi-transparent background
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        marginBottom: 20,
        fontFamily: "sans-serif", // Add custom font if needed
    },
    input: {
        width: "100%",
        padding: 12,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        marginBottom: 10,
        backgroundColor: "#fff",
    },
    button: {
        backgroundColor: "#5e7055",
        padding: 15,
        borderRadius: 8,
        width: "100%",
        alignItems: "center",
        marginBottom: 10,
    },
    buttonText: {
        color: "#fff",
        fontWeight: "bold",
    },
    link: {
        marginTop: 15,
        color: "#black",
        fontWeight: "bold",
    },
    googleButton: {
        backgroundColor: "#db4437",
        padding: 15,
        borderRadius: 8,
        width: "100%",
        alignItems: "center",
        marginTop: 20,
    },
    googleButtonText: {
        color: "#fff",
        fontWeight: "bold",
    },
    eyeIcon: {
        position: 'absolute',
        right: 10,
        padding: 5,
    },
    subtitle: {
        fontSize: 16,
        color: "#333",
        marginBottom: 20,
        fontFamily: "sans-serif",
    },
}

export { mystyle, signup_signin_style };