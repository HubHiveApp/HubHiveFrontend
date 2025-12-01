import React, { useCallback, useState } from 'react';
import { ScrollView } from 'react-native';

import ApiInteraction from '@/ApiInteraction';
import ChatroomCard from '@/components/ChatroomCard';
import Header from '@/components/Header';
import ScreenContainer from '@/components/ScreenContainer';
import SearchBar from '@/components/SearchBar';
import { useAccessToken } from '@/context/AuthContext';
import { useFocusEffect } from '@react-navigation/native';

function distanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371.0; // Earth's radius in km
  const toRad = (deg) => (deg * Math.PI) / 180;

  const dlat = toRad(lat2 - lat1);
  const dlon = toRad(lon2 - lon1);

  const a =
    Math.sin(dlat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dlon / 2) ** 2;

  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

const MOCK = [
  { id: '1', name: 'Library', venue: 'Dibner Library', distance: '100 ft', members: 24 },
  { id: '2', name: 'Chipotle', venue: 'Chipotle', distance: '50 ft', members: 12 },
  { id: '3', name: 'Tandon', venue: 'Tandon', distance: '0 ft', members: 31 }
];

export default function HomeScreen({ navigation }) {
  const { accessToken, setAccessToken } = useAccessToken();

  const [q, setQ] = React.useState('');
  const [list, setList] = useState([]);
  const [coordinates, setCoordinates] = useState(["NYU Tandon Campus", 40.7291, -73.9965]);

  useFocusEffect(
    useCallback(() => {
      ApiInteraction.get_chatrooms(accessToken, coordinates[1], coordinates[2], 1).then((receivedChatrooms) => {
        setList(receivedChatrooms);
      })
    }, [])
  );
  
  return (
    <ScreenContainer>
      <Header title="Nearby chatrooms" subtitle="Discover chats around you" secondSubtitle={"Your current location: " + coordinates[0]} />
      <SearchBar value={q} onChangeText={setQ} placeholder="Search chatrooms or venues" />
      <ScrollView style={{ marginTop: 12 }}>
        {list.map(item => (
          <ChatroomCard key={item.id} {...item} distance={`${Math.round(distanceKm(coordinates[1], coordinates[2], item.location.latitude, item.location.longitude) * 100) / 100} km`} onPress={async () => {
            let can_join = await ApiInteraction.join_chatroom(accessToken, item.id);

            if (can_join) {
              navigation.navigate('ChatroomDetail', { id: item.id })
            }
          }} />
        ))}
      </ScrollView>
    </ScreenContainer>
  );
  
  
}
