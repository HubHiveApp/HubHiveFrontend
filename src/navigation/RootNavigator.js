import ApiInteraction from '@/ApiInteraction';
import { TokenContext, useAccessToken } from '@/context/AuthContext';
import { LocationContext } from '@/context/LocationContext';
import { UserLevelContext, useUserLevelContext } from '@/context/UserLevelContext';
import ChatroomDetailScreen from '@/screens/ChatroomDetailScreen';
import ChatroomsScreen from '@/screens/ChatroomsScreen';
import CreateChatroomScreen from '@/screens/CreateChatroomScreen';
import CreateEventScreen from '@/screens/CreateEventScreen';
import EditProfileScreen from '@/screens/EditProfileScreen';
import EventsScreen from '@/screens/EventsScreen';
import HomeScreen from '@/screens/HomeScreen';
import LoginOrSignUpScreen from '@/screens/LoginOrSignUpScreen';
import MessagesScreen from '@/screens/MessagesScreen';
import ProfileScreen from '@/screens/ProfileScreen';
import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as Location from 'expo-location';
import * as SecureStore from 'expo-secure-store';
import { useEffect, useReducer, useState } from 'react';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function Tabs() {
  const [loading, setLoading] = useState(true);
  const { accessToken } = useAccessToken();
  const { userType } = useUserLevelContext();

  useEffect(() => {
    setLoading(!accessToken);
  }, [accessToken]);

  if (!accessToken) return <LoginOrSignUpScreen />;
  if (loading) return null; // or a tiny splash/loader

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
      })}>
      {userType !== 'regular'
        ? <Tab.Screen name="Home" component={ChatroomsScreen} />
        : <Tab.Screen name="Home" component={HomeScreen} />}
      <Tab.Screen name="Messages" component={MessagesScreen} />
      <Tab.Screen name="Events" component={EventsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function RootNavigator() {
  // auth token sync
  const jwtKey = 'jwt';
  const reducer = (_, newState) => {
    SecureStore.setItem(jwtKey, newState);
    return newState;
  }

  const initialState = (token) => token = SecureStore.getItem(jwtKey) ?? '';

  const [accessToken, setAccessToken] = useReducer(reducer, '', initialState);

  // location
  useEffect(() => {
      let locationSubscription;

      async function setNewLocation(locationObj) {
        const { latitude, longitude } = locationObj.coords;

        const reverseGeocode = await Location.reverseGeocodeAsync({ latitude, longitude });
        const name = reverseGeocode[0]?.name || reverseGeocode[0]?.formattedAddress || reverseGeocode[0]?.city || "Current Location";

        setCoordinates([name, latitude, longitude]);
      }

      (async () => {
        let permissionResult = await Location.requestForegroundPermissionsAsync();

        if (!permissionResult.granted) {
          console.log(`Status: ${permissionResult.status}`)
          return;
        }

        const currentLocation = await Location.getCurrentPositionAsync();

        setNewLocation(currentLocation);

        locationSubscription = await Location.watchPositionAsync({
          accuracy: Location.LocationAccuracy.Balanced,
          distanceInterval: 100,
        },
          (location) => {
            setNewLocation(location)
          })
      })();

      return () => {
        locationSubscription?.remove();
      };
  }, []);

  const [coordinates, setCoordinates] = useState(["NYU Tandon Campus", 40.7291, -73.9965]);

  useEffect(() => {
    async function load() {
      const result = await ApiInteraction.get_profile(accessToken);
      setUserType(result.user.user_type);
    }
    load();
  }, [accessToken]);

  const [userType, setUserType] = useState('');

  return (
    <TokenContext.Provider value={{ accessToken, setAccessToken }}>
      <LocationContext.Provider value={{ coordinates, setCoordinates }}>
        <UserLevelContext.Provider value={{ userType, setUserType }}>
          <Stack.Navigator>
            <Stack.Screen name="Tabs" options={{ headerShown: false }}>
              {() => <Tabs/>}
            </Stack.Screen>
            <Stack.Screen name="ChatroomDetail" component={ChatroomDetailScreen} options={{ title: 'Chatroom', headerBackButtonDisplayMode: 'minimal' }} />
            <Stack.Screen name="EditProfile" component={EditProfileScreen} options={{ title: 'Edit Profile', headerBackButtonDisplayMode: 'minimal' }} />
            <Stack.Screen name="CreateChatroom" component={CreateChatroomScreen} options={{ title: 'Create Chatroom', headerBackButtonDisplayMode: 'minimal' }} />
            <Stack.Screen name="CreateEvent" component={CreateEventScreen} options={{ title: 'Create Event', headerBackButtonDisplayMode: 'minimal' }} />
          </Stack.Navigator>
        </UserLevelContext.Provider>
      </LocationContext.Provider>
    </TokenContext.Provider>
  );
}
