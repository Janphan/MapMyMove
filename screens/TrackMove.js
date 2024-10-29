import { StyleSheet, Text, View, Button, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import MyMap from '../components/MyMap';
import { useNavigation } from '@react-navigation/native';

const LOCATION_TASK_NAME = 'background-location-task';

export default function TrackMove() {
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
    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('No permission to get location')
                return;
            }
            let location = await Location.getCurrentPositionAsync({});
            setCurrentLocation(location);
            const { latitude, longitude } = location.coords;
            setRegion({
                latitude: latitude,
                longitude: longitude,
                latitudeDelta: 0.0322,
                longitudeDelta: 0.0221,
            });
            setMarker({
                latitude: latitude,
                longitude: longitude,
                title: 'Current Location',
                color: '#3498db',
            });
        })();
    }, []);
    // Start tracking
    const startTracking = async () => {
        setIsTracking(true);
        setElapsedTime(0);
        setLocations([]); // Reset locations
        setTimer(setInterval(() => {
            setElapsedTime((prevTime) => prevTime + 1); // Increment every second
        }, 1000));

        // Start location updates
        await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
            accuracy: Location.Accuracy.High,
            distanceInterval: 1, // Update on movement
            timeInterval: 1000, // Update every second
        });

        // Listen for location updates
        Location.startWatchPositionAsync(LOCATION_TASK_NAME, (newLocation) => {
            const { latitude, longitude } = newLocation.coords;
            // Log the new location coordinates
            console.log(`New Location - Latitude: ${latitude}, Longitude: ${longitude}`);
            setLocations((prevLocations) => [
                ...prevLocations,
                { latitude, longitude }
            ]);
            setMarker({ latitude, longitude, title: 'Current Location', color: '#3498db' });
            setRegion({ latitude, longitude, latitudeDelta: 0.0322, longitudeDelta: 0.0221 });
        });
    };

    // Stop tracking
    const stopTracking = async () => {
        setIsTracking(false);
        clearInterval(timer);
        await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME); // Stop observing position updates
    };

    // Cleanup function
    useEffect(() => {
        return () => {
            if (isTracking) {
                stopTracking(); // Ensure to stop tracking if component unmounts
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
                        navigation.navigate('TrackList');
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