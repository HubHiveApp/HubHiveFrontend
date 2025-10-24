import { AuthContext } from '@/context/AuthContext';
import ChatroomDetailScreen from '@/screens/ChatroomDetailScreen';
import ChatroomsScreen from '@/screens/ChatroomsScreen';
import EventsScreen from '@/screens/EventsScreen';
import HomeScreen from '@/screens/HomeScreen';
import LoginOrSignUpScreen from '@/screens/LoginOrSignUpScreen';
import MessagesScreen from '@/screens/MessagesScreen';
import ProfileScreen from '@/screens/ProfileScreen';
import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useState } from 'react';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function Tabs({ loggedIn }) {
  // Tabs now receives auth state via props (provided by RootNavigator)
  if (loggedIn) {
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
  const [loggedIn, setLoggedIn] = useState(false);

  return (
    <AuthContext.Provider value={{ loggedIn, setLoggedIn }}>
      <Stack.Navigator>
        <Stack.Screen name="Tabs" options={{ headerShown: false }}>
          {() => <Tabs loggedIn={loggedIn} />}
        </Stack.Screen>
        <Stack.Screen name="ChatroomDetail" component={ChatroomDetailScreen} options={{ title: 'Chatroom' }} />
      </Stack.Navigator>
    </AuthContext.Provider>
  );
}
