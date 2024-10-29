import { StyleSheet, Text, View, Button, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import MyMap from '../components/MyMap';
import { useNavigation } from '@react-navigation/native';

export default function TrackMove() {
    const navigation = useNavigation();
    const [marker, setMarker] = useState(null);
    const [region, setRegion] = useState({
        latitude: 60.200692,
        longitude: 24.934302,
        latitudeDelta: 0.0322,
        longitudeDelta: 0.0221,
    })
    const [currentLocation, setCurentLocation] = useState(null);
    // State where location is saved
    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('No permission to get location')
                return;
            }
            let location = await Location.getCurrentPositionAsync({});
            setCurentLocation(location);
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
    return (
        <View style={styles.container}>
            <View style={styles.mapContainer}>
                <MyMap region={region} marker={marker} />
            </View>
            <View style={styles.buttonContainer}>
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
        flex: 12,  // 80% of the screen height
        width: '100%',
    },
    buttonContainer: {
        flex: 1,  // 20% of the screen height
        paddingBottom: 20,
        alignSelf: 'center',
        width: '80%',
    },
});