import React, { useState } from 'react';
import { View, Alert, StyleSheet, ImageBackground, TouchableOpacity, Image } from 'react-native';
import { TextInput, Button, Text, PaperProvider } from 'react-native-paper';
import { signUp } from '../services/authService'; // Assuming signUp function handles Firebase signup
import { auth } from '../firebaseConfig'; // Firebase config
import logo2 from '../assets/logo2.jpg';

export default function SignupScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSignup = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please fill in both fields.');
            return;
        }
        try {
            const userCredential = await signUp(email, password);
            console.log("User Credential:", userCredential);
            // The user is always inside the userCredential.user
            Alert.alert('Success', 'Account created successfully!');
            navigation.navigate('Login');
        } catch (error) {
            Alert.alert('Error', error.message);
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