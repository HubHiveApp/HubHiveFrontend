import React from 'react';
import ScreenContainer from '@/components/ScreenContainer';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList } from 'react-native';

const seed = [
  { id: 'm1', author: 'Sai', text: 'Hi' },
  { id: 'm2', author: 'Andy', text: 'Hello' }
];

export default function ChatroomDetailScreen() {
  const [messages, setMessages] = React.useState(seed);
  const [text, setText] = React.useState('');

  function send() {
    if (!text.trim()) return;
    setMessages(prev => [{ id: Math.random().toString(), author: 'You', text }, ...prev]);
    setText('');
  }

  return (
    <ScreenContainer padded={false}>
      <FlatList
        style={{ flex: 1, padding: 16 }}
        data={messages}
        keyExtractor={(item) => item.id}
        inverted
        renderItem={({ item }) => (
          <View style={styles.msg}>
            <Text style={styles.author}>{item.author}</Text>
            <Text style={styles.text}>{item.text}</Text>
          </View>
        )}
      />

      <View style={styles.inputWrap}>
        <TextInput
          value={text}
          onChangeText={setText}
          placeholder="Message"
          placeholderTextColor="#6b7280"
          style={styles.input}
        />
        <TouchableOpacity onPress={send} style={styles.send}>
          <Text style={styles.sendText}>Send</Text>
        </TouchableOpacity>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  msg: {
    backgroundColor: '#0f172a',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#1f2937'
  },
  author: { color: '#9ca3af', marginBottom: 4, fontSize: 12 },
  text: { color: '#e5e7eb' },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#1f2937',
    gap: 8
  },
  input: {
    flex: 1,
    backgroundColor: '#111827',
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 10,
    color: '#e5e7eb',
    borderWidth: 1,
    borderColor: '#1f2937'
  },
  send: { backgroundColor: '#38bdf8', borderRadius: 999, paddingHorizontal: 16, paddingVertical: 10 },
  sendText: { color: '#0b1220', fontWeight: '700' }
});
