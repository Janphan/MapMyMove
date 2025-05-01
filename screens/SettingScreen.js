import React, { useContext, useState } from 'react';
import { StyleSheet, View, Switch } from 'react-native';
import { Button, Text, Divider } from 'react-native-paper';
import { ThemeContext } from '../context/ThemeContext';
import LogoutButton from '../components/LogoutButton';
import ChangePassword from '../components/ChangePassword';

export default function SettingScreen() {
    const { isDarkMode, setIsDarkMode } = useContext(ThemeContext);
    const [isChangePasswordVisible, setIsChangePasswordVisible] = useState(false); // Correct state declaration

    // Dynamically set styles based on dark mode
    const dynamicStyles = isDarkMode ? darkStyles : lightStyles;

    return (
        <View style={[styles.container, dynamicStyles.container]}>
            {/* Account Settings */}
            <Text variant="titleLarge" style={[styles.sectionTitle, dynamicStyles.text]}>(Under development)</Text>
            <Text variant="titleLarge" style={[styles.sectionTitle, dynamicStyles.text]}>Account</Text>
            <View style={styles.buttonContainer}>
                <LogoutButton />
                <Button
                    mode="contained"
                    onPress={() => { /* Navigate to Edit Profile */ }}
                    style={styles.button}
                >
                    Edit Profile
                </Button>
                <Button
                    mode="contained"
                    onPress={() => setIsChangePasswordVisible(true)} // Correctly set the state to show the modal
                    style={styles.button}
                >
                    Change Password
                </Button>
            </View>

            <Divider style={[styles.divider, dynamicStyles.divider]} />

            {/* Notification Settings */}
            <Text variant="titleLarge" style={[styles.sectionTitle, dynamicStyles.text]}>Notifications</Text>
            <View style={styles.settingItem}>
                <Text style={[styles.settingText, dynamicStyles.text]}>Activity Reminders</Text>
                <Switch value={true} onValueChange={() => { }} />
            </View>
            <View style={styles.settingItem}>
                <Text style={[styles.settingText, dynamicStyles.text]}>Push Notifications</Text>
                <Switch value={true} onValueChange={() => { }} />
            </View>

            <Divider style={[styles.divider, dynamicStyles.divider]} />

            {/* Theme and Display */}
            <Text variant="titleLarge" style={[styles.sectionTitle, dynamicStyles.text]}>Display</Text>
            <View style={styles.settingItem}>
                <Text style={[styles.settingText, dynamicStyles.text]}>Dark Mode</Text>
                <Switch
                    value={isDarkMode}
                    onValueChange={() => setIsDarkMode(!isDarkMode)}
                />
            </View>

            {/* Change Password Modal */}
            <ChangePassword
                visible={isChangePasswordVisible} // Pass the visibility state to the component
                onClose={() => setIsChangePasswordVisible(false)} // Close the modal by setting the state to false
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        padding: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 20,
        marginBottom: 10,
        textAlign: 'center',
    },
    buttonContainer: {
        marginVertical: 10,
        width: '100%',
        alignItems: 'center',
    },
    button: {
        marginVertical: 5,
        width: '60%',
    },
    settingItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
        width: '100%',
    },
    settingText: {
        fontSize: 16,
        flex: 1,
        textAlign: 'left',
    },
    divider: {
        width: '100%',
        marginVertical: 15,
    },
});

const lightStyles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
    },
    text: {
        color: '#000',
    },
    divider: {
        backgroundColor: '#ccc',
    },
});

const darkStyles = StyleSheet.create({
    container: {
        backgroundColor: '#121212',
    },
    text: {
        color: '#fff',
    },
    divider: {
        backgroundColor: '#444',
    },
});
