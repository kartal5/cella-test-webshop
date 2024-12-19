<template>
  <div>
    <pwa-banner />
    <ProductCategories />
    <FeaturedProducts />
  </div>
</template>
  
  <script>
  import ProductCategories from '../components/ProductCategories.vue'
  import FeaturedProducts from '../components/FeaturedProducts.vue'
  import PwaBanner from '../components/PwaBanner.vue';
  
  export default {
    name: 'HomePage',
    components: {
      ProductCategories,
      FeaturedProducts,
      PwaBanner,
    },
  };
  </script>
  
  <style scoped>
  /* Add any specific styles here if needed */
  </style>
  