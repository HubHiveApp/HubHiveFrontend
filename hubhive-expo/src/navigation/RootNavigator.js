import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from '@/screens/HomeScreen';
import ChatroomsScreen from '@/screens/ChatroomsScreen';
import MessagesScreen from '@/screens/MessagesScreen';
import EventsScreen from '@/screens/EventsScreen';
import ProfileScreen from '@/screens/ProfileScreen';
import ChatroomDetailScreen from '@/screens/ChatroomDetailScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function Tabs() {
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
}

export default function RootNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Tabs" component={Tabs} options={{ headerShown: false }} />
      <Stack.Screen name="ChatroomDetail" component={ChatroomDetailScreen} options={{ title: 'Chatroom' }} />
    </Stack.Navigator>
  );
}
