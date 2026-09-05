import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { useStore } from '../store/StoreProvider';
import { useTheme } from '../theme/ThemeProvider';
import { BookingScreen } from '../screens/BookingScreen';
import { FavoritesScreen } from '../screens/FavoritesScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { MapScreen } from '../screens/MapScreen';
import { MyScreen } from '../screens/MyScreen';
import { NotificationsScreen } from '../screens/NotificationsScreen';
import { OnboardingScreen } from '../screens/OnboardingScreen';
import { RegisterScreen } from '../screens/RegisterScreen';
import { RequestsScreen } from '../screens/RequestsScreen';
import { SpaceDetailScreen } from '../screens/SpaceDetailScreen';
import { VehiclesScreen } from '../screens/VehiclesScreen';
import { TabBar } from './TabBar';
import type { RootStackParamList, TabParamList } from './types';

const Tab = createBottomTabNavigator<TabParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();

function Tabs() {
  return (
    <Tab.Navigator
      tabBar={(props) => <TabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Map" component={MapScreen} />
      <Tab.Screen name="Register" component={RegisterScreen} />
      <Tab.Screen name="Requests" component={RequestsScreen} />
      <Tab.Screen name="My" component={MyScreen} />
    </Tab.Navigator>
  );
}

export function RootNavigator() {
  const { colors } = useTheme();
  const { state } = useStore();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      {state.firstRun ? (
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      ) : null}
      <Stack.Screen name="Tabs" component={Tabs} />
      <Stack.Screen name="SpaceDetail" component={SpaceDetailScreen} />
      <Stack.Screen
        name="Booking"
        component={BookingScreen}
        options={{ presentation: 'modal', animation: 'slide_from_bottom' }}
      />
      <Stack.Group
        screenOptions={{
          headerShown: true,
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.ink,
          headerTitleStyle: { fontWeight: '900' },
          headerShadowVisible: false,
          headerBackButtonDisplayMode: 'minimal',
        }}
      >
        <Stack.Screen name="Notifications" component={NotificationsScreen} options={{ title: '알림' }} />
        <Stack.Screen name="Favorites" component={FavoritesScreen} options={{ title: '찜한 공간' }} />
        <Stack.Screen name="Vehicles" component={VehiclesScreen} options={{ title: '내 차량' }} />
      </Stack.Group>
    </Stack.Navigator>
  );
}
