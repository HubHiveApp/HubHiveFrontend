import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ChatroomCard({ name, location, distance, participant_count, onPress }) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.card}>
      <View style={{ flex: 1 }}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.meta}>{location.address} • {distance} away</Text>
      </View>
      <View style={styles.right}>
        <Ionicons name="people" size={16} color="#9ca3af" />
        <Text style={styles.count}>{participant_count}</Text>
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
  count: { color: '#9ca3af' },
  right: { flexDirection: 'row', alignItems: 'center', gap: 6 }
});
