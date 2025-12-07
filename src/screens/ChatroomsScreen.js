import ApiInteraction from '@/ApiInteraction';
import ChatroomCard from '@/components/ChatroomCard';
import Header from '@/components/Header';
import ScreenContainer from '@/components/ScreenContainer';
import { useAccessToken } from '@/context/AuthContext';
import { distanceKm } from '@/utils/distance';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ChatroomsScreen({ navigation }) {
  const { accessToken, setAccessToken } = useAccessToken();
  const [list, setList] = useState([]);
  const [coordinates, setCoordinates] = useState([]);

  useFocusEffect(
    useCallback(() => {
      ApiInteraction.get_my_business_chatrooms(accessToken).then((result) => {
        setList(result);
      })
      
      ApiInteraction.get_profile(accessToken).then((userInfo) => {
        setCoordinates([userInfo.user.location.address, userInfo.user.location.latitude, userInfo.user.location.longitude]);
      });
    }, [])
  );

  return (
    <ScreenContainer>
      <Header title="Your chatrooms" subtitle="Create or manage rooms" />
      <TouchableOpacity style={styles.btn} onPress={() => {
        navigation.navigate('CreateChatroom');
      }}>
        <Text style={styles.btnText}>+ New Chatroom</Text>
      </TouchableOpacity>
      {(list.length === 0) ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>No rooms yet.</Text>
        </View>
      ) : (
        (coordinates[1] !== undefined && coordinates[2] !== undefined) ? (
          <ScrollView style={{ marginTop: 12 }}>
            {list.map(item => (
              <ChatroomCard
                key={item.id}
                {...item}
                distance={
                  item.location && item.location.latitude != null && item.location.longitude != null
                    ? `${Math.round(distanceKm(coordinates[1], coordinates[2], item.location.latitude, item.location.longitude) * 100) / 100} km`
                    : 'Unknown distance'
                }
                onPress={async () => {
                  const canJoin = await ApiInteraction.join_chatroom(accessToken, item.id);  
                  if (canJoin) {  
                    navigation.navigate('ChatroomDetail', { id: item.id, name: item.name });
                  }
                }}
              />
            ))}
          </ScrollView>
        ) : (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>Loading location...</Text>
          </View>
        )
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  btn: {
    backgroundColor: '#38bdf8',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 12
  },
  btnText: { color: '#0b1220', fontWeight: '700' },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyText: { color: '#9ca3af' }
});
