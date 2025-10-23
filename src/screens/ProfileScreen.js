import React from 'react';
import ScreenContainer from '@/components/ScreenContainer';
import Header from '@/components/Header';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

export default function ProfileScreen() {
  return (
    <ScreenContainer>
      <Header title="Profile" subtitle="Account & preferences" />
      <View style={styles.row}>
        <Image source={{ uri: 'https://randomuser.me/api/portraits/men/1.jpg' }} style={styles.avatar} />
        <View style={{ flex: 1 }}>
          <Text style={styles.name}>Brian Yin</Text>
          <Text style={styles.meta}>@brian • bzy205@nyu.edu</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.item}>
        <Text style={styles.itemText}>Edit profile</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.item}>
        <Text style={styles.itemText}>Privacy & safety</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.item}>
        <Text style={styles.itemText}>Notifications</Text>
      </TouchableOpacity>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 12, alignItems: 'center', marginBottom: 16 },
  avatar: { width: 56, height: 56, borderRadius: 28 },
  name: { color: '#e5e7eb', fontWeight: '700', fontSize: 16 },
  meta: { color: '#9ca3af', marginTop: 4 },
  item: {
    backgroundColor: '#0f172a',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#1f2937',
    marginBottom: 10
  },
  itemText: { color: '#e5e7eb' }
});
