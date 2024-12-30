import { defineStore } from 'pinia';
import { ref } from 'vue';
import { app } from '../firebase/init';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  signOut,
} from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

const auth = getAuth(app);
const db = getFirestore(app);

// Save users metadata to Firestore
export const useAuthStore = defineStore('auth', () => {
  const user = ref(JSON.parse(localStorage.getItem('user')) || null);

  const register = async (email, password) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;

    // Add user to Firestore `users` collection
    const userData = {
      email: firebaseUser.email,
      role: 'regular',
      verified: firebaseUser.emailVerified,
      createdAt: new Date().toISOString(),
    };
    await setDoc(doc(db, 'users', firebaseUser.uid), userData);

    await sendEmailVerification(firebaseUser); // Send verification email
    user.value = { email: firebaseUser.email, verified: firebaseUser.emailVerified };
    localStorage.setItem('user', JSON.stringify(user.value));
  };

  const login = async (email, password) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;
    if (!firebaseUser.emailVerified) {
      throw new Error('Email not verified. Please check your inbox.');
    }
    user.value = { email: firebaseUser.email, verified: firebaseUser.emailVerified };
    localStorage.setItem('user', JSON.stringify(user.value));
  };

  const logout = async () => {
    await signOut(auth);
    user.value = null;
    localStorage.removeItem('user');
  };

  const isAuthenticated = () => user.value !== null;
  const isVerified = () => user.value?.verified;

  return {
    user,
    register,
    login,
    logout,
    isAuthenticated,
    isVerified,
  };
});