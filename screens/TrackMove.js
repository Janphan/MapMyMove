import { StyleSheet, View, Alert, Keyboard } from 'react-native';
import { Button, Text, PaperProvider, TextInput, Menu } from 'react-native-paper';
import { useState, useEffect, useContext } from 'react';
import MyMap from '../components/MyMap';
import { useNavigation } from '@react-navigation/native';
import { getFirestore, collection, addDoc, Timestamp } from 'firebase/firestore';
import { app } from '../firebaseConfig';
import * as Location from 'expo-location';
import { ThemeContext } from '../context/ThemeContext';
import { Modal, TouchableOpacity } from 'react-native';

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
    const [selectedType, setSelectedType] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);

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
                {/* Activity Type Modal */}
                <Modal
                    visible={modalVisible}
                    transparent
                    animationType="slide"
                    onRequestClose={() => setModalVisible(false)}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <Text style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 20 }}>Select Activity Type</Text>
                            {['Run', 'Walk', 'Cycling'].map(type => (
                                <TouchableOpacity
                                    key={type}
                                    style={styles.typeOption}
                                    onPress={() => {
                                        setSelectedType(type);
                                        setModalVisible(false);
                                        startTracking(type); // Start tracking after selecting type
                                    }}
                                >
                                    <Text style={{ fontSize: 16 }}>{type}</Text>
                                </TouchableOpacity>
                            ))}
                            <Button onPress={() => setModalVisible(false)} style={{ marginTop: 20 }}>Cancel</Button>
                        </View>
                    </View>
                </Modal>

                {/* Button to open modal */}
                <Button mode="outlined" onPress={() => setModalVisible(true)} style={{ marginBottom: 10 }}>
                    {selectedType || 'Select Activity Type'}
                </Button>
                <View style={styles.mapContainer}>
                    <MyMap region={region} marker={marker} locations={locations} />
                    <Text style={[styles.elapsedTimeText, dynamicStyles.elapsedTimeText]}>
                        Elapsed Time: {elapsedTime}s
                    </Text>
                    {/* <Text>
                        Locations: {locations.length > 0 ? `${locations.length} points` : 'No locations'}
                    </Text> */}
                </View>

                <View style={styles.buttonContainer}>
                    <Button
                        mode="contained"
                        onPress={() => {
                            if (isTracking) {
                                stopTracking();
                            } else {
                                setModalVisible(true);
                            }
                        }}
                        style={styles.mainButton}
                    >
                        {isTracking ? 'Stop Tracking' : (selectedType ? `Start (${selectedType})` : 'Start Tracking')}
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
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 30,
        width: 250,
        alignItems: 'center',
    },
    typeOption: {
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        width: '100%',
        alignItems: 'center',
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
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 30,
        width: 250,
        alignItems: 'center',
    },
    typeOption: {
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        width: '100%',
        alignItems: 'center',
    },
});
