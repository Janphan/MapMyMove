import React, { useState } from 'react';
import { View, TextInput, Button, Text, Alert, StyleSheet } from 'react-native';
import { login } from '../services/authService';

// Helper function for email validation
const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;  // Basic email validation regex
    return emailRegex.test(email);
};

export default function LoginScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        if (!validateEmail(email)) {
            Alert.alert('Error', 'Please enter a valid email address.');
            return;
        }
        if (password.length < 6) {
            Alert.alert('Error', 'Password must be at least 6 characters.');
            return;
        }
        try {
            await login(email, password);  // Call the login function from authService
            Alert.alert('Success', 'Logged in successfully!');
            navigation.navigate('AppTabs', { screen: 'Home' });  // Navigate to the Home screen after successful login
        } catch (error) {
            Alert.alert('Error', `Error logging in: ${error.message}`);  // Show an error message if something goes wrong
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Login</Text>
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            <Button title="Log In" onPress={handleLogin} />
            <Button title="Sign Up" onPress={() => navigation.navigate('Signup')} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#f5f5f5'
    },
    title: {
        fontSize: 24,
        marginBottom: 24,
        fontWeight: 'bold',
    },
    input: {
        width: '100%',
        padding: 10,
        marginVertical: 8,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
    },
});
