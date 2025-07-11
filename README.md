# MapMyMove
MapMyMove is a mobile application that allows users to track their physical movements, log daily activities, and organize events on a calendar. 
Designed for users who want to monitor their movement and schedule, the app offers a seamless experience with user authentication, an interactive calendar, and intuitive navigation.

## Features

**User Authentication**: Secure user registration and login functionality with Firebase Authentication.

**Movement Tracking:** Track daily movements with easy logging, so users can monitor their activity levels.

**Calendar Integration:** Plan, view, and manage movements and events on a calendar, helping users keep track of past and upcoming activities.

**Tab Navigation:** Easy access to different sections of the app, including Home, Start, Calendar, and Settings, with customizable icons.

**Settings Customization:** Allows users to configure their preferences within the app for a personalized experience.
<p align="center">
  <img src="./demo/Login.jpg" alt="Login" width="22%" />
  <img src="./demo/home.jpg" alt="Homepage" width="22%" />
  <img src="./demo/trackmove.jpg" alt="Trackmove" width="22%" />
  <img src="./demo/tracklist.jpg" alt="Tracklist" width="22%" />
</p>

## Getting Started

Follow these steps to clone the repository and run the app on a mobile device.
- git clone https://github.com/Janphan/MapMyMove.git
- cd MapMyMove
- npm install
- npx expo start
- Install the Expo Go App on your mobile device
- Open the App on Your Device:
- Scan the QR code shown in your terminal or in the Expo DevTools in your browser with your mobile device's camera (for iOS) or Expo Go app (for Android).
- The app should open in Expo Go, allowing you to test the application on your mobile device.
## Technology Stack
### Frontend:

**React Native:** Cross-platform mobile app development for iOS and Android.

**React Navigation:** Handles stack and tab navigation for an intuitive user experience.
### Backend:

**Firebase Authentication:** Secure, easy-to-implement authentication for user login and registration.

**react-native-maps:** For displaying the route on a map.

### UI and Icons:

**React Native Components and Styling:** Custom components and styles for a user-friendly interface.

## App Structure

### Main App Navigation:

**AuthStack**: Manages the Login and Signup screens for unauthenticated users.
**MainTabs**: The main app tab navigation for authenticated users, which includes:
- Home: Displays the HomeScreen.
- Track: A nested stack (TrackStack) for tracking movements, including:
- TrackMove: For tracking movements.
- TrackList: For listing tracked movements.
- Calendar: Displays the CalendarComponent.
- Settings: Displays the SettingScreen.
- TrackStack: A nested Stack.Navigator inside the "Track" tab, managing TrackMove and TrackList.

### Screens:

**HomeScreen:** User’s main dashboard with a summary of recent activities.

**TrackMove:** Allows users to start tracking their movements.

**Calendar:** Displays scheduled activities and movements.

**Settings:** Provides customizable options for user preferences.

**LoginScreen and SignupScreen:** Handle user authentication

## Usage

**Sign Up / Log In:** Create an account or log in to access the app’s features.


**Track Movements:** Start tracking your movements in the "Start" section.

**View Calendar:** Review past movements and plan upcoming ones using the Calendar.

**Customize Settings:** Modify app preferences in the Settings section, include:
- Dark Theme/ Light Theme
- Change Password
- Logout
- Edit profile
