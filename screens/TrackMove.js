import { StyleSheet, Text, View, Button, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import MyMap from '../components/MyMap';
import { useNavigation } from '@react-navigation/native';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { app } from '../firebaseConfig';
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';

const LOCATION_TASK_NAME = 'background-location-task';
TaskManager.defineTask(LOCATION_TASK_NAME, ({ data, error }) => {
    if (error) {
        console.error("Background task error:", error);
        return;
    }
    if (data) {
        const { locations } = data;
        console.log("Received new locations:", locations);
    }
});

export default function TrackMove() {
    const db = getFirestore(app);
    const navigation = useNavigation();
    const [marker, setMarker] = useState(null);
    const [region, setRegion] = useState({
        latitude: 60.200692,
        longitude: 24.934302,
        latitudeDelta: 0.0322,
        longitudeDelta: 0.0221,
    })
    const [currentLocation, setCurrentLocation] = useState(null);
    const [locations, setLocations] = useState([]); // Store the locations for the route
    const [isTracking, setIsTracking] = useState(false); // Track if we are currently tracking
    const [elapsedTime, setElapsedTime] = useState(0); // Time tracking
    const [timer, setTimer] = useState(null); // Timer reference
    // State where location is saved
    const [tracks, setTracks] = useState([]);

    // Start tracking
    const startTracking = async () => {
        setIsTracking(true);
        setElapsedTime(0);
        setLocations([]);
        setTimer(setInterval(() => {
            setElapsedTime((prevTime) => prevTime + 1);
        }, 1000));

        try {
            await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
                accuracy: Location.Accuracy.High,
                distanceInterval: 1,
                timeInterval: 1000
            });
        } catch (error) {
            console.error("Error starting location tracking:", error);
        }

        Location.watchPositionAsync(
            {
                accuracy: Location.Accuracy.High,
                distanceInterval: 1,
            },
            (newLocation) => {
                const { latitude, longitude } = newLocation.coords;
                setLocations((prevLocations) => [
                    ...prevLocations,
                    { latitude, longitude }
                ]);
                setMarker({ latitude, longitude, title: 'Current Location', color: '#3498db' });
                setRegion({ latitude, longitude, latitudeDelta: 0.0322, longitudeDelta: 0.0221 });
            }
        );
    };
    useEffect(() => {
        (async () => {
            const { status: foregroundStatus } = await Location.requestForegroundPermissionsAsync();
            if (foregroundStatus !== 'granted') {
                Alert.alert('No permission to get location');
                return;
            }

            const { status: backgroundStatus } = await Location.requestBackgroundPermissionsAsync();
            if (backgroundStatus !== 'granted') {
                Alert.alert('No permission for background location');
                return;
            }

            const location = await Location.getCurrentPositionAsync({});
            setCurrentLocation(location);
            const { latitude, longitude } = location.coords;
            setRegion({ latitude, longitude, latitudeDelta: 0.0322, longitudeDelta: 0.0221 });
            setMarker({ latitude, longitude, title: 'Current Location', color: '#3498db' });
        })();
    }, []);
    const stopTracking = async () => {
        setIsTracking(false);
        clearInterval(timer);
        await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);

        const newTrack = {
            date: new Date().toLocaleDateString(),
            duration: elapsedTime,
            locations: locations,
        };

        try {
            // await push(ref(database, 'tracks/'), newTrack);
            await addDoc(collection(db, 'tracks'), newTrack);
            console.log("Track saved to Firebase Realtime Database");
        } catch (error) {
            console.error("Error saving track to Firebase Realtime Database:", error);
            Alert.alert('Error', 'Could not save tracking data. Please try again.');
        }
    };

    useEffect(() => {
        return () => {
            if (isTracking) {
                stopTracking();
            }
        };
    }, [isTracking]);

    return (
        <View style={styles.container}>
            <View style={styles.mapContainer}>
                <MyMap region={region} marker={marker} />
            </View>
            <View style={styles.buttonContainer}>
                {isTracking ? (
                    <Button title="Stop Tracking" onPress={stopTracking} />
                ) : (
                    <Button title="Start Tracking" onPress={startTracking} />
                )}
                <Text style={styles.timerText}>Time: {elapsedTime}s</Text>
                <Button
                    title="Go to Track List"
                    onPress={() => {
                        console.log("Navigating to TrackList...");
                        navigation.navigate('TrackList', { tracks });
                    }}
                />
            </View>
        </View>

    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    mapContainer: {
        flex: 8,  // 80% of the screen height
        width: '100%',
    },
    buttonContainer: {
        flex: 1,  // 20% of the screen height
        justifyContent: 'center',  // Center contents vertically
        alignItems: 'center',  // Center contents horizontally
        padding: 20,  // Add some padding
    },
    timerText: {
        fontSize: 15,
        marginVertical: 10,
        alignSelf: 'center',
    },
});