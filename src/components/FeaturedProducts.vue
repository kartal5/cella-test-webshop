<template>
  <section class="container mt-10 mx-auto px-4 md:px-10">
    <h2 class="text-3xl font-bold text-center text-navbar-green mb-8">UDVALGTE PRODUKTER</h2>
    <div
      v-if="randomProducts.length > 0"
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      <ProductCard
        v-for="product in randomProducts"
        :key="product.id"
        :product="product"
      />
    </div>
    <p v-else class="text-center text-gray-600 mt-6">Ingen produkter at vise.</p>
  </section>
</template>

<script>
import { computed } from 'vue';
import { useProductStore } from '../stores/productStore';
import ProductCard from './ProductCard.vue';

export default {
  name: 'FeaturedProducts',
  components: {
    ProductCard,
  },
  setup() {
    const productStore = useProductStore();
    const allProducts = productStore.allProducts;

    // Computed property to get a random selection of products
    const randomProducts = computed(() => {
      const productsArray = allProducts.value;
      if (productsArray.length === 0) return [];
      // Shuffle the products array
      const shuffled = [...productsArray].sort(() => 0.5 - Math.random());
      // Return the first N products (e.g., 8 products)
      return shuffled.slice(0, 8);
    });

    return {
      randomProducts,
    };
  },
};
</script>

<style scoped>
.grid {
  display: grid;
  gap: 1.5rem;
}

@media (min-width: 1024px) { /* For large screens and up */
  .grid {
    grid-template-columns: repeat(3, minmax(220px, 1fr));
  }
}

@media (min-width: 768px) and (max-width: 1023px) { /* For medium screens */
  .grid {
    grid-template-columns: repeat(3, minmax(220px, 1fr));
  }
}

@media (min-width: 640px) and (max-width: 767px) { /* For small screens */
  .grid {
    grid-template-columns: repeat(2, minmax(220px, 1fr));
  }
}

@media (max-width: 639px) { /* For extra small screens */
  .grid {
    grid-template-columns: repeat(1, minmax(220px, 1fr));
  }
}
</style>

