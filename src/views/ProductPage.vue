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

      <!-- Dropdown for price selection, visible only for products with multiple options -->
      <div v-if="requiresSelection(product)" class="mb-4">
        <label for="option" class="block font-semibold mb-2">Vælg en mulighed:</label>
        <select v-model="selectedOption" class="border rounded-lg p-2 w-full" id="option">
          <option disabled value="">-- Vælg en mulighed --</option>
          <option v-for="(option, index) in productOptions" :key="index" :value="option">
            {{ option.label }} - {{ option.price }}
          </option>
        </select>
      </div>

      <!-- Buttons -->
      <div class="flex items-center gap-2 mt-4 mb-4">
        <!-- Tilbage Button -->
        <button
          @click="goBack"
          class="bg-red-500 text-white font-semibold py-2 px-4 rounded hover:bg-red-600 transition"
        >
          Tilbage
        </button>

        <!-- Conditional "Kontakt for Pris" or "Læg i kurv" Button -->
        <button
          v-if="product.price === 'Kontakt for pris'"
          @click="redirectToContact"
          class="bg-navbar-green text-white font-semibold py-2 px-4 rounded hover:bg-green-700 transition"
        >
          Kontakt for Pris
        </button>
        <button
          v-else
          @click="addToCart(product)"
          :disabled="requiresSelection(product) && !selectedOption"
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
import { ref, computed } from 'vue';

export default {
  name: 'ProductPage',
  setup() {
    const route = useRoute();
    const router = useRouter();

    const { allProducts } = useProductStore();
    const product = allProducts.value.find((p) => p.id === Number(route.params.id));

    const cartStore = useCartStore();
    const selectedOption = ref(null);

        
     //Add the product (or its variation) to the cart
     //If the product requires a dropdown selection, ensure the selected option is included
    const addToCart = (product) => {
      if (requiresSelection(product) && selectedOption.value) {
         // Create a modified product object that includes the selected variation
        const selectedProduct = {
          ...product,
          price: selectedOption.value.price, // Use the selected variation's price
          name: `${product.name} - ${selectedOption.value.label}`, // Append variation label to the product name
        };
        cartStore.addToCart(selectedProduct);
      } else if (!requiresSelection(product)) {
        // Add the product directly if no selection is required
        cartStore.addToCart(product);
      }
    };

    const goBack = () => {
      router.go(-1); // Navigate to the previous page
    };

    // Split product descriptions into separate lines for better readability
    const formattedDescription = product?.fullDescription
      ? product.fullDescription.split('\n')
      : product.description.split('\n');

      const requiresSelection = (product) => {
        // Products with "Kontakt for pris" should not show a dropdown so disable the button
        if (product.price === 'Kontakt for pris') {
          return false;
        }

        // Dropdown logic applies only to products requiring selection
        const productsRequiringSelection = [31, 36, 37, 38];
        return productsRequiringSelection.includes(product.id);
      };

    // Dynamically generate dropdown options for products with variations.
    const productOptions = computed(() => {
      if (!product || !requiresSelection(product)) return [];
      const options = [];
      if (product.id === 31) {
        options.push(
          { label: 'Leje pr. uge', price: 'DKK 1,500.00' },
          { label: 'Køb af sæt', price: 'DKK 32,550.00' },
          { label: 'Køb af dækken', price: 'DKK 18,585.00' },
          { label: 'Køb af gamacher', price: 'DKK 20,265.00' }
        );
      } else if (product.id === 36) {
        options.push(
          { label: '1L', price: 'DKK 299.00' },
          { label: '3L', price: 'DKK 699.00' }
        );
      } else if (product.id === 37) {
        options.push(
          { label: '1L', price: 'DKK 119.00' },
          { label: '3L', price: 'DKK 299.00' }
        );
      } else if (product.id === 38) {
        options.push(
          { label: '1L', price: 'DKK 99.00' },
          { label: '3L', price: 'DKK 249.00' }
        );
      }
      return options;
    });

    // Redirect users to the contact page for products with "Kontakt for pris."
    const redirectToContact = () => {
      window.location.href = "https://www.cellatest.com/kontakt";
    };

    // Expose variables and methods to the template
    return {
      product,
      addToCart,
      goBack,
      formattedDescription,
      requiresSelection,
      productOptions,
      selectedOption,
      redirectToContact,
    };
  },
};
</script>

<style scoped>
.product-image {
  max-width: 100%;
  width: 320px;
  height: auto;
  display: block;
  margin: 0 auto;
}

.product-detail {
  max-width: 900px;
  margin: auto;
}
</style>