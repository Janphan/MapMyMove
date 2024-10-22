import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './screens/HomeScreen';
import SettingScreen from './screens/SettingScreen';
import Ionicons from '@expo/vector-icons/Ionicons';
import Feather from '@expo/vector-icons/Feather';
import Calendar from './screens/Calendar';
import TrackMove from './screens/TrackMove';
import SignupScreen from './screens/SignupScreen';
import LoginScreen from './screens/LoginScreen';
import { auth } from './firebaseConfig';
import { useState, useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
export default function App() {
  const [user, setUser] = useState(null);
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      setUser(authUser); // Set the user if authenticated, otherwise null
    });
    return unsubscribe; // Cleanup subscription on unmount
  }, []);

  function AuthStack() {
    return (
      <Stack.Navigator>
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Signup" component={SignupScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
    );
  }
  function AppTabs() {
    return (
      <NavigationContainer>
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
          <Tab.Screen name="Calendar" component={Calendar} />
          <Tab.Screen name="Settings" component={SettingScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    );
  }
  return (
    <NavigationContainer>
      {user ? <AppTabs /> : <AuthStack />}
    </NavigationContainer>
  );
}