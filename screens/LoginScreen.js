import React, { useState } from 'react';
import { View, Alert, StyleSheet, ImageBackground, TouchableOpacity } from 'react-native';
import { TextInput, Button, Text, PaperProvider } from 'react-native-paper';
import { login } from '../services/authService';

// Helper function for email validation
const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export default function LoginScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        if (!validateEmail(email)) {
            Alert.alert('Invalid Email', 'Please enter a valid email address.');
            return;
        }
        if (password.length < 6) {
            Alert.alert('Password Too Short', 'Password must be at least 6 characters.');
            return;
        }
        try {
            await login(email, password);
            Alert.alert('Success', 'Logged in successfully!');
            navigation.navigate('AppTabs', { screen: 'Home' });
        } catch (error) {
            Alert.alert('Login Failed', error.message || 'An error occurred during login.');
        }
    };

    return (
        <PaperProvider>
            <ImageBackground
                source={{ uri: "https://astym.com/wp-content/uploads/2014/11/runner-1-scaled.jpg" }}
                style={styles.background}
            >
                <View style={styles.overlay}>
                    <Text style={styles.title}>Login</Text>
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
                    <Button mode="contained" onPress={handleLogin} style={styles.button}>
                        Log In
                    </Button>
                    <TouchableOpacity style={styles.buttonOutline} onPress={() => navigation.navigate('Signup')}>
                        <Text style={styles.buttonOutlineText}>Don't have an account? Sign Up</Text>
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
        backgroundColor: 'rgba(255, 255, 255, 0.85)',
        borderRadius: 10,
        alignItems: 'center',
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
    },
    button: {
        width: '100%',
        paddingVertical: 12,
        backgroundColor: '#6A0DAD',
        borderRadius: 8,
        marginTop: 15,
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
