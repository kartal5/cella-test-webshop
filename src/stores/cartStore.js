import { defineStore } from 'pinia';
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue';

// Define the cart store using Pinia
export const useCartStore = defineStore('cart', () => {
  // Initialize `cartItems` with data from local storage
  const cartItems = ref(loadCartFromStorage());

  const addToCart = (product) => {
    // Create a unique key combining id and product name
    const uniqueKey = `${product.id}-${product.name}`;

    // Check if the product with the same variation (fx "1L" and "3L") already exists in the cart
    const existingItem = cartItems.value.find((item) => item.uniqueKey === uniqueKey);

    if (existingItem) {
      // If found, increment the quantity
      existingItem.quantity += 1;
    } else {
      // Otherwise, add it as a new entry with its unique key
      cartItems.value.push({ ...product, quantity: 1, uniqueKey });
    }
  };

  const removeFromCart = (index) => {
    cartItems.value.splice(index, 1);
  };

  // Total price of all items in the cart
  const cartTotal = computed(() =>
    cartItems.value.reduce(
      (total, item) => total + parseFloat(item.price.replace('DKK ', '')) * item.quantity,
      0
    )
  );

  // Watch `cartItems` to persist updates to localStorage
  watch(
    cartItems,
    (newCartItems) => {
      localStorage.setItem('cartItems', JSON.stringify(newCartItems));
    },
    { deep: true }
  );

  // Synchronize with `localStorage` when the storage event is fired
  const syncCartWithStorage = (event) => {
    if (event.key === 'cartItems') {
      cartItems.value = event.newValue ? JSON.parse(event.newValue) : [];
    }
  };

  // "window storage" event to ensure changes in one tab are reflected in others:

  // Add event listener for 'storage' events when component is mounted
  onMounted(() => {
    window.addEventListener('storage', syncCartWithStorage);
  });

  // Remove event listener when component is unmounted
  onBeforeUnmount(() => {
    window.removeEventListener('storage', syncCartWithStorage);
  });

  // Expose cart state and actions to the rest of the app
  return { cartItems, addToCart, removeFromCart, cartTotal };
});

// Load cart data from local storage (if the user has items from previous sessions)
// If a user added items to their cart during a previous visit, 
// this function ensures those items are still in the cart when they return.
function loadCartFromStorage() {
  const storedCart = localStorage.getItem('cartItems');
  return storedCart ? JSON.parse(storedCart) : [];
}
