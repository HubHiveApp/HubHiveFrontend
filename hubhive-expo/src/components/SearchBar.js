import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function SearchBar({ value, onChangeText, placeholder = 'Search' }) {
  return (
    <View style={styles.box}>
      <Ionicons name="search" size={18} color="#9ca3af" />
      <TextInput
        placeholder={placeholder}
        placeholderTextColor="#6b7280"
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  box: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#111827',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#1f2937'
  },
  input: { flex: 1, color: '#e5e7eb' }
});
