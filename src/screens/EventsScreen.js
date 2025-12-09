import ApiInteraction from '@/ApiInteraction';
import Header from '@/components/Header';
import ScreenContainer from '@/components/ScreenContainer';
import { useAccessToken } from '@/context/AuthContext';
import { useLocationContext } from '@/context/LocationContext';
import { useUserLevelContext } from '@/context/UserLevelContext';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function EventsScreen({ navigation }) {
  //state for events, loading, error
  const { accessToken } = useAccessToken();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const { userType } = useUserLevelContext();

  const { coordinates } = useLocationContext();

  // function that calls the backend
  const loadEvents = useCallback(async () => {
    if (!accessToken) return;

    try {
      if (events.length === 0) {
        setLoading(true);
      } else {
        setRefreshing(true)
      }
      setError(null);

      const result = await ApiInteraction.get_events(accessToken, { lat: coordinates[1], lng: coordinates[2] });
      setEvents(prev => result || prev);
    } catch (err) {
      console.error('Failed to load events', err);
      if (events.length === 0) {
        setError(err.message || 'Failed to load events');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [accessToken, coordinates, events.length]);

  // load events when screen gains focus
  useFocusEffect(
    useCallback(() => {
      loadEvents();
    }, [loadEvents])
  );

  //render a single event row
  const renderEvent = ({ item }) => {
    let dateLabel = '';
    if (item.event_date) {
      const dt = new Date(item.event_date);
      dateLabel = dt.toLocaleString();
    }

    return (
      <View style={styles.eventCard}>
        <Text style={styles.eventTitle}>{item.title}</Text>
        {dateLabel ? <Text style={styles.eventMeta}>{dateLabel}</Text> : null}
        {item.description ? (
          <Text style={styles.eventDescription} numberOfLines={2}>
            {item.description}
          </Text>
        ) : null}
      </View>
    );
  };

  return (
    <ScreenContainer padded={false}>
      <View style={styles.body}>
        <Header title="Events" subtitle="Local happenings" secondSubtitle={"Your current location: " + coordinates[0]} />

        {userType !== 'regular' &&
          <TouchableOpacity style={styles.btn} onPress={() => {
            navigation.navigate('CreateEvent');
          }}>
            <Text style={styles.btnText}>+ New Event</Text>
          </TouchableOpacity>
        }

        {/*loading state */}
        {loading && (
          <View style={styles.center}>
            <ActivityIndicator />
            <Text style={styles.loadingText}>Loading events…</Text>
          </View>
        )}

        {/* error state with retry */}
        {!loading && error && (
          <View style={styles.center}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={loadEvents}>
              <Text style={styles.retryText}>Tap to retry</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* no-events state */}
        {!loading && !error && events.length === 0 && (
          <View style={styles.center}>
            <Text style={styles.emptyText}>No events yet.</Text>
          </View>
        )}

        {/* events list */}
        {!loading && !error && events.length > 0 && (
          <FlatList
            data={events}
            keyExtractor={(item) => String(item.id)}
            renderItem={renderEvent}
            contentContainerStyle={styles.listContent}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={loadEvents}/>
            }
          />
        )}
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  // updated styles
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 8,
    color: '#9ca3af',
  },
  errorText: {
    color: '#ef4444',
    textAlign: 'center',
    marginHorizontal: 24,
  },
  retryButton: {
    marginTop: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#4b5563',
  },
  retryText: {
    color: '#e5e7eb',
  },
  emptyText: {
    color: '#9ca3af',
  },
  eventCard: {
    backgroundColor: '#111827',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#1f2937',
  },
  eventTitle: {
    color: '#e5e7eb',
    fontWeight: '700',
    fontSize: 16,
    marginBottom: 4,
  },
  eventMeta: {
    color: '#9ca3af',
    fontSize: 12,
    marginBottom: 4,
  },
  eventDescription: {
    color: '#d1d5db',
    fontSize: 14,
  },
  body: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 0,
  },
  btn: {
    backgroundColor: '#38bdf8',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 12
  },
  btnText: { color: '#0b1220', fontWeight: '700' },
  listContent: {
    paddingBottom: 0,
  },
});
