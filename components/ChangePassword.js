import React, { useState } from 'react';
import { View, Alert, Modal, StyleSheet, TextInput } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { auth } from '../firebaseConfig';
import { updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';

const ChangePassword = ({ visible, onClose }) => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');

    const handleChangePassword = async () => {
        if (newPassword.length < 6) {
            Alert.alert('Error', 'Password must be at least 6 characters long.');
            return;
        }

        try {
            const user = auth.currentUser;
            if (!user) {
                Alert.alert('Error', 'No user is currently logged in.');
                return;
            }

            // Reauthenticate the user
            const credential = EmailAuthProvider.credential(user.email, currentPassword);
            await reauthenticateWithCredential(user, credential);

            // Update the password
            await updatePassword(user, newPassword);
            Alert.alert('Success', 'Password updated successfully!');
            onClose(); // Close the modal
        } catch (error) {
            console.error('Error changing password:', error.message);
            Alert.alert('Error', error.message || 'An error occurred while changing the password.');
        }
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Change Password</Text>
                    <TextInput
                        placeholder="Current Password"
                        placeholderTextColor={'#888'}
                        secureTextEntry
                        value={currentPassword}
                        onChangeText={setCurrentPassword}
                        style={styles.input}
                    />
                    <TextInput
                        placeholder="New Password"
                        placeholderTextColor={'#888'}
                        secureTextEntry
                        value={newPassword}
                        onChangeText={setNewPassword}
                        style={styles.input}
                    />
                    <Button mode="contained" onPress={handleChangePassword} style={styles.modalButton}>
                        Update Password
                    </Button>
                    <Button mode="text" onPress={onClose} style={styles.modalButton}>
                        Cancel
                    </Button>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '80%',
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        width: '100%',
        marginVertical: 10,
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
    },
    modalButton: {
        marginVertical: 10,
        width: '100%',
    },
});

export default ChangePassword;