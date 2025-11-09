import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { ScrollView } from 'react-native';

import ChatroomCard from '@/components/ChatroomCard';
import Header from '@/components/Header';
import ScreenContainer from '@/components/ScreenContainer';
import SearchBar from '@/components/SearchBar';

interface Chatroom {
  id: string;
  name: string;
  venue: string;
  distance: string;
  members: number;
}

const MOCK: Chatroom[] = [
  { id: '1', name: 'Library', venue: 'Dibner Library', distance: '100 ft', members: 24 },
  { id: '2', name: 'Chipotle', venue: 'Chipotle', distance: '50 ft', members: 12 },
  { id: '3', name: 'Tandon', venue: 'Tandon', distance: '0 ft', members: 31 }
];

type RootStackParamList = {
  ChatroomDetail: { id: string };
};

type Props = NativeStackScreenProps<RootStackParamList>;

export default function HomeScreen({ navigation }: Props) {
  const [q, setQ] = React.useState('');
  const list = MOCK.filter(x => x.name.toLowerCase().includes(q.toLowerCase()));

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
