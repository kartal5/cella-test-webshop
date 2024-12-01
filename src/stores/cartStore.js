import { defineStore } from 'pinia';
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue';

// Define the cart store using Pinia
export const useCartStore = defineStore('cart', () => {
  // Initialize `cartItems` with data from local storage
  const cartItems = ref(loadCartFromStorage());

  // Pinia allows us to globally manage shared state for cartItems across components (fx Header.vue and CartPage.vue page)
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

  // Pinia's reactive nature ensures that updates to the cart state are reflected in all components (Header.vue)
  const removeFromCart = (index) => {
    cartItems.value.splice(index, 1);
  };


  // Using Pinia's `computed` properties, we can derive reactive values from the state,
  // without duplicating logic across components.

  // Total price of all items in the cart
  const cartTotal = computed(() =>
    cartItems.value.reduce(
      (total, item) => total + parseFloat(item.price.replace('DKK ', '')) * item.quantity,
      0
    )
  );


  // Pinia's `watch` function ensures that any update to cartItems is synchronized with localStorage,
  // providing persistent state even after page reloads.

  // Watch `cartItems` to persist updates to localStorage
  watch(
    cartItems,
    (newCartItems) => {
      localStorage.setItem('cartItems', JSON.stringify(newCartItems));
    },
    { deep: true }
  );

  // Pinia's centralized state management allows us to dynamically update the cart state
  // across all components whenever localStorage changes, ensuring consistent behavior.

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
// this function ensures those items are still in the cart when they return 
// (Pinia store starts with the most recent cart data, even after a page reload or app restart)
function loadCartFromStorage() {
  const storedCart = localStorage.getItem('cartItems');
  return storedCart ? JSON.parse(storedCart) : [];
}
