import Header from '@/components/Header';
import ScreenContainer from '@/components/ScreenContainer';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function MessagesScreen() {
  return (
    <ScreenContainer>
      <Header title="Messages" subtitle="Direct messages" />
      <View style={styles.empty}>
        <Text style={styles.emptyText}>No messages yet.</Text>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyText: { color: '#9ca3af' }
});
