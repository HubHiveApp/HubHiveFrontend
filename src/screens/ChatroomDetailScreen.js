import ApiInteraction from '@/ApiInteraction';
import ScreenContainer from '@/components/ScreenContainer';
import { useAccessToken } from '@/context/AuthContext';
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useEffect } from 'react';
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

  useEffect(() => {
    // Set socket token
    ApiInteraction.socket.setToken(accessToken);

    // Join on mount
    ApiInteraction.socket.join(id);

    // Listen for incoming messages
    const onNewMessage = ({ message }) => {
      console.log('New message received:', message);
      setMessages((prev) => [message, ...prev]);
    };

    ApiInteraction.socket.onNewMessage(onNewMessage);

    // Cleanup: leave room and remove listener
    return () => {
      ApiInteraction.socket.leave(id);
      ApiInteraction.socket.offNewMessage(onNewMessage);
    };
  }, [id, accessToken]);

  useFocusEffect(
    useCallback(() => {
      // Fetch messages
      ApiInteraction.get_messages_in_chatroom(accessToken, id).then((result) => {
        console.log('Fetched messages:', result);
        if (result && result.messages) {
          const reversed = result.messages.reverse();
          console.log('First message user_id:', reversed[0]?.user_id);
          setMessages(reversed);
        }
      }).catch(err => {
        console.error('Error fetching messages:', err);
      });

      return () => {
        setMessages([]);
      }
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
          <View style={styles.msg}>
            <Text style={styles.author}>{item.username || item.author}</Text>
            <Text style={styles.text}>{item.content || item.text}</Text>
          </View>
        )}
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
