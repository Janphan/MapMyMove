import { StyleSheet, Text, View } from 'react-native';
import React, { useState } from 'react';
import { Calendar } from 'react-native-calendars';

export default function CalendarComponent() {
    const [selectedDate, setSelectedDate] = useState('');
    return (
        <View style={styles.container}>
            <Text style={styles.header}>Select a Date</Text>
            <Calendar
                onDayPress={(day) => {
                    setSelectedDate(day.dateString);
                    console.log("Selected date:", day.dateString);
                }}
                markedDates={{
                    [selectedDate]: { selected: true, marked: true, selectedColor: 'blue' },
                }}
            />
            <Text style={styles.selectedText}>Selected Date: {selectedDate}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    }, header: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 16,
    },
    selectedText: {
        textAlign: 'center',
        marginTop: 16,
        fontSize: 16,
    },
});