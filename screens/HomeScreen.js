import React, { useEffect, useState, useContext, use } from 'react';
import { View, StyleSheet, FlatList, ImageBackground, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { auth } from '../firebaseConfig';
import { PaperProvider, Button, Text } from 'react-native-paper';
import { logout } from '../services/authService';
import { ThemeContext } from '../context/ThemeContext';
import { collection, doc, getDoc, orderBy, getDocs, query, onSnapshot } from 'firebase/firestore'; // Import Firestore functions
import { db } from '../firebaseConfig'; // Firestore instance
import { calculateTotalDistance } from '../utils/distanceUtils';

const HomeScreen = () => {
    const navigation = useNavigation();
    const { isDarkMode } = useContext(ThemeContext); // Access dark mode state
    const dynamicStyles = isDarkMode ? darkStyles : lightStyles;
    const [user, setUser] = useState(null);
    const [username, setUsername] = useState('');
    const [activities, setActivities] = useState([]);


    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((authUser) => {
            setUser(authUser);
            if (authUser) {
                const userRef = doc(db, 'users', authUser.uid);
                getDoc(userRef).then((docSnap) => {
                    if (docSnap.exists()) {
                        setUsername(docSnap.data().displayName);
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

    useEffect(() => {
        const trackRef = collection(db, 'tracks');
        const trackQuery = query(trackRef, orderBy('date', 'desc'));

        // Real-time listener for the 'tracks' collection
        const unsubscribe = onSnapshot(trackQuery, (querySnapshot) => {
            const fetchedActivities = querySnapshot.docs.map((doc) => {
                const data = doc.data();
                return {
                    id: doc.id,
                    ...data,
                    date: data.date?.seconds
                        ? new Date(data.date.seconds * 1000).toLocaleString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
                        : (data.date ? new Date(data.date).toLocaleString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '')
                };
            });

            console.log('Fetched Activities (Real-Time):', fetchedActivities);
            setActivities(fetchedActivities);
        }, (error) => {
            console.error('Error fetching activities in real-time:', error);
            Alert.alert('Error', 'Failed to load activities.');
        });

        // Cleanup the listener when the component unmounts
        return () => unsubscribe();
    }, []);


    const renderActivityItem = ({ item }) => (
        <View style={[styles.activityItem, dynamicStyles.activityItem]}>
            <Text style={dynamicStyles.text}>Type: {item.type}</Text>
            <Text style={dynamicStyles.text}>Date: {item.date}</Text>
            <Text style={dynamicStyles.text}>
                Distance: {item.locations ? `${calculateTotalDistance(item.locations)} km` : 'N/A'}
            </Text>
            <Text style={dynamicStyles.text}>Duration: {item.duration || 'N/A'} seconds</Text>
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
                    <Text style={[styles.subtitle, dynamicStyles.text]}>Nearest's Activities</Text>
                    <FlatList
                        data={activities}
                        renderItem={renderActivityItem}
                        keyExtractor={(item) => item.id}
                        style={styles.activityList}
                    />
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
