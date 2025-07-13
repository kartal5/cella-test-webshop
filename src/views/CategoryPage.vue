<template>
  <section class="container mx-auto mt-10 px-4 md:px-10">
    <!-- Heading for Category -->
    <h2 class="text-3xl font-bold text-dark-brown mb-8">
      {{ pageTitle }}
    </h2>

    <div class="flex flex-col lg:flex-row gap-8">
      <!-- LEFT: Subcategory Menu -->
      <aside 
        class="w-full lg:w-1/4 bg-white p-4 rounded-lg shadow-md h-fit lg:sticky top-4 self-start"
      >
        <h3 class="text-xl font-semibold text-dark-brown mb-4">
          Underkategorier
        </h3>
        <ul class="space-y-2">
          <!-- “Show All” subcategory item -->
          <li>
            <button
              class="w-full text-left px-3 py-2 rounded hover:bg-gray-100"
              :class="{'bg-light-brown text-white': selectedSubcategory === null}"
              @click="selectedSubcategory = null"
            >
              Vis alle
            </button>
          </li>

          <!-- Loop over subcategories -->
          <li v-for="subcat in sortedSubcategories" :key="subcat">
            <button
              class="w-full text-left px-3 py-2 rounded hover:bg-gray-100"
              :class="{'bg-light-brown text-white': selectedSubcategory === subcat}"
              @click="selectedSubcategory = subcat"
            >
              {{ subcat }}
            </button>
          </li>
        </ul>
      </aside>

      <!-- RIGHT: Products Grid -->
      <div class="w-full lg:w-3/4">
        <div v-if="filteredProducts.length > 0">
          <div class="category-grid">
            <ProductCard
              v-for="(product, idx) in filteredProducts"
              :key="idx"
              :product="product"
            />
          </div>
        </div>
        <p v-else class="text-black text-center mt-10">
          Ingen produkter at vise i denne underkategori.
        </p>
      </div>
    </div>
  </section>
</template>

<script>
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useProductStore } from '../stores/productStore';
import ProductCard from '../components/ProductCard.vue';

export default {
  name: 'CategoryPage',
  components: {
    ProductCard,
  },
  setup() {
    const route = useRoute();
    const productStore = useProductStore();

    // The main category name from the route param, e.g. “mennesker”
    const currentCategory = route.params.name;

    // Pull subcategories for this category
    const subcategories = computed(() =>
      productStore.getSubcategoriesByCategory(currentCategory)
    );

    // Sort subcategories, placing “Andre produkter” at the end
    const sortedSubcategories = computed(() => {
      return [...subcategories.value].sort((a, b) => {
        if (a === 'Andre produkter') return 1;
        if (b === 'Andre produkter') return -1;
        return a.localeCompare(b);
      });
    });

    // State for which subcategory is selected (null = “show all”)
    const selectedSubcategory = ref(null);

    // All products for the current category
    const allCategoryProducts = computed(() =>
      productStore.getProductsByCategory(currentCategory)
    );

    // Filter based on selectedSubcategory
    const filteredProducts = computed(() => {
      if (!selectedSubcategory.value) {
        // Show all products if no subcategory is selected
        return allCategoryProducts.value;
      }
      // Show only those in the chosen subcategory
      return productStore.getProductsByCategoryAndSubcategory(
        currentCategory,
        selectedSubcategory.value
      );
    });

    // For the heading, capitalize “mennesker” => “Mennesker”
    const pageTitle = computed(() => {
      return currentCategory.charAt(0).toUpperCase() + currentCategory.slice(1);
    });

    return {
      pageTitle,
      sortedSubcategories,
      selectedSubcategory,
      filteredProducts,
    };
  },
};
</script>

<style scoped>
/* 
  custom CSS to control the product grid.: 
  3 columns on large screens, 2 columns on medium, 1 column on small.
*/
.category-grid {
  display: grid;
  gap: 1.5rem;
}

@media (min-width: 1024px) {
  .category-grid {
    grid-template-columns: repeat(3, minmax(200px, 1fr));
  }
}

@media (min-width: 768px) and (max-width: 1023px) {
  .category-grid {
    grid-template-columns: repeat(2, minmax(200px, 1fr));
  }
}

@media (max-width: 767px) {
  .category-grid {
    grid-template-columns: repeat(1, minmax(200px, 1fr));
  }
}
</style>
