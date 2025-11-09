import ApiInteraction from '@/ApiInteraction';
import Header from '@/components/Header';
import ScreenContainer from '@/components/ScreenContainer';
import { useAccessToken } from '@/context/AuthContext';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ProfileScreen({ navigation }) {
  const { accessToken, setAccessToken } = useAccessToken();
  const [username, setUsername] = useState('unknown');
  const [email, setEmail] = useState('No email');
  const [name, setName] = useState('Unnamed');
  const [profile, setProfile] = useState(null);

  useFocusEffect(
    useCallback(() => {
      ApiInteraction.get_profile(accessToken).then((profile) => {
        setProfile(profile);
        setUsername(profile.user.username);
        setEmail(profile.user.email)
        setName(profile.user.name ?? 'Unnamed');
      });
      return () => { }
    }, [accessToken])
  );

  return (
    <ScreenContainer>
      <Header title="Profile" subtitle="Account & preferences" />
      <View style={styles.row}>
        <Image source={{ uri: 'https://randomuser.me/api/portraits/men/1.jpg' }} style={styles.avatar} />
        <View style={{ flex: 1 }}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.meta}>@{username} • {email}</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.item} onPress={() => { navigation.navigate("EditProfile", { profile: profile }) }}>
        <Text style={styles.itemText}>Edit profile</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.item}>
        <Text style={styles.itemText}>Privacy & safety</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.item}>
        <Text style={styles.itemText}>Notifications</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.item} onPress={ () => setAccessToken('') }>
        <Text style={styles.itemText}>Log Out</Text>
      </TouchableOpacity>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 12, alignItems: 'center', marginBottom: 16 },
  avatar: { width: 56, height: 56, borderRadius: 28 },
  name: { color: '#e5e7eb', fontWeight: '700', fontSize: 16 },
  meta: { color: '#9ca3af', marginTop: 4 },
  item: {
    backgroundColor: '#0f172a',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#1f2937',
    marginBottom: 10
  },
  itemText: { color: '#e5e7eb' }
});
