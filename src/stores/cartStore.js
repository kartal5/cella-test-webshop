import { defineStore } from 'pinia';
// Using Pinia's `computed` properties, we can derive reactive values from the state without duplicating logic across components.
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue';
import { useAuthStore } from './authStore';

// Define the cart store using Pinia
export const useCartStore = defineStore('cart', () => {
  const cartItems = ref(loadCartFromStorage());

  const addToCart = (product) => {
    const existingItem = cartItems.value.find((item) => item.id === product.id);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cartItems.value.push({ ...product, quantity: 1 });
    }
  };

  const removeFromCart = (index) => {
    cartItems.value.splice(index, 1);
  };

  const cartTotal = computed(() => {
    return cartItems.value.reduce((sum, item) => {
      const price = parseFloat(item.price.replace('DKK ', '').replace(',', ''));
      return sum + price * item.quantity;
    }, 0);
  });

  // Persist cart to localStorage
  watch(
    cartItems,
    (newCartItems) => {
      localStorage.setItem('cartItems', JSON.stringify(newCartItems));
    },
    { deep: true }
  );

  function loadCartFromStorage() {
    const storedCart = localStorage.getItem('cartItems');
    return storedCart ? JSON.parse(storedCart) : [];
  }

  return { cartItems, addToCart, removeFromCart, cartTotal };
});
  