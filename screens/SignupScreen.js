import React, { useState } from 'react';
import { View, Alert, StyleSheet, ImageBackground, TouchableOpacity, Image } from 'react-native';
import { TextInput, Button, Text, PaperProvider } from 'react-native-paper';
import { signUp } from '../services/authService';
import logo2 from '../assets/logo2.jpg';
import { db } from '../firebaseConfig';
import { sendEmailVerification } from 'firebase/auth';
import { query, where, collection, getDocs, setDoc, doc } from 'firebase/firestore';

export default function SignupScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');

    // Utility function to validate email format
    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email regex
        return emailRegex.test(email);
    };

    const handleSignup = async () => {
        if (!username || !email || !password) {
            Alert.alert('Error', 'Please fill in all fields.');
            return;
        }
        try {
            const usersRef = collection(db, 'users');
            const usernameQuery = query(usersRef, where("username", "==", username));
            const querySnapshot = await getDocs(usernameQuery);
            if (!querySnapshot.empty) {
                Alert.alert('Error', 'Username already exists. Please choose a different username.');
                return;
            }
            if (!validateEmail(email)) {
                Alert.alert('Invalid Email', 'Please enter a valid email address.');
                return;
            }
            if (password.length < 6) {
                Alert.alert('Password Too Short', 'Password must be at least 6 characters.');
                return;
            }
            // Check if email is already in use
            const emailQuery = query(usersRef, where("email", "==", email));
            const emailSnapshot = await getDocs(emailQuery);
            if (!emailSnapshot.empty) {

                Alert.alert('Error', 'Email already in use. Please use a different email.');
                return;
            }
            // Create user with email and password

            const userCredential = await signUp(email, password);
            console.log("User Credential:", userCredential);

            const user = userCredential?.user; // Safely access the user object
            if (!user) {
                throw new Error('User creation failed. No user object returned.');
            }

            console.log("User Object:", user);

            // Save username and email to Firestore
            await setDoc(doc(db, 'users', user.uid), {
                displayName: username,
                email: email,

            });
            console.log("Username:", username);
            console.log("Email:", email);

            Alert.alert('Success', 'Account created successfully!');
            await sendEmailVerification(user); // Send email verification
            Alert.alert('Verification Email Sent', 'Please check your email to verify your account.');
            navigation.navigate('Login'); // Navigate to login screen after successful signup
        } catch (error) {
            if (error.code === 'auth/email-already-in-use') {
                Alert.alert('Error', 'Email already in use. Please use a different email.');
            }
            else if (error.code === 'auth/invalid-email') {
                Alert.alert('Error', 'Invalid email format. Please enter a valid email.');
            }
            else if (error.code === 'auth/weak-password') {
                Alert.alert('Error', 'Password should be at least 6 characters long.');
            }
            else if (error.code === 'auth/operation-not-allowed') {
                Alert.alert('Error', 'Email/Password sign-in is not enabled. Please contact support.');
            }
            console.error('Error signing up:', error.message);
        }
    };

    return (
        <PaperProvider>
            <ImageBackground
                source={{ uri: "https://shorturl.at/YxAR0" }}
                style={styles.background}
            >
                <View style={styles.overlay}>
                    <Image
                        source={logo2}
                        style={styles.logo}
                    />
                    <Text style={styles.title}>Sign Up</Text>
                    <TextInput
                        label="Email"
                        mode="outlined"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        style={styles.input}
                    />
                    <TextInput
                        label="Username"
                        mode="outlined"
                        value={username}
                        onChangeText={setUsername}
                        autoCapitalize="none"
                        style={styles.input}
                    />
                    <TextInput
                        label="Password"
                        mode="outlined"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                        style={styles.input}
                    />
                    <Button mode="contained" onPress={handleSignup} style={styles.button}>
                        Sign Up
                    </Button>
                    <TouchableOpacity style={styles.buttonOutline} onPress={() => navigation.navigate('Login')}>
                        <Text style={styles.buttonOutlineText}>Already have an account? Log In</Text>
                    </TouchableOpacity>
                </View>
            </ImageBackground>
        </PaperProvider>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    overlay: {
        width: '90%',
        padding: 24,
        backgroundColor: 'rgba(255, 255, 255, 0.85)', // semi-transparent overlay to improve readability
        borderRadius: 10,
        alignItems: 'center',
    },
    logo: {
        width: 50,
        height: 50,
        borderRadius: 25,
        position: 'absolute',
        top: 20,
        left: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#4B0082',
        marginBottom: 20,
    },
    input: {
        width: '100%',
        marginVertical: 8,
        borderRadius: 8,
        backgroundColor: '#f9f9f9',
        elevation: 2,
    },
    button: {
        width: '100%',
        paddingVertical: 12,
        backgroundColor: '#6A0DAD',
        borderRadius: 25,
        marginTop: 15,
        elevation: 3,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    buttonOutline: {
        width: '100%',
        paddingVertical: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#6A0DAD',
        alignItems: 'center',
        marginTop: 10,
    },
    buttonOutlineText: {
        color: '#6A0DAD',
        fontSize: 16,
        fontWeight: '600',
    },
});