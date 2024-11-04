import React from 'react';
import { View, Text, Button, Alert, StyleSheet } from 'react-native';
import { clearSession } from '../services/authService';

export default function LogoutScreen({ navigation }) {
    const handleLogout = async () => {
        try {
            await clearSession();
            Alert.alert('Logged Out', 'You have been logged out successfully.');
            navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }], // Redirect to Login screen
            });
        } catch (error) {
            Alert.alert('Logout Failed', 'An error occurred while logging out.');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.message}>Are you sure you want to log out?</Text>
            <Button title="Log Out" onPress={handleLogout} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    message: {
        fontSize: 18,
        marginBottom: 20,
        textAlign: 'center',
    },
});
