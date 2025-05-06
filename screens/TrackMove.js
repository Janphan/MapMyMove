import { StyleSheet, View, Alert, Keyboard } from 'react-native';
import { Button, Text, PaperProvider, TextInput, Menu } from 'react-native-paper';
import { useState, useEffect, useContext } from 'react';
import MyMap from '../components/MyMap';
import { useNavigation } from '@react-navigation/native';
import { getFirestore, collection, addDoc, Timestamp } from 'firebase/firestore';
import { app } from '../firebaseConfig';
import * as Location from 'expo-location';
import { ThemeContext } from '../context/ThemeContext';

export default function TrackMove() {
    const db = getFirestore(app);
    const navigation = useNavigation();
    const [marker, setMarker] = useState(null);
    const [region, setRegion] = useState({
        latitude: 60.200692,
        longitude: 24.934302,
        latitudeDelta: 0.0322,
        longitudeDelta: 0.0221,
    });
    const [currentLocation, setCurrentLocation] = useState(null);
    const [locations, setLocations] = useState([]);
    const [isTracking, setIsTracking] = useState(false);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [timer, setTimer] = useState(null);
    const { isDarkMode } = useContext(ThemeContext);
    const dynamicStyles = isDarkMode ? darkStyles : lightStyles;
    const [menuVisible, setMenuVisible] = useState(true);
    const [selectedType, setSelectedType] = useState(null);

    //format date
    const formatDate = (date) => {
        return new Intl.DateTimeFormat('en-GB', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        }).format(date);
    };

    // Start tracking
    const startTracking = async (type) => {
        setSelectedType(type); // Set the selected type
        setIsTracking(true);
        setLocations([]);
        setTimer(setInterval(() => {
            setElapsedTime((prevTime) => prevTime + 1);
        }, 1000));

        try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission not granted to access location');
                return;
            }
            await Location.watchPositionAsync(
                {
                    accuracy: Location.Accuracy.High,
                    distanceInterval: 1,
                },
                (newLocation) => {
                    const { latitude, longitude } = newLocation.coords;
                    setLocations((prevLocations) => [
                        ...prevLocations,
                        { latitude, longitude },
                    ]);
                    setMarker({ latitude, longitude, title: 'Current Location', color: '#3498db' });
                    setRegion({ latitude, longitude, latitudeDelta: 0.0322, longitudeDelta: 0.0221 });
                }
            );
        } catch (error) {
            console.error('Error starting location tracking:', error);
        }
    };

    // Stop tracking
    const stopTracking = async () => {
        setIsTracking(false);
        if (timer) {
            clearInterval(timer);
            setTimer(null);
        }

        const newTrack = {
            type: selectedType,
            date: new Date().toISOString(), // Save as ISO string instead of Firestore Timestamp
            duration: elapsedTime,
            locations,
        };
        console.log("new track", newTrack)

        try {
            await addDoc(collection(db, 'tracks'), newTrack);
            console.log("Track saved to Firebase Firestore");
        } catch (error) {
            console.error("Error saving track:", error);
            Alert.alert('Error', 'Could not save tracking data. Please try again.');
        }
        setElapsedTime(0); // Reset timer for next session
        setLocations([]);
        navigation.navigate('TrackList'); // Navigate to TrackList screen
    };

    useEffect(() => {
        (async () => {
            const { status: foregroundStatus } = await Location.requestForegroundPermissionsAsync();
            if (foregroundStatus !== 'granted') {
                Alert.alert('No permission to get location');
                return;
            }
            const location = await Location.getCurrentPositionAsync({});
            setCurrentLocation(location);
            const { latitude, longitude } = location.coords;
            setRegion({ latitude, longitude, latitudeDelta: 0.0322, longitudeDelta: 0.0221 });
            setMarker({ latitude, longitude, title: 'Current Location', color: '#3498db' });
        })();
    }, []);

    return (
        <PaperProvider>
            <View style={[styles.container, dynamicStyles.container]}>
                <Menu
                    visible={menuVisible}
                    onDismiss={() => setMenuVisible(false)}
                    anchor={
                        <Button mode="outlined" onPress={() => setMenuVisible(true)}>
                            {selectedType || 'Select Activity Type'}
                        </Button>
                    }
                >
                    <Menu.Item
                        onPress={() => {
                            setMenuVisible(false);
                            startTracking('Run'); // Start tracking with "Run"
                        }}
                        title="Run"
                    />
                    <Menu.Item
                        onPress={() => {
                            setMenuVisible(false);
                            startTracking('Walk'); // Start tracking with "Walk"
                        }}
                        title="Walk"
                    />
                    <Menu.Item
                        onPress={() => {
                            setMenuVisible(false);
                            startTracking('Swim'); // Start tracking with "Swim"
                        }}
                        title="Swim"
                    />
                </Menu>
                <View style={styles.mapContainer}>
                    <MyMap region={region} marker={marker} locations={locations} />
                    <Text style={[styles.elapsedTimeText, dynamicStyles.elapsedTimeText]}>
                        Elapsed Time: {elapsedTime}s
                    </Text>
                    <Text>
                        Locations: {locations.length > 0 ? `${locations.length} points` : 'No locations'}
                    </Text>
                </View>

                <View style={styles.buttonContainer}>
                    <Button mode="contained" onPress={isTracking ? stopTracking : startTracking} style={styles.mainButton} disabled={!selectedType && !isTracking}>
                        {isTracking ? 'Stop Tracking' : 'Start Tracking'}
                    </Button>
                    <Button mode="contained" onPress={() => navigation.navigate('TrackList')} style={styles.secondaryButton}>
                        Go to Track List
                    </Button>
                </View>
            </View>
        </PaperProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    mapContainer: {
        flex: 8,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    mainButton: {
        width: '75%',
        marginTop: 10,
    },
    secondaryButton: {
        width: '75%',
        marginTop: 10,
    },
    elapsedTimeText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
        marginVertical: 10,
        textAlign: 'center',
    },
});

const lightStyles = StyleSheet.create({
    container: { backgroundColor: '#fff' },
    text: { color: '#000' },
});

const darkStyles = StyleSheet.create({
    container: { backgroundColor: '#121212' },
    text: { color: '#fff' },
    elapsedTimeText: {
        color: '#ffffff', // Set to white for visibility on black background
    },
});
