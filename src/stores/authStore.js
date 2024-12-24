import { defineStore } from 'pinia';
import { ref } from 'vue';
import { getFirestore, collection, query, where, getDocs, setDoc, doc } from 'firebase/firestore';
import { app } from '../firebase/init';

const db = getFirestore(app);
const usersCollection = collection(db, 'users');

export const useAuthStore = defineStore('auth', () => {
  // Load user data from localStorage, and convert it from a string to an object (to persist sessions across page reloads) 
  // Default to null if no data exists
  const user = ref(JSON.parse(localStorage.getItem('user')) || null);

  // Helper: Load user data from Firestore based on the email
  const fetchUserData = async (email) => {
    const q = query(usersCollection, where('email', '==', email));
    const querySnapshot = await getDocs(q);
    let userData = null;
    querySnapshot.forEach((docSnap) => {
      userData = docSnap.data();
    });
    return userData;
  };

  // Mock/Hybrid login that also fetches the user’s role from Firestore
  const login = async (email, password) => {
    // For an actual production app, replace this with real Firebase Auth calls (signInWithEmailAndPassword, etc.)
    if (email === 'user@example.com' && password === 'password') {
      // Simulate success, fetch from Firestore
      let userData = await fetchUserData(email);

      // If user doc doesn’t exist yet, create it with default role: "regular"
      if (!userData) {
        userData = { email, role: 'regular' };
        const docRef = doc(usersCollection); // auto-generated ID
        await setDoc(docRef, userData);
      }

      user.value = userData; // e.g. { email: "user@example.com", role: "regular" | "elite" }
      localStorage.setItem('user', JSON.stringify(user.value));
    } else {
      throw new Error('Invalid email or password');
    }
  };

  // Logs out the user
  const logout = () => {
    user.value = null;
    localStorage.removeItem('user');
  };

  // A simple register method that also creates a document in Firestore
  const register = async (email, password) => {
    // For now, let's store it in Firestore as a "regular" user
    const userData = { email, role: 'regular' };
    const docRef = doc(usersCollection); // auto-generated doc ID
    await setDoc(docRef, userData);

    user.value = userData;
    localStorage.setItem('user', JSON.stringify(user.value));
  };

  // If user is authenticated
  const isAuthenticated = () => {
    return user.value !== null;
  };

  // Helper to check if user is "elite"
  const isElite = () => {
    return user.value?.role === 'elite';
  };

  return {
    user,
    login,
    register,
    logout,
    isAuthenticated,
    isElite,
  };
});