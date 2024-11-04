import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, ImageBackground, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { auth } from '../firebaseConfig';
import { PaperProvider, Button, Text } from 'react-native-paper';
import { logout } from '../services/authService';

const activities = [
    { id: '1', type: 'Run', date: '2024-10-26', distance: '5 km' },  // Example for yesterday
    { id: '2', type: 'Walk', date: '2024-10-25', distance: '3 km' },  // Example for the day before
];

const HomeScreen = () => {
    const navigation = useNavigation();
    const [yesterdaysActivities, setYesterdaysActivities] = useState([]);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((authUser) => {
            setUser(authUser);
        });

        return () => unsubscribe();
    }, []);

    const handleLogout = async () => {
        try {
            await logout();  // Use the logout function here
            Alert.alert('Logged Out', 'You have been logged out successfully.');
            navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }], // Reset the stack and navigate to Login
            });
        } catch (error) {
            Alert.alert('Logout Failed', 'An error occurred while logging out.');
        }
    };

    const renderActivityItem = ({ item }) => (
        <View style={styles.activityItem}>
            <Text>{item.type}</Text>
            <Text>Date: {item.date}</Text>
            <Text>Distance: {item.distance}</Text>
        </View>
    );

    return (
        <PaperProvider>
            <ImageBackground
                source={{ uri: "https://img.goodfon.com/wallpaper/big/5/22/sneakers-outdoors-running-jogging.webp" }}
                style={styles.background}
            >
                <View style={styles.container}>
                    {/* Greeting Message */}
                    <Text style={styles.greeting}>Welcome, {user?.displayName || 'User'}!</Text>

                    {/* Activities Section */}
                    <Text style={styles.subtitle}>Yesterday's Activities</Text>
                    <FlatList
                        data={activities}
                        renderItem={renderActivityItem}
                        keyExtractor={(item) => item.id}
                        style={styles.activityList}
                    />

                    {/* Start Button */}
                    <Button mode="contained" icon="play-circle-outline" onPress={() => navigation.navigate('Start')} style={styles.startButton}>
                        Start
                    </Button>

                    {/* Logout Button */}
                    <Button mode="contained" onPress={handleLogout} color="red" style={styles.logoutButton}>
                        Log Out
                    </Button>
                </View>
            </ImageBackground>
        </PaperProvider>
    );
};

const styles = StyleSheet.create({
    background: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderRadius: 10,
        margin: 10,
    },
    greeting: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    subtitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 20,
        marginBottom: 10,
    },
    activityItem: {
        padding: 15,
        marginVertical: 5,
        backgroundColor: '#f9f9f9',
        borderRadius: 5,
    },
    activityList: {
        marginTop: 10,
    },
    startButton: {
        marginVertical: 15,
    },
    logoutButton: {
        marginTop: 10,
    },
});

export default HomeScreen;
