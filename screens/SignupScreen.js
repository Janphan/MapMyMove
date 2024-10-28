// screens/SignupScreen.js
import React, { useState } from 'react';
import { View, TextInput, Button, Text, Alert, StyleSheet } from 'react-native';
import { signUp } from '../services/authService';
import { auth } from '../firebaseConfig';

export default function SignupScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [displayName, setDisplayName] = useState('');

    const handleSignup = async () => {
        try {
            const userCredential = await signUp(email, password);
            const user = userCredential.user;
            if (user) {
                // Set display name if user is successfully created
                await user.updateProfile({
                    displayName: displayName,
                });
                console.log("User display name set:", displayName);
                Alert.alert('Success', 'Account created successfully!');
                navigation.navigate('AuthStack', { screen: 'Login' });

            } else {
                console.error("User creation failed. User object is null.");
            }
        }
        catch (error) {
            Alert.alert('Error', error.message);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Sign Up</Text>
            <TextInput
                placeholder="Username"
                value={displayName}
                onChangeText={text => setDisplayName(text)}
                style={styles.input}
            />
            <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} />
            <TextInput style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
            <Button title="Sign Up" onPress={handleSignup} />
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
