import { StyleSheet, Text, View } from 'react-native';
import { useState, useEffect } from 'react';
import MyMap from '../components/MyMap';
export default function TrackMove() {
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
            <MyMap region={region} marker={marker} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});