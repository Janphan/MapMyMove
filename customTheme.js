// customTheme.js
import { DefaultTheme } from 'react-native-paper';

const customTheme = {
    ...DefaultTheme,
    fonts: {
        regular: {
            fontFamily: 'YourCustomFont-Regular',
            fontWeight: 'normal',
        },
        medium: {
            fontFamily: 'YourCustomFont-Medium',
            fontWeight: 'normal',
        },
        light: {
            fontFamily: 'YourCustomFont-Light',
            fontWeight: 'normal',
        },
        thin: {
            fontFamily: 'YourCustomFont-Thin',
            fontWeight: 'normal',
        },
        // Optional workaround for labelLarge or other custom styles
        labelLarge: {
            fontFamily: 'YourCustomFont-Bold', // Or any variant you want
            fontSize: 16, // Customize size for this specific style
            fontWeight: 'bold',
        },
    },
    colors: {
        ...DefaultTheme.colors,
        primary: '#3498db',
    },
};

export default customTheme;
