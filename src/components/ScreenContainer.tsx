import React, { ReactNode } from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';

interface ScreenContainerProps {
  children: ReactNode;
  padded?: boolean;
}

export default function ScreenContainer({ children, padded = true }: ScreenContainerProps) {
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
