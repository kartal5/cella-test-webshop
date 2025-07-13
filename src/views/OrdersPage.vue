<template>
    <section class="container mt-10 mx-auto px-4 md:px-10">
      <h2 class="text-3xl font-bold text-navbar-green mb-8">Ordreoversigt</h2>
  
      <!-- Table of Orders -->
      <div v-if="orders.length > 0" class="bg-white p-6 rounded-lg shadow-md overflow-x-auto">
        <table class="min-w-full text-left">
          <thead class="bg-beige">
            <tr>
              <th class="px-4 py-2 font-semibold">Ordre-ID</th>
              <th class="px-4 py-2 font-semibold">Transaktions-id (Payment Intent)</th>
              <th class="px-4 py-2 font-semibold">Brugermail</th>
              <th class="px-4 py-2 font-semibold">Status</th>
              <th class="px-4 py-2 font-semibold">Total (DKK)</th>
              <th class="px-4 py-2 font-semibold">Oprettet</th>
              <th class="px-4 py-2 font-semibold">Handling</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="order in orders"
              :key="order.id"
              class="hover:bg-gray-50"
            >
              <td class="px-4 py-2">{{ order.id }}</td>
              <td class="px-4 py-2">{{ order.paymentIntentId }}</td>
              <td class="px-4 py-2">{{ order.userEmail }}</td>
              <td class="px-4 py-2">{{ order.status }}</td>
              <td class="px-4 py-2">{{ order.amount }}</td>
              <td class="px-4 py-2">{{ formatTimestamp(order.createdAt) }}</td>
              <td class="px-4 py-2">
                <button
                  class="text-light-green hover:text-dark-green font-semibold"
                  @click="openOrderModal(order)"
                >
                  Se detaljer
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
  
      <!-- If no orders exist -->
      <p v-else class="text-black text-center mt-6">Der er ingen ordrer at vise.</p>
  
      <!-- Modal for showing detailed order info -->
      <div
        v-if="selectedOrder"
        class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4"
      >
        <div class="bg-white w-full max-w-2xl p-6 rounded-lg shadow-md relative">
          <h3 class="text-2xl font-bold text-navbar-green mb-4">Ordre Detaljer</h3>
          
          <!-- Basic Info -->
          <p class="text-sm text-gray-500 mb-2">
            <strong>Order ID:</strong> {{ selectedOrder.id }}<br />
            <strong>Status:</strong> {{ selectedOrder.status }}<br />
            <strong>Beløb (DKK):</strong> {{ selectedOrder.amount }}<br />
            <strong>Betaling:</strong> {{ selectedOrder.paymentIntentId }}
          </p>
  
          <!-- Shipping Info -->
          <div class="my-4 bg-gray-100 rounded p-4">
            <h4 class="text-lg font-semibold mb-2">Leveringsoplysninger</h4>
            <p class="text-gray-700">Navn: {{ selectedOrder.shippingInfo.fullName }}</p>
            <p class="text-gray-700">Adresse: {{ selectedOrder.shippingInfo.address }}</p>
            <p class="text-gray-700">{{ selectedOrder.shippingInfo.postalCode }} {{ selectedOrder.shippingInfo.city }}</p>
            <p class="text-gray-700">{{ selectedOrder.shippingInfo.country }}</p>
          </div>
  
          <!-- Items List -->
          <div class="my-4 bg-gray-50 rounded p-4">
            <h4 class="text-lg font-semibold mb-2">Varer i Ordren</h4>
            <ul class="space-y-2">
              <li
                v-for="(item, index) in selectedOrder.items"
                :key="index"
                class="border-b py-2"
              >
                <p class="font-medium text-gray-800">{{ item.name }}</p>
                <p class="text-sm text-gray-500">Antal: {{ item.quantity }} | Pris: {{ item.price }}</p>
              </li>
            </ul>
          </div>
  
          <!-- Close Button -->
          <div class="text-right mt-6">
            <button
              @click="closeOrderModal"
              class="bg-red-500 text-white font-semibold py-2 px-4 rounded hover:bg-red-600 transition"
            >
              Luk
            </button>
          </div>
        </div>
      </div>
    </section>
  </template>
  
  <script>
import { ref, onMounted } from 'vue';
import { getFirestore, collection, query, orderBy, getDocs, doc, getDoc } from 'firebase/firestore';
import { app } from '../firebase/init';

export default {
  name: 'OrdersPage',
  setup() {
    const db = getFirestore(app);
    const orders = ref([]);      // All orders from Firestore
    const selectedOrder = ref(null); // For the modal

    // Fetch all orders and users' emails
    const loadOrders = async () => {
      const ordersRef = collection(db, 'orders');
      const orderedQuery = query(ordersRef, orderBy('createdAt', 'desc'));
      const ordersSnapshot = await getDocs(orderedQuery);
      const usersSnapshot = await getDocs(collection(db, 'users'));
      
      // Map users collection to an object for quick lookup by userId
      const usersById = {};
      usersSnapshot.forEach(userDoc => {
        usersById[userDoc.id] = userDoc.data().email; // Store email keyed by user ID
      });

      // Process orders and add the corresponding email
      const results = [];
      ordersSnapshot.forEach(orderDoc => {
        const orderData = orderDoc.data();
        results.push({
          id: orderDoc.id,
          ...orderData,
          userEmail: usersById[orderData.userId] || 'Ingen', // Get email or default to 'Ingen'
        });
      });
      orders.value = results;
    };

    // Format Firestore timestamps
    const formatTimestamp = (timestamp) => {
      if (!timestamp) return 'N/A';
      const dateObj = timestamp.toDate?.() || new Date(timestamp);
      return dateObj.toLocaleString();
    };

    // Show details in a modal
    const openOrderModal = (order) => {
      selectedOrder.value = order;
    };
    const closeOrderModal = () => {
      selectedOrder.value = null;
    };

    onMounted(() => {
      loadOrders().catch(console.error);
    });

    return {
      orders,
      selectedOrder,
      loadOrders,
      formatTimestamp,
      openOrderModal,
      closeOrderModal,
    };
  },
};
</script>

  
  <style scoped>
  /* Add styling to match your brand. Tailwind classes handle much of it already. */
  </style>