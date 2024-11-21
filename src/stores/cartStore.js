import { defineStore } from 'pinia';
import { ref, computed, watch } from 'vue';

// Load cart data from local storage (if it exists)
const loadCartFromStorage = () => {
  const storedCart = localStorage.getItem('cartItems');
  return storedCart ? JSON.parse(storedCart) : [];
};

export const useCartStore = defineStore('cart', () => {
  // Initialize `cartItems` with data from local storage
  const cartItems = ref(loadCartFromStorage());

  const addToCart = (product) => {
    const existingItem = cartItems.value.find((item) => item.id === product.id);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cartItems.value.push({ ...product, quantity: 1 });
    }
    console.log("Cart Items:", cartItems.value); // Log to verify cart contents
  };
  

  const removeFromCart = (index) => {
    cartItems.value.splice(index, 1);
  };

  const cartTotal = computed(() =>
    cartItems.value.reduce((total, item) => total + parseFloat(item.price.replace('DKK ', '')) * item.quantity, 0)
  );

  // Watch `cartItems` and sync changes to local storage
  watch(cartItems, (newCartItems) => {
    localStorage.setItem('cartItems', JSON.stringify(newCartItems));
  }, { deep: true });

  return { cartItems, addToCart, removeFromCart, cartTotal };
});