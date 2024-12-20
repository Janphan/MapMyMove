import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './screens/HomeScreen';
import SettingScreen from './screens/SettingScreen';
import Ionicons from '@expo/vector-icons/Ionicons';
import Feather from '@expo/vector-icons/Feather';
import CalendarComponent from './screens/Calendar';
import TrackMove from './screens/TrackMove';
import TrackList from './screens/TrackList';
import SignupScreen from './screens/SignupScreen';
import LoginScreen from './screens/LoginScreen';
import { auth } from './firebaseConfig';
import { useState, useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PaperProvider } from 'react-native-paper';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function AuthStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
    </Stack.Navigator>
  );
}
function TrackStack() {
  return (
    <Stack.Navigator initialRouteName="TrackMove">
      <Stack.Screen name="TrackMove" component={TrackMove} options={{ title: 'Track Move' }} />
      <Stack.Screen name="TrackList" component={TrackList} options={{ title: 'Track List' }} />
    </Stack.Navigator>
  );
}
function AppTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({  // Navigator can be customized using screenOptions
        tabBarIcon: ({ focused, color, size }) => {
          // Function tabBarIcon is given the focused state,
          // color and size params
          let iconName;
          if (route.name === 'Home') {
            iconName = 'home';
            return <Feather name={iconName} size={24} color={color} />;
          } else if (route.name === 'Settings') {
            iconName = 'settings';
            return <Feather name="settings" size={24} color={color} />
          } else if (route.name == "Calendar") {
            iconName = "calendar";
            return <Feather name="calendar" size={24} color={color} />
          } else if (route.name == "Start") {
            iconName = "play";
            return <Feather name="play" size={24} color={color} />
          }

          return <Ionicons name={iconName} size={size} color={color} />;   //it returns an icon component
        },
        // Customize active/inactive color and label style
        tabBarActiveTintColor: '#2c3e50',  // Active color
        tabBarInactiveTintColor: '#95a5a6', // Inactive color
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
      })}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Start" component={TrackStack} options={{ title: 'Track' }} />
      <Tab.Screen name="Calendar" component={CalendarComponent} />
      <Tab.Screen name="Settings" component={SettingScreen} />
    </Tab.Navigator>
  );
}
export default function App() {
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
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {user ? (
            <Stack.Screen name="AppTabs" component={AppTabs} />
          ) : (
            <Stack.Screen name="AuthStack" component={AuthStack} />
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}