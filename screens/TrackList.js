//track list
import { StyleSheet, Text, View, FlatList, Button, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import MyMap from '../components/MyMap';
import { useNavigation } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';
import { getFirestore, collection, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { app } from '../firebaseConfig';

export default function TrackList() {
    const navigation = useNavigation();
    const route = useRoute();
    const [tracks, setTracks] = useState([]);
    const db = getFirestore(app);

    useEffect(() => {
        const tracksRef = collection(db, 'tracks');

        // Real-time listener for the 'tracks' collection
        const unsubscribe = onSnapshot(tracksRef, (snapshot) => {
            const fetchedTracks = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setTracks(fetchedTracks);
        });

        // Clean up the listener on component unmount
        return () => unsubscribe();
    }, []);
    // Function to delete a track
    const deleteTrack = async (trackId) => {
        try {
            await deleteDoc(doc(db, 'tracks', trackId));
            Alert.alert("Track deleted successfully");
        } catch (error) {
            console.error("Error deleting track:", error);
            Alert.alert("Error", "Could not delete the track. Please try again.");
        }
    };
    // Render each track with a delete button
    const renderTrackItem = ({ item }) => (
        <View style={styles.trackItem}>
            <Text style={styles.trackText}>{item.date} - Duration: {item.duration}s</Text>
            <Button
                title="Delete"
                color="red"
                onPress={() => deleteTrack(item.id)}
            />
        </View>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={tracks}
                keyExtractor={(item) => item.id}
                renderItem={renderTrackItem}
            />
            <Button title="Go Back to Track Move" onPress={() => navigation.goBack()} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});