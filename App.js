import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './screens/HomeScreen';
import SettingScreen from './screens/SettingScreen';
import Ionicons from '@expo/vector-icons/Ionicons';
import Feather from '@expo/vector-icons/Feather';
import Calendar from './screens/Calendar';
import TrackMove from './screens/TrackMove';

const Tab = createBottomTabNavigator();
export default function App() {
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