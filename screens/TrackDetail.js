import React, { useMemo } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Text, Button, PaperProvider } from 'react-native-paper';
import MapView, { Polyline } from 'react-native-maps';
import { calculateTotalDistance } from '../utils/distanceUtils';

function getBoundingRegion(points, padding = 0.002) {
    if (!points || points.length === 0) return null;
    let minLat = points[0].latitude, maxLat = points[0].latitude;
    let minLng = points[0].longitude, maxLng = points[0].longitude;
    points.forEach(p => {
        minLat = Math.min(minLat, p.latitude);
        maxLat = Math.max(maxLat, p.latitude);
        minLng = Math.min(minLng, p.longitude);
        maxLng = Math.max(maxLng, p.longitude);
    });
    const latitude = (minLat + maxLat) / 2;
    const longitude = (minLng + maxLng) / 2;
    const latitudeDelta = (maxLat - minLat) + padding;
    const longitudeDelta = (maxLng - minLng) + padding;
    return { latitude, longitude, latitudeDelta, longitudeDelta };
}

export default function TrackDetail({ route, navigation }) {
    const { track } = route.params;

    // Calculate region to fit polyline
    const region = useMemo(
        () => getBoundingRegion(track.locations),
        [track.locations]
    );

    return (
        <PaperProvider>
            <View style={styles.container}>
                <Text style={styles.title}>Track Detail</Text>
                {region && (
                    <MapView
                        style={styles.polylineMap}
                        region={region}
                        scrollEnabled={false}
                        zoomEnabled={false}
                        rotateEnabled={false}
                        pitchEnabled={false}
                        toolbarEnabled={false}
                        showsUserLocation={false}
                        showsMyLocationButton={false}
                    >
                        {track.locations.length > 1 && (
                            <Polyline
                                coordinates={track.locations}
                                strokeColor="#3498db"
                                strokeWidth={8}
                            />
                        )}
                    </MapView>
                )}
                <View style={styles.detailsCard}>
                    <DetailRow label="Type" value={track.type} />
                    <DetailRow
                        label="Date"
                        value={
                            track.date?.seconds
                                ? new Date(track.date.seconds * 1000).toLocaleString('en-GB')
                                : new Date(track.date).toLocaleString('en-GB')
                        }
                    />
                    <DetailRow label="Duration" value={`${track.duration} seconds`} />
                    <DetailRow
                        label="Distance"
                        value={
                            track.locations
                                ? `${calculateTotalDistance(track.locations)} km`
                                : 'N/A'
                        }
                    />
                </View>
                <Button mode="contained" onPress={() => navigation.goBack()} style={{ marginTop: 30 }}>
                    Back
                </Button>
            </View>
        </PaperProvider>
    );
}

// Helper component for detail rows
function DetailRow({ label, value }) {
    return (
        <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>{label}:</Text>
            <Text style={styles.detailValue}>{value}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f7f7f7',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 18,
        marginTop: 36,
        textAlign: 'center',
        color: '#222',
        letterSpacing: 1,
    },
    polylineMap: {
        width: Dimensions.get('window').width - 40,
        height: 260,
        marginBottom: 24,
        borderRadius: 16,
        overflow: 'hidden',
        alignSelf: 'center',
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    detailsCard: {
        backgroundColor: '#fff',
        borderRadius: 14,
        padding: 20,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
        marginBottom: 12,
    },
    detailLabel: {
        fontWeight: 'bold',
        color: '#555',
        fontSize: 16,
    },
    detailValue: {
        color: '#222',
        fontSize: 16,
        flexShrink: 1,
        textAlign: 'right',
    },
});