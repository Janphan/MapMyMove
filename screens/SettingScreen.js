import { StyleSheet, Text, View, Switch, Button } from 'react-native';

export default function SettingScreen() {
    return (
        <View style={styles.container}>
            {/* Account Settings */}
            <Text style={styles.sectionTitle}>Account</Text>
            <Button title="Edit Profile" onPress={() => {/* Navigate to Edit Profile */ }} />
            <Button title="Change Password" onPress={() => {/* Navigate to Change Password */ }} />
            {/* Notification Settings */}
            <Text style={styles.sectionTitle}>Notifications</Text>
            <View style={styles.settingItem}>
                <Text>Activity Reminders</Text>
                <Switch value={true} onValueChange={() => { }} />
            </View>
            <View style={styles.settingItem}>
                <Text>Push Notifications</Text>
                <Switch value={true} onValueChange={() => { }} />
            </View>

            {/* Theme and Display */}
            <Text style={styles.sectionTitle}>Display</Text>
            <Button title="Dark Mode" onPress={() => {/* Toggle Dark Mode */ }} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        fontSize: 20,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 20,
    },
    settingItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
    },
});
