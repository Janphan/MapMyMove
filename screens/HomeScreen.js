import React, { useEffect, useState, useContext } from 'react';
import { View, StyleSheet, FlatList, ImageBackground, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { auth } from '../firebaseConfig';
import { PaperProvider, Button, Text } from 'react-native-paper';
import { logout } from '../services/authService';
import { ThemeContext } from '../context/ThemeContext';
import { doc, getDoc } from 'firebase/firestore'; // Import Firestore functions
import { db } from '../firebaseConfig'; // Firestore instance

const activities = [
    { id: '1', type: 'Run', date: '2024-10-26', distance: '5 km', duration: "1 hour" },  // Example for yesterday
    { id: '2', type: 'Walk', date: '2024-10-25', distance: '3 km', duration: "45 minutes" },  // Example for the day before
];

const HomeScreen = () => {
    const navigation = useNavigation();
    const { isDarkMode } = useContext(ThemeContext); // Access dark mode state
    const dynamicStyles = isDarkMode ? darkStyles : lightStyles;
    const [user, setUser] = useState(null);
    const [username, setUsername] = useState('');

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((authUser) => {
            setUser(authUser);
            if (authUser) {
                const userRef = doc(db, 'users', authUser.uid); // Reference to the user's document
                getDoc(userRef).then((docSnap) => {
                    if (docSnap.exists()) {
                        setUsername(docSnap.data().displayName); // Set the username from Firestore
                    } else {
                        console.log('No such document!');
                    }
                }).catch((error) => {
                    console.error('Error fetching user data:', error);
                });
            }
        });

        return () => unsubscribe();
    }, []);

    const handleLogout = async () => {
        try {
            await logout();  // Use the logout function here
            Alert.alert('Logged Out', 'You have been logged out successfully.');
            navigation.navigate('Login');
        } catch (error) {
            Alert.alert('Logout Failed', 'An error occurred while logging out.');
        }
    };

    const renderActivityItem = ({ item }) => (
        <View style={[styles.activityItem, dynamicStyles.activityItem]}>
            <Text style={dynamicStyles.text}>{item.type}</Text>
            <Text style={dynamicStyles.text}>Date: {item.date}</Text>
            <Text style={dynamicStyles.text}>Distance: {item.distance}</Text>
            <Text style={dynamicStyles.text}>Duration: {item.duration}</Text>
        </View>
    );

    return (
        <PaperProvider>
            <ImageBackground
                source={{ uri: "https://img.goodfon.com/wallpaper/big/5/22/sneakers-outdoors-running-jogging.webp" }}
                style={[styles.background, dynamicStyles.background]}
            >
                <View style={[styles.container, dynamicStyles.container]}>
                    {/* Greeting Message */}
                    <Text style={[styles.greeting, dynamicStyles.text]}>Welcome {username}!</Text>

                    {/* Activities Section */}
                    <Text style={[styles.subtitle, dynamicStyles.text]}>Yesterday's Activities</Text>
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
        paddingTop: 50,
        resizeMode: 'cover',    // Cover the entire screen  
    },
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderRadius: 10,
        margin: 10,
        paddingTop: 50,
        paddingBottom: 50,
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

const lightStyles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
    },
    text: {
        color: '#000',
    },
    background: {
        opacity: 1,
    },
});

const darkStyles = StyleSheet.create({
    container: {
        backgroundColor: '#121212',
    },
    text: {
        color: '#fff',
    },
    background: {
        opacity: 0.8,
    },
    activityItem: {
        backgroundColor: '#1e1e1e', // Darker background for better contrast
    },
});

export default HomeScreen;
