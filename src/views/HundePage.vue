<template>
  <section class="container mt-10 mx-auto px-4 md:px-10">
    <h2 class="text-3xl font-bold text-left text-navbar-green mb-8">Produkter til Hunde</h2>

    <!-- Loop through each subcategory and display products -->
    <div v-for="(subcategory, index) in sortedSubcategories" :key="index" class="mb-10">
      <h3 class="text-2xl font-semibold mb-4">{{ subcategory }}</h3>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        <ProductCard
          v-for="(product, idx) in getProductsBySubcategory(subcategory)"
          :key="idx"
          :product="product"
        />
      </div>
    </div>
  </section>
</template>

<script>
import ProductCard from '../components/ProductCard.vue';
import { useProductStore } from '../stores/productStore';

export default {
  name: 'HundePage',
  components: {
    ProductCard,
  },
  setup() {
    const { getSubcategoriesByCategory, getProductsByCategoryAndSubcategory } = useProductStore();

    // Get all subcategories for 'hunde'
    const subcategories = getSubcategoriesByCategory('hunde');

    // Sort subcategories so "Andre produkter" appears last
    const sortedSubcategories = [...subcategories].sort((a, b) => {
      if (a === 'Andre produkter') return 1; // Move "Andre produkter" to the end
      if (b === 'Andre produkter') return -1;
      return 0;
    });

    // Method to get products by subcategory for 'hunde' category
    const getProductsBySubcategory = (subcategory) => {
      return getProductsByCategoryAndSubcategory('hunde', subcategory);
    };

    return {
      sortedSubcategories,
      getProductsBySubcategory,
    };
  },
};
</script>

<style scoped>
.grid {
  display: grid;
  gap: 1.5rem;
}

@media (min-width: 1024px) {
  .grid {
    grid-template-columns: repeat(4, minmax(220px, 1fr));
  }
}

@media (min-width: 768px) and (max-width: 1023px) {
  .grid {
    grid-template-columns: repeat(3, minmax(220px, 1fr));
  }
}

@media (min-width: 640px) and (max-width: 767px) {
  .grid {
    grid-template-columns: repeat(2, minmax(220px, 1fr));
  }
}

@media (max-width: 639px) {
  .grid {
    grid-template-columns: repeat(1, minmax(220px, 1fr));
  }
}
</style>
