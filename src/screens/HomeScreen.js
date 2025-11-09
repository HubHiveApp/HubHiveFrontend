import React, { useCallback, useState } from 'react';
import { ScrollView } from 'react-native';

import ApiInteraction from '@/ApiInteraction';
import ChatroomCard from '@/components/ChatroomCard';
import Header from '@/components/Header';
import ScreenContainer from '@/components/ScreenContainer';
import SearchBar from '@/components/SearchBar';
import { useAccessToken } from '@/context/AuthContext';
import { useFocusEffect } from '@react-navigation/native';


const MOCK = [
  { id: '1', name: 'Library', venue: 'Dibner Library', distance: '100 ft', members: 24 },
  { id: '2', name: 'Chipotle', venue: 'Chipotle', distance: '50 ft', members: 12 },
  { id: '3', name: 'Tandon', venue: 'Tandon', distance: '0 ft', members: 31 }
];

export default function HomeScreen({ navigation }) {
  const { accessToken, setAccessToken } = useAccessToken();

  const [q, setQ] = React.useState('');
  const [list, setList] = useState([]);

  useFocusEffect(
    useCallback(() => {
      ApiInteraction.get_chatrooms(accessToken).then((receivedChatrooms) => {
        setList(receivedChatrooms);
      })
    }, [])
  );
  
  return (
    <ScreenContainer>
      <Header title="Nearby chatrooms" subtitle="Discover places around you" />
      <SearchBar value={q} onChangeText={setQ} placeholder="Search chatrooms or venues" />
      <ScrollView style={{ marginTop: 12 }}>
        {list.map(item => (
          <ChatroomCard key={item.id} {...item} onPress={() => navigation.navigate('ChatroomDetail', { id: item.id })} />
        ))}
      </ScrollView>
    </ScreenContainer>
  );
  
  
}
