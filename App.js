import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './screens/HomeScreen';
import SettingScreen from './screens/SettingScreen';
import Ionicons from '@expo/vector-icons/Ionicons';
import Feather from '@expo/vector-icons/Feather';
import CalendarComponent from './screens/Calendar';
import TrackMove from './screens/TrackMove';
import SignupScreen from './screens/SignupScreen';
import LoginScreen from './screens/LoginScreen';
import { auth } from './firebaseConfig';
import { useState, useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

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
      })}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Start" component={TrackMove} />
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
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <Stack.Screen name="AppTabs" component={AppTabs} />
        ) : (
          <Stack.Screen name="AuthStack" component={AuthStack} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}