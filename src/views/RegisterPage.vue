<template>
    <section class="container mt-10 mx-auto px-4 md:px-10">
      <div class="max-w-md mx-auto bg-white bg-white p-6 rounded-lg shadow-md">
        <h2 class="text-2xl font-bold text-dark-brown mb-6 text-center">Opret en ny konto</h2>
        <form @submit.prevent="handleRegister">
          <div class="mb-4">
            <label class="block text-black font-semibold mb-2" for="email">Email</label>
            <input
              v-model="email"
              type="email"
              id="email"
              class="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-light-green"
              required
            />
          </div>
          <div class="mb-4">
            <label class="block text-black font-semibold mb-2" for="password">Adgangskode</label>
            <input
              v-model="password"
              type="password"
              id="password"
              class="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-light-green"
              required
            />
          </div>
          <div class="mb-6">
            <label class="block text-black font-semibold mb-2" for="confirmPassword">Bekræft adgangskode</label>
            <input
              v-model="confirmPassword"
              type="password"
              id="confirmPassword"
              class="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-light-green"
              required
            />
          </div>
          <button
            type="submit"
            class="w-full bg-light-green text-white font-semibold py-3 rounded-lg hover:bg-dark-green transition"
          >
            Opret konto
          </button>
        </form>
        <p class="mt-6 text-center text-black">
          Har du allerede en konto?
          <router-link to="/login" class="text-dark-green font-semibold hover:underline">
            Log ind her
          </router-link>
        </p>
      </div>
    </section>
  </template>
  
  <script>
  import { ref } from 'vue';
  import { useAuthStore } from '../stores/authStore';
  import { useRouter } from 'vue-router';
  import { useToast } from 'vue-toastification';
  
  export default {
    name: 'RegisterPage',
    setup() {
      const email = ref('');
      const password = ref('');
      const confirmPassword = ref('');
      const authStore = useAuthStore();
      const router = useRouter();
      const toast = useToast();
  
      const handleRegister = async () => {
        if (password.value !== confirmPassword.value) {
          toast.error('Adgangskoderne stemmer ikke overens.');
          return;
        }
  
        try {
          await authStore.register(email.value, password.value);
          toast.success('Konto oprettet succesfuldt! Du er nu logget ind.');
          router.push('/'); // Redirect to homepage after successful registration
        } catch (error) {
          console.error('Registration failed:', error);
          toast.error('Registrering mislykkedes. Prøv igen.');
        }
      };
  
      return {
        email,
        password,
        confirmPassword,
        handleRegister,
      };
    },
  };
  </script>
  
  <style scoped>
  .bg-blog-post {
    background-color: #efede4; 
  }
  </style>