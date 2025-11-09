import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ChatroomCardProps {
  name: string;
  venue: string;
  distance: string;
  members: number;
  onPress: () => void;
}

export default function ChatroomCard({ name, venue, distance, members, onPress }: ChatroomCardProps) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.card}>
      <View style={{ flex: 1 }}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.meta}>{venue} • {distance} away</Text>
      </View>
      <View style={styles.right}>
        <Ionicons name="people" size={16} color="#9ca3af" />
        <Text style={styles.count}>{members}</Text>
        <Ionicons name="chevron-forward" size={18} color="#9ca3af" />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#0f172a',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#1f2937',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12
  },
  name: { color: '#e5e7eb', fontSize: 16, fontWeight: '600' },
  meta: { color: '#9ca3af', marginTop: 4 },
  right: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  count: { color: '#9ca3af' }
});
