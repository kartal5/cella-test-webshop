import { defineStore } from 'pinia';
import { ref, computed, watch } from 'vue';
import { useAuthStore } from './authStore';

export const useCartStore = defineStore('cart', () => {
  const authStore = useAuthStore();
  const cartItems = ref(loadCartFromStorage());

  const addToCart = (product) => {
    const existingItem = cartItems.value.find((item) => item.id === product.id && item.name === product.name);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cartItems.value.push({ ...product, quantity: 1 });
    }
  };

  const removeFromCart = (index) => {
    cartItems.value.splice(index, 1);
  };

  // 1) Compute the raw subtotal
  const cartSubtotal = computed(() => {
    return cartItems.value.reduce((sum, item) => {
      if (item.price.toLowerCase().includes('kontakt')) return sum;
      
      // Corrected price parsing
      const numericPrice = parseFloat(
        item.price.replace(/[^0-9.,]/g, '').replace(',', '').trim()
      ) || 0;
      
      return sum + numericPrice * item.quantity;
    }, 0);
  });

  // 2) Compute discount if user is Elite
  const cartTotal = computed(() => {
    const isElite = authStore.user?.role === 'elite';
    let total = 0;

    cartItems.value.forEach((item) => {
      if (!item.price || item.price.toLowerCase().includes('kontakt')) return;
      
      // Corrected price parsing
      const numericPrice = parseFloat(
        item.price.replace(/[^0-9.,]/g, '').replace(',', '').trim()
      ) || 0;

      let itemTotal = numericPrice * item.quantity;

      // If user is elite, apply the product’s discount
      if (isElite && item.eliteDiscount && item.eliteDiscount > 0) {
        const discountRate = item.eliteDiscount / 100;
        itemTotal = itemTotal * (1 - discountRate);
      }

      total += itemTotal;
    });

    // Round or format as needed:
    return +total.toFixed(2);
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

  return {
    cartItems,
    cartSubtotal,
    cartTotal,
    addToCart,
    removeFromCart,
  };
});