import React from 'react';
import ScreenContainer from '@/components/ScreenContainer';
import Header from '@/components/Header';
import { View, Text, StyleSheet } from 'react-native';

export default function EventsScreen() {
  return (
    <ScreenContainer>
      <Header title="Events" subtitle="Local happenings" />
      <View style={styles.empty}>
        <Text style={styles.emptyText}>No events yet.</Text>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyText: { color: '#9ca3af' }
});
