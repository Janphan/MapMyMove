import { StyleSheet, View, FlatList, Alert, Keyboard, TouchableOpacity } from 'react-native';
import { Button, Text, PaperProvider, TextInput } from 'react-native-paper';
import { useState, useEffect, useContext } from 'react';
import { useNavigation } from '@react-navigation/native';
import { getFirestore, collection, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { app } from '../firebaseConfig';
import { ThemeContext } from '../context/ThemeContext';
import { calculateTotalDistance } from '../utils/distanceUtils'; // Assuming you have a utility function to calculate distance

export default function TrackList() {
    const navigation = useNavigation();
    const [tracks, setTracks] = useState([]);
    const [filteredTracks, setFilteredTracks] = useState([]);
    const [filterDate, setFilterDate] = useState('');
    const [filterDuration, setFilterDuration] = useState('');
    const db = getFirestore(app);
    const { isDarkMode } = useContext(ThemeContext);
    const dynamicStyles = isDarkMode ? darkStyles : lightStyles;

    useEffect(() => {
        const tracksRef = collection(db, 'tracks');

        // Real-time listener for the 'tracks' collection
        const unsubscribe = onSnapshot(tracksRef, (snapshot) => {
            const fetchedTracks = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            fetchedTracks.sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort by newest date first
            setTracks(fetchedTracks); // Set all tracks
            setFilteredTracks(fetchedTracks); // Initially, show all tracks
        });

        // Clean up the listener on component unmount
        return () => unsubscribe();
    }, []);

    // Function to delete a track
    const deleteTrack = async (trackId) => {
        Alert.alert(
            "Confirm Deletion",
            "Are you sure you want to delete this track?",
            [
                {
                    text: "Cancel",
                    style: "cancel", // Dismiss the alert
                },
                {
                    text: "Delete",
                    style: "destructive", // Highlight the delete action
                    onPress: async () => {
                        try {
                            await deleteDoc(doc(db, 'tracks', trackId));
                            Alert.alert("Track deleted successfully");
                        } catch (error) {
                            console.error("Error deleting track:", error);
                            Alert.alert("Error", "Could not delete the track. Please try again.");
                        }
                    },
                },
            ],
            { cancelable: true } // Allow dismissal by tapping outside the alert
        );
    };

    // Filter tracks based on date or duration
    const applyFilter = () => {
        const filtered = tracks.filter((track) => {
            const matchesDate = filterDate ? track.date === filterDate : true;
            const matchesDuration = filterDuration
                ? track.duration <= parseInt(filterDuration, 10)
                : true;
            return matchesDate && matchesDuration;
        });
        setFilteredTracks(filtered);
        Keyboard.dismiss();
    };

    const renderTrackItem = ({ item }) => {
        return (
            <TouchableOpacity onPress={() => navigation.navigate('TrackDetail', { track: item })}>
                <View style={styles.trackItem}>
                    <View style={styles.trackInfoContainer}>
                        <Text style={styles.trackText}>Type: {item.type || 'N/A'}</Text>
                        <Text style={styles.trackText}>
                            Date: {item.date
                                ? (item.date.seconds
                                    ? new Date(item.date.seconds * 1000).toLocaleDateString('en-GB')
                                    : new Date(item.date).toLocaleDateString('en-GB'))
                                : 'N/A'}
                        </Text>
                        <Text style={styles.trackText}>Duration: {item.duration || 'N/A'} seconds</Text>
                        <Text style={styles.trackText}>
                            Distance: {item.locations ? `${calculateTotalDistance(item.locations)} km` : 'N/A'}
                        </Text>
                    </View>
                    <View style={styles.deleteButtonContainer}>
                        <Button
                            mode="contained"
                            onPress={() => deleteTrack(item.id)}
                            style={styles.deleteButton}
                        >
                            Delete
                        </Button>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <PaperProvider>
            <View style={[styles.filterContainer, dynamicStyles.container]}>
                {/* Filter Inputs in Row */}
                <TextInput
                    label="Filter by Date"
                    value={filterDate}
                    onChangeText={(text) => setFilterDate(text)}
                    style={[styles.filterInput, styles.dateInput]}
                    placeholder="DD/MM/YYYY"
                />
                <TextInput
                    label="Max Duration"
                    value={filterDuration}
                    onChangeText={(text) => setFilterDuration(text)}
                    keyboardType="numeric"
                    style={[styles.filterInput, styles.durationInput]}
                    placeholder="Max Seconds"
                />
            </View>

            {/* Apply Filter Button */}
            <Button mode="contained" onPress={applyFilter} style={styles.filterButton}>
                Apply Filter
            </Button>

            <View style={[styles.container, dynamicStyles.container]}>
                {/* Track List */}
                {filteredTracks.length === 0 ? (
                    <Text style={[styles.noTracksText, dynamicStyles.text]}>No tracks found</Text>
                ) : (
                    <FlatList
                        data={filteredTracks}
                        keyExtractor={(item) => item.id}
                        renderItem={renderTrackItem}
                        contentContainerStyle={styles.listContent}
                    />
                )}
                <Button
                    mode="contained"
                    onPress={() => navigation.goBack()}
                    style={styles.backButton}
                >
                    Go Back to Track Move
                </Button>
            </View>
        </PaperProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
        alignItems: 'center',
    },
    filterContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 20,
        paddingHorizontal: 20,
        marginTop: 20,
        paddingTop: 40,
    },
    filterInput: {
        width: '45%', // Make each input 45% of the width
        marginVertical: 5,
    },
    dateInput: {
        marginRight: 10, // Add space between the inputs
    },
    durationInput: {
        marginLeft: 10, // Add space between the inputs
    },
    filterButton: {
        width: '90%', // Use 90% width for the button
        marginTop: 10,
        alignSelf: 'center', // Center the button horizontally
    },
    listContent: {
        width: '100%',
        paddingBottom: 20,
    },
    trackItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        backgroundColor: '#f8f8f8',
        borderRadius: 8,
        marginVertical: 8,
        width: '100%',
        elevation: 2,
    },
    trackText: {
        fontSize: 16,
        flex: 1,
        marginRight: 10,
    },
    deleteButton: {
        marginLeft: 10,
    },
    backButton: {
        marginTop: 20,
        width: '75%',
    },
    noTracksText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#555',
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
});
