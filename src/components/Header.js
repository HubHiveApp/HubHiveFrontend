import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Header({ title, subtitle }) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}
const styles = StyleSheet.create({
  wrap: { marginBottom: 12 },
  title: { fontSize: 24, fontWeight: '700', color: '#e5e7eb' },
  subtitle: { fontSize: 14, color: '#9ca3af', marginTop: 4 }
});
