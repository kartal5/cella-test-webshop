<template>
  <div id="product-card" class="bg-white p-4 rounded-3xl shadow-lg hover:shadow-2xl transition-shadow flex flex-col w-full h-full">
    <div class="flex-grow flex flex-col items-center">
      <img :src="product.image" :alt="product.name" class="w-full h-48 object-contain mb-4 rounded" />
      <h3 class="text-xl font-semibold text-center text-dark-brown px-2 pb-2">{{ product.name }}</h3>
      <p class="text-lg font-medium text-dark-brown mb-4 line-clamp-3 px-2">{{ product.description }}</p>
    </div>
    <p class="text-xl font-bold text-dark-green text-end mb-4 px-2">{{ product.price }}</p>

    <!-- "Læg i kurv" button -->
    <button id="add-to-cart-btn"
      @click="addToCart(product)"
      :disabled="requiresSelection(product)"
      :class="{
        'bg-light-green text-white font-semibold py-2 px-4 rounded w-full hover:bg-dark-green transition': true,
        'opacity-50 cursor-not-allowed': requiresSelection(product),
      }">
      Læg i kurv
    </button>
    
    <!-- "Læs Mere" button -->
    <router-link id="read-more-btn" :to="`/product/${product.id}`" class="bg-light-brown text-white font-semibold py-2 px-4 rounded w-full hover:bg-dark-brown transition mt-2 text-center block">
      Læs Mere
    </router-link>
  </div>
</template>

<script>
import { useCartStore } from '../stores/cartStore';
import { useToast } from 'vue-toastification';

export default {
  name: 'ProductCard',
  props: {
    product: Object,
  },
  setup() {
    const cartStore = useCartStore();
    const toast = useToast();
    
    const addToCart = (product) => {
      if (cartStore.cartItems.find(item => item.id === product.id)) {
        toast.warning('Produktet er allerede tilføjet i kurven!', {
          icon: '⚠️',
          toastClassName: 'bg-[#e6dfd4] text-[#5e4b3f] font-bold',
        });
      } else {
        cartStore.addToCart(product);
        toast.success('Produktet er tilføjet i kurven!', {
          icon: '✔️',
          toastClassName: 'bg-[#95ad81] text-white font-bold',
        });
      }
    };

    // Function to determine if selection is required
    const requiresSelection = (product) => {
      if (product.price === 'Kontakt for pris') {
        return true;
      }

      const productsRequiringSelection = [31, 36, 37, 38];
      // Convert product.id to a number for the check
      return productsRequiringSelection.includes(parseInt(product.id, 10));
    };

    return { addToCart, requiresSelection };
  },
};
</script>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.bg-add-to-cart-btn {
  background-color: #95AD81;
  color: white;
}
</style>