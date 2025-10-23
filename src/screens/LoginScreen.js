import ScreenContainer from "@/components/ScreenContainer";
import { useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function LoginScreen() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    return (
        <ScreenContainer>
            <View style={styles.centered}>
                <TextInput
                    value={username}
                    onChangeText={setUsername}
                    placeholder="Username"
                    placeholderTextColor="#6b7280"
                    style={styles.input}
                />
                <TextInput
                    value={password}
                    onChangeText={setPassword}
                    placeholder="Password"
                    style={styles.input}
                    placeholderTextColor="#6b7280"
                    secureTextEntry={true}
                />
                <View/>
                <TouchableOpacity style={styles.btn}>
                    <Text style={styles.btnText}>Login</Text>
                </TouchableOpacity>
            </View>
        </ScreenContainer>
    );
}

const styles = StyleSheet.create({
    input: {
        flex: 1,
        backgroundColor: '#111827',
        borderRadius: 999,
        padding: 14,
        color: '#e5e7eb',
        borderWidth: 1,
        borderColor: '#1f2937',
        marginBottom: 10,
    },
    btn: {
        backgroundColor: '#38bdf8',
        borderRadius: 12,
        paddingVertical: 12,
        alignItems: 'center',
        marginBottom: 12
    },
    btnText: { color: '#0b1220', fontWeight: '700' },
    centered: {
        marginTop: 'auto',
        marginBottom: 'auto',
    }
});