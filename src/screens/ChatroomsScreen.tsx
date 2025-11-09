import Header from '@/components/Header';
import ScreenContainer from '@/components/ScreenContainer';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ChatroomsScreen() {
  return (
    <ScreenContainer>
      <Header title="Your chatrooms" subtitle="Create or manage rooms" />
      <TouchableOpacity style={styles.btn}>
        <Text style={styles.btnText}>+ New Chatroom</Text>
      </TouchableOpacity>
      <View style={styles.empty}>
        <Text style={styles.emptyText}>No rooms yet.</Text>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  btn: {
    backgroundColor: '#38bdf8',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 12
  },
  btnText: { color: '#0b1220', fontWeight: '700' },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyText: { color: '#9ca3af' }
});
