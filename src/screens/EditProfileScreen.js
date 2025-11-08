import ScreenContainer from "@/components/ScreenContainer";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import { StyleSheet, TextInput } from "react-native";

export default function EditProfileScreen({ route }) {
    const [username, setUsername] = useState('');
    const { bio } = route.params;

    useFocusEffect(
        useCallback(() => {
            setUsername(bio.user.username);
        }, [])
    );

    return <ScreenContainer>
        <TextInput
            value={username}
            onChangeText={setUsername}
            placeholder="Username"
            style={styles.input}
            placeholderTextColor="#6b7280"
        />
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
})