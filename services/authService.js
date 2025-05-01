// Service for user authentication (Firebase or OAuth)
// services/authService.js
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '../firebaseConfig'; // Firebase auth initialized in firebaseConfig.js

// Sign-Up Function
export const signUp = async (email, password) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        return userCredential; // Return the full userCredential object
    } catch (error) {
        console.error('Error signing up:', error.message);
        throw error;
    }
};

// Log In Function
export const login = async (email, password) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return userCredential.user; // Return user info if login is successful
    } catch (error) {
        console.error('Error logging in:', error.message);
        throw error;
    }
};

// Log Out Function
export const logout = async () => {
    try {
        await signOut(auth);
        console.log('User logged out');
    } catch (error) {
        console.error('Error signing out:', error.message);
        throw error;
    }
};
