import ApiInteraction from '@/ApiInteraction';
import Header from '@/components/Header';
import ScreenContainer from '@/components/ScreenContainer';
import { useAccessToken } from '@/context/AuthContext';
import { useState } from 'react';
import { ScrollView, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function CreateChatroomScreen({ navigation }) {
  const { accessToken } = useAccessToken();
  
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [maxParticipants, setMaxParticipants] = useState('100');
  const [isPrivate, setIsPrivate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleCreate() {
    if (!name.trim()) {
      setError('Chatroom name is required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await ApiInteraction.create_chatroom(accessToken, {
        name: name.trim(),
        description: description.trim(),
        max_participants: parseInt(maxParticipants) || 100,
        is_private: isPrivate
      });

      // Navigate back or to the new chatroom
      navigation.goBack();
    } catch (err) {
      setError(err.message || 'Failed to create chatroom');
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScreenContainer>
      <Header title="Create Chatroom"/>
      
      <ScrollView style={styles.form}>
        <Text style={styles.label}>Name *</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Enter chatroom name"
          placeholderTextColor="#6b7280"
        />

        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={description}
          onChangeText={setDescription}
          placeholder="Enter description (optional)"
          placeholderTextColor="#6b7280"
          multiline
          numberOfLines={4}
        />

        <Text style={styles.label}>Max Participants</Text>
        <TextInput
          style={styles.input}
          value={maxParticipants}
          onChangeText={setMaxParticipants}
          placeholder="100"
          placeholderTextColor="#6b7280"
          keyboardType="number-pad"
        />

        <View style={styles.switchRow}>
          <Text style={styles.label}>Private Chatroom</Text>
          <Switch
            value={isPrivate}
            onValueChange={setIsPrivate}
            trackColor={{ false: '#374151', true: '#38bdf8' }}
            thumbColor={isPrivate ? '#0ea5e9' : '#9ca3af'}
          />
        </View>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <TouchableOpacity 
          style={[styles.btn, loading && styles.btnDisabled]} 
          onPress={handleCreate}
          disabled={loading}
        >
          <Text style={styles.btnText}>
            {loading ? 'Creating...' : 'Create Chatroom'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
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
  textArea: {
    height: 100,
    textAlignVertical: 'top'
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 8
  },
  btn: {
    backgroundColor: '#38bdf8',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 12
  },
  btnDisabled: {
    opacity: 0.5
  },
  btnText: { 
    color: '#0b1220', 
    fontWeight: '700',
    fontSize: 16
  },
  errorText: {
    color: '#ef4444',
    marginTop: 12,
    fontSize: 14
  }
});
