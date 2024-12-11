import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useAuthStore = defineStore('auth', () => {
  // Load user data from localStorage (to persist sessions across page reloads) 
  // and convert it from a string to an object
  // Default to null if no data exists
  const user = ref(JSON.parse(localStorage.getItem('user')) || null);

  // Mock login: validates hardcoded credentials and updates user state (normally this calls a backend API)
  const login = async (email, password) => {
    // Simulate an API call for authentication (Mock login)
    // Replace this with actual authentication logic (when backend's registration API is ready)
    if (email === 'user@example.com' && password === 'password') {
      user.value = { email };
      // Save user data to localStorage as a string when logging in
      localStorage.setItem('user', JSON.stringify(user.value));
    } else {
      throw new Error('Invalid email or password');
    }
  };

  // Logs out the user by clearing state and localStorage (user is no longer authenticated)
  const logout = () => {
    user.value = null;
    // Remove user data from localStorage to clear the session on logout.
    localStorage.removeItem('user');
  };

  // register method to simulate user registration (Mock registration)
  // If registration is successful, we store the user just like in the login method.
  const register = async (email, password) => {
    // For now, we simply set the user as authenticated by creating a user object with the provided email (API call will be made in real scenario)
    user.value = { email };
    localStorage.setItem('user', JSON.stringify(user.value)); // accept the input and store it similarly to the login method
  };

  // getter function to determine if a user is currently authenticated
  // returns "true" if user.value is not null, otherwise "false"
  const isAuthenticated = () => {
    return user.value !== null;
  };

  return {
    user,
    login,
    register,
    logout,
    isAuthenticated,
  };
});