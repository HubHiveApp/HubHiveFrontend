import ApiInteraction from '@/ApiInteraction';
import ScreenContainer from '@/components/ScreenContainer';
import { useAccessToken } from '@/context/AuthContext';
import { useLocationContext } from '@/context/LocationContext';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity } from 'react-native';

export default function CreateEventScreen({ navigation }) {
  const { accessToken } = useAccessToken();
  const { coordinates } = useLocationContext(); // (["name", lat, lng])

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [eventDate, setEventDate] = useState(new Date());

  const handleCreate = async () => {
    // --- basic safety checks --- // 
    if (!accessToken) {
      Alert.alert('Error', 'You must be logged in to create an event.');
      return;
    }

    if (!title || !eventDate) {
      Alert.alert('Missing fields', 'Title and date are required.');
      return;
    }

    try {
      // Build location object from LocationContext (if available)
      const location =
        coordinates && coordinates.length === 3
          ? {
            name: coordinates[0],
            latitude: coordinates[1],
            longitude: coordinates[2],
          }
          : undefined;

      const newEvent = await ApiInteraction.create_event(accessToken, {
        title,
        description,
        event_date: eventDate.toISOString(),   // must be ISO format
        location,                // (JSON field used by backend)
        is_public: true,         // (so it shows up in /api/events)
      });

      Alert.alert('Success', 'Event created successfully!');
      navigation.goBack();
    } catch (err) {
      console.error(err);
      Alert.alert('Error', err.message || 'Failed to create event');
    }
  };

  return (
    <ScreenContainer>
      <ScrollView style={styles.form}>
        <Text style={styles.label}>Title *</Text>

        <TextInput
          style={styles.input}
          placeholder="Title"
          placeholderTextColor="#6b7280"
          onChangeText={setTitle}
        />

        <Text style={styles.label}>Description</Text>
        <TextInput
          style={styles.input}
          placeholder="Description"
          placeholderTextColor="#6b7280"
          onChangeText={setDescription}
        />

        <Text style={styles.label}>Event Date *</Text>

        <DateTimePicker
          value={eventDate}
          mode='datetime'
          onChange={(event, selectedDate) => {
            if (selectedDate) {
              setEventDate(selectedDate);
            }
          }}
          minimumDate={new Date()}
          themeVariant='dark'
          style={{marginHorizontal: -8}}
        />

        <TouchableOpacity style={styles.button} onPress={handleCreate}>
          <Text style={styles.buttonText}>Publish Event</Text>
        </TouchableOpacity>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: '#111827',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: '#e5e7eb',
    borderWidth: 1,
    borderColor: '#1f2937',
    fontSize: 16
  },
  form: {
    flex: 1,
  },
  label: {
    color: '#e5e7eb',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 16
  },
  button: {
    backgroundColor: '#2563eb',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
  },
  buttonText: {
    color: 'white',
    fontWeight: '700',
  },
});
