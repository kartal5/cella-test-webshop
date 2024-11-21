<template>
  <section class="container mt-10 mx-auto px-4 md:px-10">
    <div v-if="product" class="product-detail">
      <!-- Adjust the image size with a CSS class -->
      <h2 class="text-4xl font-bold text-navbar-green mb-4">{{ product.name }}</h2>
      <img :src="product.image" :alt="product.name" class="product-image mb-4 rounded" />
      <p class="text-2xl font-bold text-navbar-green mt-4">{{ product.price }}</p>
      <p class="text-lg text-gray-700 mb-6">
        <span v-for="(line, index) in formattedDescription" :key="index">
          {{ line }}
          <br v-if="index < formattedDescription.length - 1" />
        </span>
      </p>
      
      <!-- Buttons -->
      <div class="flex items-center gap-2 mt-4 mb-4">
        <button
          @click="goBack"
          class="bg-red-500 text-white font-semibold py-2 px-4 rounded hover:bg-red-600 transition"
        >
          Tilbage
        </button>
        <button
          @click="addToCart(product)"
          class="bg-navbar-green text-white font-semibold py-2 px-4 rounded hover:bg-green-700 transition"
        >
          Læg i kurv
        </button>
      </div>
    </div>
    <p v-else class="text-center text-gray-600 mt-6">Produktet blev ikke fundet.</p>
  </section>
</template>

<script>
import { useProductStore } from '../stores/productStore';
import { useCartStore } from '../stores/cartStore';
import { useRoute, useRouter } from 'vue-router';

export default {
  name: 'ProductPage',
  setup() {
    const route = useRoute();

    const router = useRouter();

    const { allProducts } = useProductStore();
    const product = allProducts.value.find((p) => p.id === Number(route.params.id));

    const cartStore = useCartStore();
    const addToCart = (product) => {
      cartStore.addToCart(product);
    };

    const goBack = () => {
      router.go(-1); // Navigate to the previous page
    };

    const formattedDescription = product?.fullDescription
      ? product.fullDescription.split('\n')
      : product.description.split('\n');

    return { product, addToCart, goBack, formattedDescription };
  },
};
</script>

<style scoped>
.product-image {
  max-width: 100%; /* Ensures responsiveness */
  width: 320px; /* Fixed size for desktop */
  height: auto; /* Maintains aspect ratio */
  display: block;
  margin: 0 auto; /* Centers the image */
}

.product-detail {
  max-width: 900px;
  margin: auto;
}
</style>
