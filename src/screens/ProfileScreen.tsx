import ApiInteraction from '@/ApiInteraction';
import Header from '@/components/Header';
import ScreenContainer from '@/components/ScreenContainer';
import { useAccessToken } from '@/context/AuthContext';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useCallback, useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface User {
  username: string;
  email: string;
  name?: string;
  bio?: string;
}

interface Profile {
  user: User;
}

type RootStackParamList = {
  EditProfile: { profile: Profile };
};

type Props = NativeStackScreenProps<RootStackParamList>;

export default function ProfileScreen({ navigation }: Props) {
  const { accessToken, setAccessToken } = useAccessToken();
  const [username, setUsername] = useState('unknown');
  const [email, setEmail] = useState('No email');
  const [name, setName] = useState('Unnamed');
  const [profile, setProfile] = useState<Profile | null>(null);

  useFocusEffect(
    useCallback(() => {
      ApiInteraction.get_profile(accessToken).then((profileData: Profile) => {
        setProfile(profileData);
        setUsername(profileData.user.username);
        setEmail(profileData.user.email);
        setName(profileData.user.name ?? 'Unnamed');
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

      <TouchableOpacity style={styles.item} onPress={() => { 
        if (profile) {
          navigation.navigate("EditProfile", { profile });
        }
      }}>
        <Text style={styles.itemText}>Edit profile</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.item}>
        <Text style={styles.itemText}>Privacy & safety</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.item}>
        <Text style={styles.itemText}>Notifications</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.item} onPress={() => setAccessToken('')}>
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
