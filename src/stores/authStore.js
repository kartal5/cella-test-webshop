import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useAuthStore = defineStore('auth', () => {
  // Load user data from localStorage and convert it from a string to an object
  // Default to null if no data exists
  const user = ref(JSON.parse(localStorage.getItem('user')) || null);

  const login = async (email, password) => {
    // Simulate an API call for authentication
    // Replace this with your actual authentication logic
    if (email === 'user@example.com' && password === 'password') {
      user.value = { email };
      // Save user data to localStorage as a string when logging in
      localStorage.setItem('user', JSON.stringify(user.value));
    } else {
      throw new Error('Invalid email or password');
    }
  };

  const logout = () => {
    user.value = null;
    // Remove user data from localStorage to clear the session on logout.
    localStorage.removeItem('user');
  };

  // Use a getter function for derived state
  const isAuthenticated = () => {
    return user.value !== null;
  };

  return {
    user,
    login,
    logout,
    isAuthenticated,
  };
});