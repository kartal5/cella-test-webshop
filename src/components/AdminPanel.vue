<template>
    <section class="container mt-10 mx-auto px-4 md:px-10">
      <h2 class="text-3xl font-bold text-left text-navbar-green mb-8">Admin Panel</h2>
      <div class="overflow-x-auto">
        <table class="min-w-full bg-white border">
          <thead>
            <tr>
              <th class="px-6 py-3 border-b text-left">#</th>
              <th class="px-6 py-3 border-b text-left">Produktnavn</th>
              <th class="px-6 py-3 border-b text-left">Kategori</th>
              <th class="px-6 py-3 border-b text-left">Udvalgt</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="product in allProducts"
              :key="product.id"
              class="hover:bg-gray-50"
            >
              <td class="px-6 py-4 border-b">{{ product.id }}</td>
              <td class="px-6 py-4 border-b">{{ product.name }}</td>
              <td class="px-6 py-4 border-b">{{ product.categories.join(', ') }}</td>
              <td class="px-6 py-4 border-b">
                <input
                  type="checkbox"
                  :checked="isFeatured(product.id)" 
                  @change="toggleFeatured(product.id)"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </template>
  
  <script>
  import { useProductStore } from '../stores/productStore';
  import { useFeaturedProductsStore } from '../stores/featuredProductsStore';
  import { computed } from 'vue';
  
  export default {
    name: 'AdminPanel',
    setup() {
      const productStore = useProductStore();
      const featuredStore = useFeaturedProductsStore();
  
      const { allProducts } = productStore;
      const { featuredProductIds, addFeaturedProduct, removeFeaturedProduct } = featuredStore;
  
      // Function to check if a product is featured
      const isFeatured = productId => {
        return featuredProductIds.includes(productId);
      };
  
      // Function to toggle featured status
      const toggleFeatured = productId => {
        if (isFeatured(productId)) {
          removeFeaturedProduct(productId);
        } else {
          addFeaturedProduct(productId);
        }
      };
  
      return {
        allProducts,
        isFeatured,
        toggleFeatured,
      };
    },
  };
  </script>
  
  <style scoped>
  /* Add any specific styles if needed */
  </style>