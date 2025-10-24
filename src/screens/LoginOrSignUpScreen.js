import ScreenContainer from "@/components/ScreenContainer";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

function LoginScreen({ setLoggedIn, setScreenToShow }) {
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
                <View />
                <TouchableOpacity style={styles.btn} onPress={() => setLoggedIn(true)}>
                    <Text style={styles.btnText}>Login</Text>
                </TouchableOpacity>
                <Text style={styles.itemText} onPress={() => setScreenToShow(Screens.SIGN_UP)}>Don't have an account yet?</Text>
            </View>
        </ScreenContainer>
    );
}

function SignUpScreen({ setLoggedIn, setScreenToShow }) {
    const [realName, setRealName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    return (
        <ScreenContainer>
            <View style={styles.centered}>
                <TextInput
                    value={realName}
                    onChangeText={setRealName}
                    placeholder="Full Name"
                    placeholderTextColor="#6b7280"
                    style={styles.input}
                />
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
                <View />
                <TouchableOpacity style={styles.btn} onPress={() => setLoggedIn(true)}>
                    <Text style={styles.btnText}>Sign Up</Text>
                </TouchableOpacity>
                <Text style={styles.itemText} onPress={() => setScreenToShow(Screens.LOG_IN)}>Have an account?</Text>
            </View>
        </ScreenContainer>
    );
}

export default function LoginOrSignUpScreen() {
    const { setLoggedIn } = useAuth();
    const [screenToShow, setScreenToShow] = useState(Screens.LOG_IN);

    if (screenToShow === Screens.LOG_IN) {
        return <LoginScreen setLoggedIn={setLoggedIn} setScreenToShow={setScreenToShow} />;
    } else {
        return <SignUpScreen setLoggedIn={setLoggedIn} setScreenToShow={setScreenToShow} />;
    }
}

const Screens = {
    LOG_IN: "log_in",
    SIGN_UP: "sign_up"
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
    },
    itemText: { color: '#e5e7eb' }
});