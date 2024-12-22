<template>
    <section class="container mx-auto mt-10 px-4 md:px-10" v-if="!orderCompleted">
      <h2 class="text-3xl font-bold text-navbar-green mb-6">Betaling</h2>
  
      <!-- Grid container: left side for form, right side for order summary -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
  
        <!-- LEFT: Billing & Shipping Form -->
        <div class="bg-white p-6 rounded-lg shadow-md">
          <h3 class="text-xl font-semibold text-dark-brown mb-4">Leveringsoplysninger</h3>
          <form @submit.prevent="handlePayment" class="space-y-4">
  
            <!-- Shipping Info -->
            <div class="mb-4">
              <label class="block text-gray-800 font-medium" for="fullName">Fulde Navn</label>
              <input
                v-model="fullName"
                type="text"
                id="fullName"
                class="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-navbar-green"
                required
              />
            </div>
  
            <div class="mb-4">
              <label class="block text-gray-800 font-medium" for="address">Adresse</label>
              <input
                v-model="address"
                type="text"
                id="address"
                class="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-navbar-green"
                required
              />
            </div>
  
            <div class="mb-4 flex space-x-4">
              <div class="flex-1">
                <label class="block text-gray-800 font-medium" for="postalCode">Postnr.</label>
                <input
                  v-model="postalCode"
                  type="text"
                  id="postalCode"
                  class="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-navbar-green"
                  required
                />
              </div>
              <div class="flex-1">
                <label class="block text-gray-800 font-medium" for="city">By</label>
                <input
                  v-model="city"
                  type="text"
                  id="city"
                  class="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-navbar-green"
                  required
                />
              </div>
            </div>
  
            <div class="mb-4">
              <label class="block text-gray-800 font-medium" for="country">Land</label>
              <input
                v-model="country"
                type="text"
                id="country"
                class="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-navbar-green"
                required
              />
            </div>
  
            <hr class="my-4" />
  
            <!-- Payment Info -->
            <h3 class="text-xl font-semibold text-dark-brown mb-4">Betalingsoplysninger</h3>
            <div class="mb-4">
              <label class="block text-gray-800 font-medium" for="cardNumber">Kortnummer</label>
              <input
                v-model="cardNumber"
                type="text"
                id="cardNumber"
                maxlength="19"
                placeholder="1234 5678 9012 3456"
                class="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-navbar-green"
                required
              />
            </div>
  
            <div class="mb-4 flex space-x-4">
              <div class="flex-1">
                <label class="block text-gray-800 font-medium" for="expiryDate">Udløbsdato (MM/ÅÅ)</label>
                <input
                  v-model="expiryDate"
                  type="text"
                  id="expiryDate"
                  maxlength="5"
                  placeholder="MM/YY"
                  class="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-navbar-green"
                  required
                />
              </div>
              <div class="flex-1">
                <label class="block text-gray-800 font-medium" for="cvv">CVV</label>
                <input
                  v-model="cvv"
                  type="text"
                  id="cvv"
                  maxlength="3"
                  placeholder="123"
                  class="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-navbar-green"
                  required
                />
              </div>
            </div>
  
            <!-- Payment Button -->
            <div class="text-right mt-6">
              <button
                type="submit"
                class="bg-light-green text-white font-semibold py-3 px-6 rounded hover:bg-dark-green transition"
              >
                Betal nu
              </button>
            </div>
          </form>
        </div>
  
        <!-- RIGHT: Order Summary -->
        <div class="bg-white p-6 rounded-lg shadow-md">
          <h3 class="text-xl font-semibold text-dark-brown mb-4">Ordresammendrag</h3>
          <div v-for="(item, index) in cartItems" :key="index" class="flex justify-between border-b py-2">
            <div>
              <p class="font-medium text-gray-800">{{ item.name }}</p>
              <p class="text-sm text-gray-500">Antal: {{ item.quantity }}</p>
            </div>
            <p class="font-medium text-navbar-green">{{ item.price }}</p>
          </div>
          <div class="mt-6 flex justify-between items-center">
            <p class="text-lg font-semibold">Total:</p>
            <p class="text-xl font-bold text-navbar-green">DKK {{ cartTotal }}</p>
          </div>
        </div>
      </div>
    </section>
  
    <!-- Order Completion Screen (thank you) -->
    <section
      v-else
      class="container mx-auto mt-10 px-4 md:px-10 text-center bg-white p-6 rounded-lg shadow-md"
    >
      <h2 class="text-3xl font-bold text-navbar-green mb-4">Tak for din ordre!</h2>
      <p class="text-lg text-gray-700 mb-6">
        Din betaling er gennemført, og vi er i gang med at pakke din ordre.
      </p>
      <router-link
        to="/"
        class="bg-light-green text-white font-semibold py-3 px-6 rounded hover:bg-dark-green transition"
      >
        Tilbage til Forsiden
      </router-link>
    </section>
  </template>
  
  <script>
  import { ref, computed } from 'vue';
  import { useCartStore } from '../stores/cartStore';
  import { useRouter } from 'vue-router';
  
  export default {
    name: 'PaymentPage',
    setup() {
      const router = useRouter();
      const cartStore = useCartStore();
  
      // 1) SHIPPING / BILLING DATA
      const fullName = ref('');
      const address = ref('');
      const postalCode = ref('');
      const city = ref('');
      const country = ref('Danmark');
  
      // 2) CREDIT CARD DATA
      const cardNumber = ref('');
      const expiryDate = ref('');
      const cvv = ref('');
  
      // 3) ORDER COMPLETION
      const orderCompleted = ref(false);
  
      // Access cart details
      const cartItems = computed(() => cartStore.cartItems);
      const cartTotal = computed(() => cartStore.cartTotal.toFixed(2));
  
      // 4) Fake "payment" submission
      const handlePayment = () => {
        // For a real integration, call a payment API here
        // simulate success
        setTimeout(() => {
            // Clear the cart
            cartStore.cartItems.splice(0, cartStore.cartItems.length);

            orderCompleted.value = true;
        }, 800);
        };

  
      return {
        fullName,
        address,
        postalCode,
        city,
        country,
        cardNumber,
        expiryDate,
        cvv,
        orderCompleted,
        cartItems,
        cartTotal,
        handlePayment,
      };
    },
  };
  </script>
  
  <style scoped>
  /* Add any custom styling here */
  </style>
  