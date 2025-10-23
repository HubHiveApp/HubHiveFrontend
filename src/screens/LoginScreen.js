import { useState } from "react";
import { StyleSheet, TextInput, View } from "react-native";

export default function LoginScreen() {
    const [username, setUsername] = useState('');
    return (
        <View>
            <TextInput
                value={username}
                onChangeText={setUsername}
                placeholder="Message"
            />
        </View>
    )
}

const styles = StyleSheet.create({
    input: {
        flex: 1,
        backgroundColor: '#111827',
        borderRadius: 999,
        paddingHorizontal: 14,
        paddingVertical: 10,
        color: '#e5e7eb',
        borderWidth: 1,
        borderColor: '#1f2937'
    },
});