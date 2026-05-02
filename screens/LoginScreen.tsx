import { useState } from "react";
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    TextInput,
    Alert,
} from "react-native";
import Ionicons from "@react-native-vector-icons/ionicons";

import { useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { Id } from "../convex/_generated/dataModel";

interface LoginProps {
    onLogin: (id: Id<"users">) => void;
    onNavigateToSignup: () => void;
}

const LoginScreen = ({ onLogin, onNavigateToSignup } : LoginProps) => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const loginMutation = useMutation(api.users.login)

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert("Error", "Please enter username and password!")
        }

        try {
            const result = await loginMutation({
                username: email,
                password
            })

            if (result.success && result.userId) {

                onLogin(result.userId)

                setEmail('')
                setPassword('')
            } else {
                Alert.alert("Login Failed", result.message)
            }

        } catch (error) {
            Alert.alert("Error", "Unexpected error happen. Please try again!")
            console.log(error)
        }
    }

    return (
        <View style={styles.container}>
            {/* 1. Header Section */}
            <View style={styles.header}>
                <Image
                    source={require("./../assets/login.webp")}
                    style={styles.illustration}
                />
            </View>


            {/* 2. Form Section */}
            <View style={styles.formContainer}>
                <Text style={styles.label}>Email Address</Text>
                <TextInput 
                    style={styles.input} 
                    placeholder="john@gmail.com" 
                    value={email}
                    onChangeText={setEmail}
                />


                <Text style={styles.label}>Password</Text>
                <TextInput
                    style={styles.input}
                    secureTextEntry
                    placeholder="********"
                    value={password}
                    onChangeText={setPassword}
                />


                <TouchableOpacity>
                    <Text style={styles.forgotText}>Forgot Password?</Text>
                </TouchableOpacity>


                <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                    <Text style={styles.loginButtonText}>Login</Text>
                </TouchableOpacity>


                <Text style={styles.orText}>Or</Text>


                <View style={styles.socialRow}>
                    <TouchableOpacity style={styles.socialIcon}>
                        <Ionicons name="logo-google" size={30} color="#DB4437" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.socialIcon}>
                        <Ionicons name="logo-apple" size={30} color="black" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.socialIcon}>
                        <Ionicons name="logo-facebook" size={30} color="#4267B2" />
                    </TouchableOpacity>
                </View>


                <View style={styles.footer}>
                    <Text>Don't have an account? </Text>
                    <TouchableOpacity onPress={onNavigateToSignup}>
                        <Text style={styles.linkText}>Sign Up</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#7D7AFF",
        paddingTop: 40,
    },
    header: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    backButton: {
        top: 50,
        left: 20,
        backgroundColor: "#FFCC00",
        padding: 8,
        borderRadius: 10,
    },
    illustration: {
        width: "80%",
        height: "70%",
    },
    formContainer: {
        flex: 2,
        backgroundColor: "#FFF",
        borderTopLeftRadius: 60,
        borderTopRightRadius: 60,
        padding: 30,
    },
    label: {
        fontSize: 14,
        color: "#666",
        marginBottom: 5,
        marginTop: 15,
    },
    input: {
        backgroundColor: "#F0F0F0",
        padding: 15,
        borderRadius: 15,
        fontSize: 16,
    },
    forgotText: {
        textAlign: "right",
        marginTop: 10,
        color: "#666",
    },
    loginButton: {
        backgroundColor: "#FFCC00",
        padding: 18,
        borderRadius: 15,
        alignItems: "center",
        marginTop: 30,
    },
    loginButtonText: {
        fontWeight: "bold",
        fontSize: 18,
    },
    orText: {
        textAlign: "center",
        marginVertical: 20,
        fontSize: 18,
        fontWeight: "bold",
    },
    socialRow: {
        flexDirection: "row",
        justifyContent: "center",
        gap: 20,
    },
    socialIcon: {
        backgroundColor: "#F0F0F0",
        padding: 15,
        borderRadius: 15,
    },
    footer: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 30,
    },
    linkText: {
        color: "#FFCC00",
        fontWeight: "bold",
    },
});


export default LoginScreen;
