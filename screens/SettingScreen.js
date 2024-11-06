import { StyleSheet, View, Switch } from 'react-native';
import { Button, Text, Divider } from 'react-native-paper';
import React from 'react';

export default function SettingScreen() {
    return (
        <View style={styles.container}>
            {/* Account Settings */}
            <Text variant="titleLarge" style={styles.sectionTitle}>(Under development)</Text>
            <Text variant="titleLarge" style={styles.sectionTitle}>Account</Text>
            <View style={styles.buttonContainer}>
                <Button
                    mode="contained"
                    onPress={() => { /* Navigate to Edit Profile */ }}
                    style={styles.button}
                >
                    Edit Profile
                </Button>
                <Button
                    mode="contained"
                    onPress={() => { /* Navigate to Change Password */ }}
                    style={styles.button}
                >
                    Change Password
                </Button>
            </View>

            <Divider style={styles.divider} />

            {/* Notification Settings */}
            <Text variant="titleLarge" style={styles.sectionTitle}>Notifications</Text>
            <View style={styles.settingItem}>
                <Text style={styles.settingText}>Activity Reminders</Text>
                <Switch value={true} onValueChange={() => { }} />
            </View>
            <View style={styles.settingItem}>
                <Text style={styles.settingText}>Push Notifications</Text>
                <Switch value={true} onValueChange={() => { }} />
            </View>

            <Divider style={styles.divider} />

            {/* Theme and Display */}
            <Text variant="titleLarge" style={styles.sectionTitle}>Display</Text>
            <Button
                mode="contained"
                onPress={() => { /* Toggle Dark Mode */ }}
                style={styles.button}
            >
                Dark Mode
            </Button>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
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
