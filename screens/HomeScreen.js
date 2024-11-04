import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { auth } from '../firebaseConfig';
import { PaperProvider } from 'react-native-paper';
import { Button, TextInput, Text } from 'react-native-paper';
import { useTheme } from 'react-native-paper';

const activities = [
    { id: '1', type: 'Run', date: '2024-10-26', distance: '5 km' },  // Example for yesterday
    { id: '2', type: 'Walk', date: '2024-10-25', distance: '3 km' },  // Example for the day before
];

const HomeScreen = () => {
    const navigation = useNavigation();
    const [yesterdaysActivities, setYesterdaysActivities] = useState([]);
    // const username = auth.currentUser?.displayName || 'User';

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((authUser) => {
            setUser(authUser);
        });

        return () => unsubscribe();
    }, []);

    const handleLogout = () => {
        auth.signOut().then(() => {
            console.log("User logged out");
            navigation.navigate('AuthStack', { screen: 'Login' })
        }).catch((error) => {
            console.error("Error logging out:", error)
        })
    }
    return (
        <ImageBackground
            source={{ uri: "https://img.goodfon.com/wallpaper/big/5/22/sneakers-outdoors-running-jogging.webp" }}
            style={styles.background}
        >
            <View style={styles.container}>
                {/* Greeting Message */}
                <Text style={styles.greeting}>Welcome!</Text>

                <Text style={styles.subtitle}>Yesterday's Activities</Text>
                {/* <FlatList
                    data={yesterdaysActivities}
                    renderItem={renderActivityItem}
                    keyExtractor={item => item.id}
                    style={styles.activityList}
                /> */}

                <Button mode="contained" icon="play-circle-outline" onPress={() => navigation.navigate('Start')} >Start</Button>
                {/* Logout Button */}
                <Button title="Log Out" onPress={handleLogout} color="red" />
            </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    background: {
        flex: 1, // Ensure background image covers the entire screen
        justifyContent: 'center', // Center content
        alignItems: 'center', // Align content to center
    },
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.8)', // Optional: semi-transparent background for better text visibility
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
});

export default HomeScreen;
