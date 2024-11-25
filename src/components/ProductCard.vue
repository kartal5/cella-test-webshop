<template>
  <div class="bg-white p-4 rounded-3xl shadow-lg hover:shadow-2xl transition-shadow flex flex-col w-full h-full">
    <div class="flex-grow flex flex-col items-center">
      <img :src="product.image" :alt="product.name" class="w-full h-48 object-contain mb-4 rounded" />
      <h3 class="text-lg font-semibold text-center text-gray-900">{{ product.name }}</h3>
      <p class="text-center text-gray-600 mb-4 line-clamp-3">{{ product.description }}</p>
    </div>
    <p class="text-lg font-bold text-navbar-green text-center mb-4">{{ product.price }}</p>
    <!-- Updated "Læg i kurv" button -->
    <button @click="addToCart(product)" class="bg-add-to-cart-btn text-white font-semibold py-2 px-4 rounded w-full hover:bg-green-700 transition">
      Læg i kurv
    </button>
    <!-- "Læs Mere" button -->
    <router-link :to="`/product/${product.id}`" class="bg-blue-400 text-white font-semibold py-2 px-4 rounded w-full hover:bg-blue-600 transition mt-2 text-center block">
      Læs Mere
    </router-link>
  </div>
</template>

<script>
import { useCartStore } from '../stores/cartStore';

export default {
  name: 'ProductCard',
  props: {
    product: Object,
  },
  setup() {
    const cartStore = useCartStore();
    const addToCart = (product) => {
      cartStore.addToCart(product);
    };

    return { addToCart };
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
