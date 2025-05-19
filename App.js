import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { DefaultTheme, DarkTheme, Provider as PaperProvider } from 'react-native-paper';
import { useState, useEffect, useContext } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import Feather from '@expo/vector-icons/Feather';

import HomeScreen from './screens/HomeScreen';
import SettingScreen from './screens/SettingScreen';
import CalendarComponent from './screens/Calendar';
import TrackMove from './screens/TrackMove';
import TrackList from './screens/TrackList';
import SignupScreen from './screens/SignupScreen';
import LoginScreen from './screens/LoginScreen';
import { auth } from './firebaseConfig';
import { ThemeProvider, ThemeContext } from './context/ThemeContext';
import TrackDetail from './screens/TrackDetail';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Tab Navigator for the main app
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'Home') {
            iconName = 'home';
            return <Feather name={iconName} size={size} color={color} />;
          } else if (route.name === 'Settings') {
            iconName = 'settings';
            return <Feather name={iconName} size={size} color={color} />;
          } else if (route.name === 'Calendar') {
            iconName = 'calendar';
            return <Feather name={iconName} size={size} color={color} />;
          } else if (route.name === 'Track') {
            iconName = 'play';
            return <Feather name={iconName} size={size} color={color} />;
          }
        },
        tabBarActiveTintColor: '#2c3e50',
        tabBarInactiveTintColor: '#95a5a6',
        tabBarStyle: {
          backgroundColor: '#E6E6FA',
          paddingBottom: 8,
          height: 55,
          shadowColor: '#000',
          shadowOpacity: 0.1,
          shadowRadius: 8,
          borderTopWidth: 0,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '500',
          paddingBottom: 5,
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
      <Tab.Screen name="Track" component={TrackStack} options={{ title: 'Track', headerShown: false }} />
      <Tab.Screen name="Calendar" component={CalendarComponent} options={{ headerShown: false }} />
      <Tab.Screen name="Settings" component={SettingScreen} options={{ headerShown: false }} />
    </Tab.Navigator>
  );
}

// Stack Navigator for the Track screens
function TrackStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="TrackMove" component={TrackMove} options={{ title: 'Track Move', headerShown: false }} />
      <Stack.Screen name="TrackList" component={TrackList} options={{ title: 'Track List', headerShown: false }} />
      <Stack.Screen name="TrackDetail" component={TrackDetail} options={{ title: 'Track Detail', headerShown: false }} />
    </Stack.Navigator>
  );
}

// Main App Component
export default function App() {
  return (
    <ThemeProvider>
      <MainApp />
    </ThemeProvider>
  );
}

function MainApp() {
  const { isDarkMode } = useContext(ThemeContext); // Access dark mode state
  const theme = isDarkMode ? DarkTheme : DefaultTheme; // Dynamically set theme
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      setUser(authUser);
      if (initializing) setInitializing(false); // Disable loading
    });
    return unsubscribe;
  }, []);

  if (initializing) return null;

  return (
    <PaperProvider theme={theme}>
      <NavigationContainer theme={theme}>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {user ? (
            // Main app tabs for authenticated users
            <Stack.Screen name="MainTabs" component={MainTabs} />
          ) : (
            // Authentication screens for unauthenticated users
            <>
              <Stack.Screen name="Login" component={LoginScreen} />
              <Stack.Screen name="Signup" component={SignupScreen} />
              <Stack.Screen name="Home" component={HomeScreen} />

            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}