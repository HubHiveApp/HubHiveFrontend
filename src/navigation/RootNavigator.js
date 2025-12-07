import { TokenContext } from '@/context/AuthContext';
import ChatroomDetailScreen from '@/screens/ChatroomDetailScreen';
import ChatroomsScreen from '@/screens/ChatroomsScreen';
import EditProfileScreen from '@/screens/EditProfileScreen';
import EventsScreen from '@/screens/EventsScreen';
import HomeScreen from '@/screens/HomeScreen';
import LoginOrSignUpScreen from '@/screens/LoginOrSignUpScreen';
import MessagesScreen from '@/screens/MessagesScreen';
import ProfileScreen from '@/screens/ProfileScreen';
import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as SecureStore from 'expo-secure-store';
import { useReducer } from 'react';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function Tabs({ accessToken }) {
  // Tabs now receives auth state via props (provided by RootNavigator)
  if (accessToken) {
    return (
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarStyle: { backgroundColor: '#0f172a', borderTopColor: '#1f2937' },
          tabBarActiveTintColor: '#38bdf8',
          tabBarInactiveTintColor: '#9ca3af',
          tabBarIcon: ({ color, size }) => {
            const map = {
              Home: 'home',
              Chatrooms: 'chatbubbles',
              Messages: 'mail',
              Events: 'calendar',
              Profile: 'person'
            };
            return <Ionicons name={map[route.name]} size={size} color={color} />;
          }
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Chatrooms" component={ChatroomsScreen} />
        <Tab.Screen name="Messages" component={MessagesScreen} />
        <Tab.Screen name="Events" component={EventsScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
      </Tab.Navigator>
    );
  } else {
    return <LoginOrSignUpScreen />;
  }
}

export default function RootNavigator() {
  const jwtKey = 'jwt';
  const reducer = (_, newState) => {
    SecureStore.setItem(jwtKey, newState);
    return newState;
  }

  const initialState = (token) => token = SecureStore.getItem(jwtKey) ?? '';

  const [accessToken, setAccessToken] = useReducer(reducer, '', initialState);

  return (
    <TokenContext.Provider value={{ accessToken, setAccessToken }}>
      <Stack.Navigator>
        <Stack.Screen name="Tabs" options={{ headerShown: false }}>
          {() => <Tabs accessToken={accessToken} />}
        </Stack.Screen>
        <Stack.Screen name="ChatroomDetail" component={ChatroomDetailScreen} options={{ title: 'Chatroom', headerBackButtonDisplayMode: 'minimal' }} />
        <Stack.Screen name="EditProfile" component={EditProfileScreen} options={{ title: 'Edit Profile', headerBackButtonDisplayMode: 'minimal' }} />
      </Stack.Navigator>
    </TokenContext.Provider>
  );
}
