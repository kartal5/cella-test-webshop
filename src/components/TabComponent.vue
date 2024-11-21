<template>
  <div class="container mt-5 mx-auto">
    <div class="flex justify-center space-x-8 border-b-2 border-gray-200 pb-2">
      <router-link to="/" class="sm:text-lg text-base font-semibold  hover:text-navbar-green focus:text-navbar-green">Butik</router-link>
      <!-- External link with security attributes to ensure that links opened in a new tab don’t pose security risks -->
      <a href="https://www.cellatest.com/" target="_blank" rel="noopener noreferrer" class="sm:text-lg text-base font-semibold text-black hover:text-navbar-green focus:text-navbar-green">CELLA TEST</a>
      <router-link to="/blog" class="sm:text-lg text-base font-semibold text-black hover:text-navbar-green focus:text-navbar-green">Blog</router-link>
      <!-- External link with security attributes to ensure that links opened in a new tab don’t pose security risks -->
      <a href="https://www.cellatest.com/kontakt" target="_blank" rel="noopener noreferrer" class="sm:text-lg text-base font-semibold text-black hover:text-navbar-green focus:text-navbar-green">Kontakt</a>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TabComponent',
};
</script>

<style scoped>
/* Add any specific styles here if needed */
</style>