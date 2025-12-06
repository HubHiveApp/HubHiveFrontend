import ApiInteraction from "@/ApiInteraction";
import ScreenContainer from "@/components/ScreenContainer";
import { useAccessToken } from "@/context/AuthContext";
import { useFocusEffect } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { useCallback, useState } from "react";
import { Alert, Button, Image, Pressable, StyleSheet, Text, TextInput } from "react-native";

export default function EditProfileScreen({ route, navigation }) {
    const { accessToken } = useAccessToken();
    const [username, setUsername] = useState('');
    const [bio, setBio] = useState('');
    const [editedProfilePic, setEditedProfilePic] = useState(null);

    const { profile } = route.params; // profile = { user: {...} }

    const updateProfile = async () => {
        try {
            let to_update = { username };
            if (bio !== profile.user.bio) {
                to_update = { ...to_update, bio };
            }
            await ApiInteraction.update_profile(accessToken, to_update);
            if (editedProfilePic) {
                await ApiInteraction.upload_profile_picture(accessToken, editedProfilePic.uri);
            }
            Alert.alert("Success", "Profile updated.", [{ onPress: () => navigation.goBack() }]);
        } catch (err) {
            console.log(err);
            Alert.alert("Error", err.message || "Failed to update profile.");
        }
    };

    // populate username/bio when screen gains focus
    useFocusEffect(
        useCallback(() => {
            if (!profile || !profile.user) return;
            setUsername(profile.user.username || "");
            setBio(profile.user.bio || "");
        }, [profile])
    );

    // header Save button
    useFocusEffect(
        useCallback(() => {
            navigation.setOptions({
                headerRight: () => (<Button title="Save" onPress={updateProfile} />)
            });
        }, [navigation, username, bio, editedProfilePic])
    );

    const handleChangeProfilePicture = async () => {
        try {
            // ask for permission
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== "granted") {
                Alert.alert("Permission needed", "We need access to your photos to change your profile picture.");
                return;
            }

            // open picker
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.7,
            });

            if (result.canceled) return;

            const asset = result.assets[0];
            if (!asset?.uri) {
                Alert.alert("Error", "No image selected.");
                return;
            }

            setEditedProfilePic(asset);
        } catch (err) {
            console.log(err);
            Alert.alert("Error", err.message || "Failed to get profile picture.");
        }
    };

    return (
        <ScreenContainer>
            <Pressable onPress={handleChangeProfilePicture} style={{ marginHorizontal: 'auto' }} >
                <Image source={{ uri: editedProfilePic?.uri ?? `http://localhost:8000/${profile.user.profile_picture}` }} style={styles.avatar} />
                <Button title="Change Profile Photo" onPress={handleChangeProfilePicture}>Change Profile Photo</Button>
            </Pressable>
            <Text style={styles.itemText}>Username</Text>
            <TextInput
                value={username}
                onChangeText={setUsername}
                placeholder="Username"
                style={styles.input}
                placeholderTextColor="#6b7280"
            />

            <Text style={styles.itemText}>Bio</Text>
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
    itemText: { color: '#e5e7eb' },
    avatar: { width: 112, height: 112, borderRadius: 56, alignSelf: 'center' },
});
