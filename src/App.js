import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import React from 'react';
import 'react-native-gesture-handler';
import RootNavigator from './navigation/RootNavigator';

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#0b1220',
    card: '#0f172a',
    text: '#e5e7eb',
    border: '#1f2937',
    primary: '#38bdf8'
  }
};

export default function App() {
  return (
    <NavigationContainer>
      <RootNavigator />
    </NavigationContainer>
  );
}
