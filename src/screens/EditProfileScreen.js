import ApiInteraction from "@/ApiInteraction";
import ScreenContainer from "@/components/ScreenContainer";
import { useAccessToken } from "@/context/AuthContext";
import { useFocusEffect } from "@react-navigation/native";
import * as ImagePicker from 'expo-image-picker';
import { useCallback, useState } from "react";
import { Button, Image, StyleSheet, Text, TextInput, TouchableOpacity } from "react-native";

export default function EditProfileScreen({ route, navigation }) {
    const { accessToken, setAccessToken } = useAccessToken();
    const [username, setUsername] = useState('');
    const [bio, setBio] = useState('');
    const [image, setImage] = useState('https://randomuser.me/api/portraits/men/1.jpg');
    const { profile } = route.params;

    const updateProfile = async () => {
        let to_update = { username };
        if (bio !== profile.user.bio) {
            to_update = { ...to_update, bio };
        }
        const response = await ApiInteraction.update_profile(accessToken, to_update);
    }

    useFocusEffect(
        useCallback(() => {
            setUsername(profile.user.username);
            setBio(profile.user.bio);
            console.log(profile);
        }, [])
    );

    useFocusEffect(
        useCallback(() => {
            navigation.setOptions({
                headerRight: () => (<Button title="Save" onPress={updateProfile} />)
            });
        }, [username, bio])
    );

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    }

    return <ScreenContainer>
        <Text>Username</Text>
        <TextInput
            value={username}
            onChangeText={setUsername}
            placeholder="Username"
            style={styles.input}
            placeholderTextColor="#6b7280"
        />
        <Text>Bio</Text>
        <TextInput
            value={bio}
            onChangeText={setBio}
            placeholder="Bio"
            style={styles.input}
            placeholderTextColor="#6b7280"
        />

        <TouchableOpacity onPress={pickImage}>
            <Image source={{ uri: image }} style={styles.avatar} />
        </TouchableOpacity>
    </ScreenContainer>
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
    avatar: { width: 56, height: 56, borderRadius: 28 },
})