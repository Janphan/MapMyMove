import { StyleSheet, Text, View, Button, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import MyMap from '../components/MyMap';
import { useNavigation } from '@react-navigation/native';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { app } from '../firebaseConfig';
import * as Location from 'expo-location';

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
    const [elapsedTime, setElapsedTime] = useState(); // Time tracking
    const [timer, setTimer] = useState(null); // Timer reference
    // State where location is saved
    const [tracks, setTracks] = useState([]);

    //format date
    const formatDate = (date) => {
        return new Intl.DateTimeFormat('en-GB', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        }).format(date);
    };
    // Start tracking
    const startTracking = async () => {
        setIsTracking(true);
        setElapsedTime(0);
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
        } catch (error) {
            console.error("Error starting location tracking:", error);
        }
    };
    // stop tracking
    const stopTracking = async () => {
        setIsTracking(false);
        if (timer) {
            clearInterval(timer);
            setTimer(null);
        }

        const newTrack = {
            date: formatDate(new Date()),
            duration: elapsedTime,
            locations,
        };
        console.log("new track", newTrack)

        try {
            // await push(ref(database, 'tracks/'), newTrack);
            await addDoc(collection(db, 'tracks'), newTrack);
            setTracks((prevTracks) => [...prevTracks, newTrack]);
            console.log("Track saved to Firebase Realtime Database");
        } catch (error) {
            console.error("Error saving track to Firebase Realtime Database:", error);
            Alert.alert('Error', 'Could not save tracking data. Please try again.');
        }
        setElapsedTime(0); // Reset timer for next session
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
                <MyMap region={region} marker={marker} locations={locations} />
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