import { StyleSheet, Text, View } from 'react-native';
import React, { useState } from 'react';
import { Calendar } from 'react-native-calendars';
import { Button, Card } from 'react-native-paper';

export default function CalendarComponent() {
    const [selectedDate, setSelectedDate] = useState('');
    return (
        <View style={styles.container}>
            <Text style={styles.header}>Select a Date</Text>
            {/* Card wrapper for calendar */}
            <Card style={styles.card}>
                <Card.Content>
                    <Calendar
                        onDayPress={(day) => {
                            setSelectedDate(day.dateString);
                            console.log("Selected date:", day.dateString);
                        }}
                        markedDates={{
                            [selectedDate]: { selected: true, marked: true, selectedColor: 'blue' },
                        }}
                        monthFormat={'yyyy MM'}
                    // You can add other Calendar props here
                    />
                </Card.Content>
            </Card>
            {/* Display the selected date */}
            {selectedDate ? (
                <Text style={styles.selectedText}>Selected Date: {selectedDate}</Text>
            ) : (
                <Text style={styles.selectedText}>No date selected</Text>
            )}

            {/* Button to reset the selected date */}
            <Button mode="contained" onPress={() => setSelectedDate('')} style={styles.resetButton}>
                Clear Selection
            </Button>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    header: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 16,
    },
    card: {
        width: '100%',
        marginBottom: 20,
        elevation: 4,  // Add shadow effect
    },
    selectedText: {
        textAlign: 'center',
        marginTop: 16,
        fontSize: 16,
    },
    resetButton: {
        marginTop: 20,
        width: '80%',
    },
});