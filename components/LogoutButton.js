import React from 'react';
import { Alert, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { logout } from '../services/authService';

const LogoutButton = () => {
    const navigation = useNavigation();

    const handleLogout = async () => {
        try {
            await logout();
            Alert.alert('Logged Out', 'You have been logged out successfully.');
            navigation.navigate('Login');
        } catch (error) {
            Alert.alert('Logout Failed', 'An error occurred while logging out.');
        }
    };

    return (
        <Button
            mode="contained"
            onPress={handleLogout}
            color="red"
            style={styles.logoutButton}
        >
            Log Out
        </Button>
    );
};

const styles = StyleSheet.create({
    logoutButton: {
        marginTop: 20,
        width: '60%',
        alignSelf: 'center',
    },
});

export default LogoutButton;