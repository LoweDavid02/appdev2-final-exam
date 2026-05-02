import { useState } from "react";
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    TextInput,
    Alert,
    ActivityIndicator,
} from "react-native";
import Ionicons from "@react-native-vector-icons/ionicons";

import { useMutation } from "convex/react";
import { api } from "../convex/_generated/api";

interface SignupProps {
    onSignupSuccess: () => void;
}

const SignupScreen = ({ onSignupSuccess }: SignupProps) => {
    const [fullName, setFullName] = useState<string>('');
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const registerMutation = useMutation(api.users.register);

    const handleSignup = async () => {
        if (!fullName || !username || !password) {
            Alert.alert("Error", "Please fill in all fields!");
            return;
        }

        if (fullName.trim().length === 0) {
            Alert.alert("Error", "Full name cannot be empty!");
            return;
        }

        if (username.trim().length === 0) {
            Alert.alert("Error", "Username cannot be empty!");
            return;
        }

        if (password.length < 6) {
            Alert.alert("Error", "Password must be at least 6 characters!");
            return;
        }

        setIsLoading(true);

        try {
            const result = await registerMutation({
                fullname: fullName.trim(),
                username: username.trim(),
                password
            });

            if (result && typeof result === 'object' && 'success' in result) {
                if (result.success === false) {
                    Alert.alert("Signup Failed", result.message || "Unable to create account");
                } else {
                    Alert.alert("Success", "Account created successfully! Please log in.", [
                        {
                            text: "OK",
                            onPress: () => {
                                setFullName('');
                                setUsername('');
                                setPassword('');
                                onSignupSuccess();
                            }
                        }
                    ]);
                }
            } else {
                Alert.alert("Success", "Account created successfully! Please log in.", [
                    {
                        text: "OK",
                        onPress: () => {
                            setFullName('');
                            setUsername('');
                            setPassword('');
                            onSignupSuccess();
                        }
                    }
                ]);
            }
        } catch (error) {
            Alert.alert("Error", "Unexpected error occurred. Please try again!");
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            {/* 1. Header Section */}
            <View style={styles.header}>
                <Image
                    source={require("./../assets/signup.webp")}
                    style={styles.illustration}
                />
            </View>

            {/* 2. Form Section */}
            <View style={styles.formContainer}>
                <Text style={styles.label}>Full Name</Text>
                <TextInput
                    style={styles.input}
                    placeholder="John Doe"
                    value={fullName}
                    onChangeText={setFullName}
                    editable={!isLoading}
                    keyboardType="default"
                    autoCapitalize="words"
                />

                <Text style={styles.label}>Username</Text>
                <TextInput
                    style={styles.input}
                    placeholder="johndoe"
                    value={username}
                    onChangeText={setUsername}
                    editable={!isLoading}
                    autoCapitalize="none"
                />

                <Text style={styles.label}>Password</Text>
                <TextInput
                    style={styles.input}
                    secureTextEntry
                    placeholder="********"
                    value={password}
                    onChangeText={setPassword}
                    editable={!isLoading}
                />

                <TouchableOpacity
                    style={[styles.signupButton, isLoading && styles.signupButtonDisabled]}
                    onPress={handleSignup}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <ActivityIndicator color="black" />
                    ) : (
                        <Text style={styles.signupButtonText}>Sign Up</Text>
                    )}
                </TouchableOpacity>

                <Text style={styles.orText}>Or</Text>

                <View style={styles.socialRow}>
                    <TouchableOpacity style={styles.socialIcon} disabled={isLoading}>
                        <Ionicons name="logo-google" size={30} color="#DB4437" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.socialIcon} disabled={isLoading}>
                        <Ionicons name="logo-apple" size={30} color="black" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.socialIcon} disabled={isLoading}>
                        <Ionicons name="logo-facebook" size={30} color="#4267B2" />
                    </TouchableOpacity>
                </View>

                <View style={styles.footer}>
                    <Text>Already have an account? </Text>
                    <TouchableOpacity onPress={onSignupSuccess} disabled={isLoading}>
                        <Text style={styles.linkText}>Log In</Text>
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
    signupButton: {
        backgroundColor: "#FFCC00",
        padding: 18,
        borderRadius: 15,
        alignItems: "center",
        marginTop: 30,
    },
    signupButtonDisabled: {
        opacity: 0.6,
    },
    signupButtonText: {
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

export default SignupScreen;
