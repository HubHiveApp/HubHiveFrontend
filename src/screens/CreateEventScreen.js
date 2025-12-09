import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import ApiInteraction from '@/ApiInteraction';
import { useAccessToken, useUserContext } from '@/context/AuthContext';
import ScreenContainer from '@/components/ScreenContainer';
import Header from '@/components/Header';

export default function CreateEventScreen({ navigation }) {
  const { accessToken } = useAccessToken();
  const { user } = useUserContext();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [eventDate, setEventDate] = useState('');

  const handleCreate = async () => {
    try {
      const newEvent = await ApiInteraction.create_event(accessToken, {
        title,
        description,
        event_date: eventDate,   // must be ISO format
      });

      Alert.alert('Success', 'Event created successfully!');
      navigation.goBack();
    } catch (err) {
      console.error(err);
      Alert.alert('Error', err.message || 'Failed to create event');
    }
  };

  if (user?.user_type !== 'business') {
    return (
      <ScreenContainer>
        <Header title="Create Event" />
        <Text style={{ color: '#ef4444' }}>Only business accounts can create events.</Text>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <Header title="Create Event" subtitle="Add details to publish your event" />

      <TextInput
        style={styles.input}
        placeholder="Title"
        placeholderTextColor="#6b7280"
        onChangeText={setTitle}
      />

      <TextInput
        style={styles.input}
        placeholder="Description"
        placeholderTextColor="#6b7280"
        onChangeText={setDescription}
      />

      <TextInput
        style={styles.input}
        placeholder="Event Date (YYYY-MM-DDTHH:MM:SSZ)"
        placeholderTextColor="#6b7280"
        onChangeText={setEventDate}
      />

      <TouchableOpacity style={styles.button} onPress={handleCreate}>
        <Text style={styles.buttonText}>Publish Event</Text>
      </TouchableOpacity>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: '#1f2937',
    color: 'white',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
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
