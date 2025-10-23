import React from 'react';
import { SafeAreaView, View, StyleSheet } from 'react-native';

export default function ScreenContainer({ children, padded = true }) {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={[styles.container, padded && styles.padded]}>{children}</View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0b1220' },
  container: { flex: 1 },
  padded: { padding: 16 }
});
