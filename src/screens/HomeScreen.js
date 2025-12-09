import React, { useCallback, useState } from 'react';
import { RefreshControl, ScrollView } from 'react-native';

import ApiInteraction from '@/ApiInteraction';
import ChatroomCard from '@/components/ChatroomCard';
import Header from '@/components/Header';
import ScreenContainer from '@/components/ScreenContainer';
import SearchBar from '@/components/SearchBar';
import { useAccessToken } from '@/context/AuthContext';
import { distanceKm } from '@/utils/distance';
import { useFocusEffect } from '@react-navigation/native';

import { useLocationContext } from '@/context/LocationContext';

const MOCK = [
  { id: '1', name: 'Library', venue: 'Dibner Library', distance: '100 ft', members: 24 },
  { id: '2', name: 'Chipotle', venue: 'Chipotle', distance: '50 ft', members: 12 },
  { id: '3', name: 'Tandon', venue: 'Tandon', distance: '0 ft', members: 31 }
];

export default function HomeScreen({ navigation }) {
  const { accessToken } = useAccessToken();
  const { coordinates } = useLocationContext();

  const [refreshing, setRefreshing] = useState(false);
  const [q, setQ] = React.useState('');
  const [list, setList] = useState([]);

  const getChatrooms = useCallback(() => {
    setRefreshing(true);
    ApiInteraction.get_chatrooms(accessToken, coordinates[1], coordinates[2], 1).then((receivedChatrooms) => {
      setList(receivedChatrooms);
    })
      .finally(() => setRefreshing(false));
  }, [accessToken, coordinates]);

  useFocusEffect(
    useCallback(() => {
      getChatrooms();
    }, [getChatrooms])
  );
  
  return (
    <ScreenContainer>
      <Header title="Nearby chatrooms" subtitle="Discover chats around you" secondSubtitle={"Your current location: " + coordinates[0]} />
      <SearchBar value={q} onChangeText={setQ} placeholder="Search chatrooms or venues" />
      <ScrollView style={{ marginTop: 12 }}
        refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={getChatrooms}/>
      }>
        {list.map(item => (
          <ChatroomCard key={item.id} {...item} distance={`${Math.round(distanceKm(coordinates[1], coordinates[2], item.location.latitude, item.location.longitude) * 100) / 100} km`} onPress={async () => {
            let can_join = await ApiInteraction.join_chatroom(accessToken, item.id);

            if (can_join) {
              navigation.navigate('ChatroomDetail', { id: item.id, name: item.name })
            }
          }} />
        ))}
      </ScrollView>
    </ScreenContainer>
  );
}
