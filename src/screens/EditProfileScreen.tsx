import ApiInteraction from "@/ApiInteraction";
import ScreenContainer from "@/components/ScreenContainer";
import { useAccessToken } from "@/context/AuthContext";
import { useFocusEffect } from "@react-navigation/native";
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useCallback, useState } from "react";
import { Button, StyleSheet, Text, TextInput } from "react-native";

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

type Props = NativeStackScreenProps<RootStackParamList, 'EditProfile'>;

export default function EditProfileScreen({ route, navigation }: Props) {
  const { accessToken } = useAccessToken();
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const { profile } = route.params;

  const updateProfile = async () => {
    let to_update: { username: string; bio?: string } = { username };
    if (bio !== profile.user.bio) {
      to_update = { ...to_update, bio };
    }
    await ApiInteraction.update_profile(accessToken, to_update);
  }

  useFocusEffect(
    useCallback(() => {
      setUsername(profile.user.username);
      setBio(profile.user.bio || '');
    }, [profile.user.username, profile.user.bio])
  );

  useFocusEffect(
    useCallback(() => {
      navigation.setOptions({
        headerRight: () => (<Button title="Save" onPress={updateProfile} />)
      });
    }, [navigation, updateProfile])
  );

  return (
    <ScreenContainer>
      <Text style={styles.label}>Username</Text>
      <TextInput
        value={username}
        onChangeText={setUsername}
        placeholder="Username"
        style={styles.input}
        placeholderTextColor="#6b7280"
      />
      <Text style={styles.label}>Bio</Text>
      <TextInput
        value={bio}
        onChangeText={setBio}
        placeholder="Bio"
        style={styles.input}
        placeholderTextColor="#6b7280"
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  input: {
    height: 48,
    backgroundColor: '#111827',
    borderRadius: 999,
    padding: 14,
    color: '#e5e7eb',
    borderWidth: 1,
    borderColor: '#1f2937',
    marginBottom: 10,
  },
  label: {
    color: '#e5e7eb',
    marginBottom: 8,
    fontWeight: '600'
  }
});
