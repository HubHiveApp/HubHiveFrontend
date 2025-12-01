import ApiInteraction from '@/ApiInteraction';
import ScreenContainer from '@/components/ScreenContainer';
import { useAccessToken } from '@/context/AuthContext';
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback } from 'react';
import { FlatList, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const seed = [
  { id: 'm1', author: 'Sai', text: 'Hi' },
  { id: 'm2', author: 'Andy', text: 'Hello' }
];

export default function ChatroomDetailScreen({ route }) {
  const { accessToken, setAccessToken } = useAccessToken();
  const { id } = route.params;

  const [messages, setMessages] = React.useState([]);
  const [text, setText] = React.useState('');

  function send() {
    if (!text.trim()) return;
    console.log('Sending message to room:', id);
    ApiInteraction.socket.send({ chatroomId: id, content: text });
    setMessages(prev => [{ id: Math.random().toString(), author: 'You', text }, ...prev]);
    setText('');
  }

  function get_prev_messages() {
    console.log('grabbing prev messages on load or scroll');
    ApiInteraction.get_messages_in_chatroom(accessToken, id, messages.length)
      .then((result) => {
        if (result && Array.isArray(result.messages) && result.messages.length) {
          // Backend already returns oldest -> newest, but since FlatList is inverted, we want to reverse what we get
          console.log(result.messages[0].id);
          setMessages((prev) => [...prev, ...result.messages.reverse()]);
        }
      })
      .catch((err) => {
        console.error('Error fetching messages:', err);
      });
  }

  useFocusEffect(
    useCallback(() => {
      // Set socket token
      ApiInteraction.socket.setToken(accessToken);

      // Join on mount
      ApiInteraction.socket.join(id);

      // Listen for incoming messages
      const onNewMessage = ({ message }) => {
        if (!message) return;
        // Prepend new incoming message to maintain newest-first data ordering.
        // With FlatList `inverted`, this keeps the newest message visually at the bottom.
        setMessages((prev) => [message, ...prev]);
      };

      ApiInteraction.socket.onNewMessage(onNewMessage);

      // Cleanup: leave room and remove listener
      return () => {
        ApiInteraction.socket.leave(id);
        ApiInteraction.socket.offNewMessage(onNewMessage);
      };
    }, [id, accessToken])
  );

  useFocusEffect(
    useCallback(() => {
      // Fetch messages
      get_prev_messages();
    }, [accessToken, id])
  );

  return (
    <ScreenContainer padded={false}>
      <FlatList
        style={{ flex: 1, padding: 16 }}
        data={messages}
        keyExtractor={(item) => item.id}
        inverted
        renderItem={({ item }) => (
          <View
            style={styles.msg}
            key={item.id}>
            <Text style={styles.author}>{item.username || item.author}</Text>
            <Text style={styles.text}>{item.content || item.text}</Text>
          </View>
        )}
        onEndReached={get_prev_messages}
        onEndReachedThreshold={0.1}
      />

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 110 : 0}
        style={{ width: '100%' }}
      >
        <View style={styles.inputWrap}>
          <TextInput
            value={text}
            onChangeText={setText}
            placeholder="Message"
            placeholderTextColor="#6b7280"
            style={styles.input}
            onSubmitEditing={send}
            spellCheck={true}
            autoFocus={true}
            autoCapitalize={'sentences'}
            returnKeyType='send'
            enablesReturnKeyAutomatically={true}
            submitBehavior='submit'
          />
          <TouchableOpacity 
            onPress={send} 
            style={[styles.send, text.trim() === '' && styles.sendDisabled]} 
            disabled={text.trim() === ''}
          >
            <Text style={styles.sendText}>Send</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
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
  send: { 
    backgroundColor: '#38bdf8', 
    borderRadius: 999, 
    paddingHorizontal: 16, 
    paddingVertical: 10,
    opacity: 1
  },
  sendDisabled: {
    opacity: 0.5
  },
  sendText: { color: '#0b1220', fontWeight: '700' }
});
