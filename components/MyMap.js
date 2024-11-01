import MapView, { Marker } from 'react-native-maps';
import { StyleSheet, View, Text } from 'react-native';
import { useState } from 'react';
export default function MyMap({ region, marker }) {
    return (
        <MapView
            style={styles.map}
            region={region}
            showsUserLocation={true}
            followsUserLocation={true}  // Follow user location in iOS only
            userLocationUpdateInterval={1000}  // Follow user location in Android only
        >
            {marker && (
                <Marker
                    coordinate={{
                        latitude: marker.latitude,
                        longitude: marker.longitude,

                    }}
                    title={marker.title}
                    pinColor={marker.color}
                />
            )}
        </MapView>
    )
}
const styles = StyleSheet.create({
    map: {
        width: '100%',
        height: '100%',
    },
});