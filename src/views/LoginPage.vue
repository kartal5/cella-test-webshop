<template>
  <section class="container mt-10 mx-auto px-4 md:px-10">
    <div class="max-w-md mx-auto bg-blog-post bg-white p-6 rounded-lg shadow-md">
      <h2 class="text-2xl font-bold text-navbar-green mb-6 text-center">Log ind på din konto</h2>
      <form @submit.prevent="handleLogin">
        <div class="mb-4">
          <label class="block text-gray-700 font-semibold mb-2" for="email">Email</label>
          <input
            v-model="email"
            type="email"
            id="email"
            class="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-navbar-green"
            required
          />
        </div>
        <div class="mb-6">
          <label class="block text-gray-700 font-semibold mb-2" for="password">Adgangskode</label>
          <input
            v-model="password"
            type="password"
            id="password"
            class="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-navbar-green"
            required
          />
        </div>
        <button
          type="submit"
          class="w-full bg-navbar-green text-white font-semibold py-3 rounded-lg hover:bg-green-700 transition"
        >
          Log ind
        </button>
      </form>
      <p class="mt-6 text-center text-gray-600">
        Har du ikke en konto?
        <router-link to="/register" class="text-navbar-green font-semibold hover:underline">
          Registrer dig her
        </router-link>
      </p>
    </div>
  </section>
</template>

<script>
import { ref } from 'vue';
import { useAuthStore } from '../stores/authStore';
import { useRouter } from 'vue-router';

export default {
  name: 'LoginPage',
  setup() {
    const email = ref('');
    const password = ref('');
    const authStore = useAuthStore();
    const router = useRouter();

    const handleLogin = async () => {
      try {
        await authStore.login(email.value, password.value);
        router.push('/'); // Redirect to homepage after successful login
      } catch (error) {
        // Handle login error (e.g., show a notification)
        console.error('Login failed:', error);
      }
    };

    return {
      email,
      password,
      handleLogin,
    };
  },
};
</script>

<style scoped>
.bg-blog-post {
  background-color: #efede4; 
}
</style>