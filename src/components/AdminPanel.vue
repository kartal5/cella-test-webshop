<template>
  <section class="container mt-10 mx-auto px-4 md:px-10">
    <h2 class="text-3xl font-bold text-left text-navbar-green mb-8">Admin Panel</h2>

    <div class="border-b border-gray-300 mb-8">
      <nav class="flex space-x-2" aria-label="Tabs">
        <button
          @click="activeTab = 'products'"
          :class="[
            'px-4 py-2 font-medium text-sm rounded-t-lg focus:outline-none',
            activeTab === 'products' ? 'bg-light-green text-white' : 'text-gray-600 hover:bg-gray-200'
          ]"
        >
          Produkter
        </button>
        <button
          @click="activeTab = 'users'"
          :class="[
            'px-4 py-2 font-medium text-sm rounded-t-lg focus:outline-none',
            activeTab === 'users' ? 'bg-light-green text-white' : 'text-gray-600 hover:bg-gray-200'
          ]"
        >
          Brugere & Admins
        </button>
        <button
          @click="activeTab = 'messages'"
          :class="[
            'px-4 py-2 font-medium text-sm rounded-t-lg focus:outline-none',
            activeTab === 'messages' ? 'bg-light-green text-white' : 'text-gray-600 hover:bg-gray-200'
          ]"
        >
          Beskeder
        </button>
      </nav>
    </div>

    <!-- ==================== PRODUCTS TAB ==================== -->
    <div v-if="activeTab === 'products'">
      <!-- Button to open Add Product Modal -->
      <div class="mb-6">
        <button
          @click="showAddProductModal = true"
          class="bg-light-green text-white font-semibold py-2 px-4 rounded hover:bg-dark-green transition"
        >
          Tilføj Ny Produkt
        </button>
      </div>

      <!-- Product List with Pagination -->
      <div class="bg-blog-post p-6 rounded-lg shadow-md">
        <h3 class="text-2xl font-semibold text-navbar-green mb-4">Produktliste</h3>
        <div class="mb-4 flex justify-center">
          <input
            v-model="adminSearch"
            type="text"
            placeholder="🔍 Søg listen af produkter..."
            class="border p-3 rounded-lg shadow-md w-full max-w-lg focus:outline-none focus:ring-2 focus:ring-navbar-green"
          />
        </div>
        <div class="overflow-x-auto">
          <table class="min-w-full bg-white border">
            <thead class="sticky top-0 bg-gray-50">
              <tr>
                <th class="px-6 py-3 border-b text-left">#</th>
                <th class="px-6 py-3 border-b text-left">Produktnavn</th>
                <th class="px-6 py-3 border-b text-left">Elite Discount (%)</th>
                <th class="px-6 py-3 border-b text-left">Kategori(er)</th>
                <th class="px-6 py-3 border-b text-left">Udvalgt</th>
                <th class="px-6 py-3 border-b text-left">Handlinger</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="product in paginatedProducts" :key="product.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 border-b">{{ product.id }}</td>
                <td class="px-6 py-4 border-b">{{ product.name }}</td>
                <td class="px-6 py-4 border-b">{{ product.eliteDiscount ?? 0 }}</td>
                <td class="px-6 py-4 border-b">{{ product.categories.join(', ') }}</td>
                <td class="px-6 py-4 border-b">
                  <input
                    type="checkbox"
                    :checked="isFeatured(product.id)"
                    @change="toggleFeatured(product.id)"
                  />
                </td>
                <td class="px-6 py-4 border-b">
                  <button class="bg-blue-500 text-white font-semibold py-1 px-3 rounded hover:bg-blue-600 transition mr-2" @click="openEditModal(product)">
                    Rediger
                  </button>
                  <button class="bg-red-500 text-white font-semibold py-1 px-3 rounded hover:bg-red-600 transition" @click="handleDelete(product.id)">
                    Slet
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="mt-4 flex justify-between items-center">
          <div class="text-sm text-gray-600">
            Viser {{ (currentPage - 1) * itemsPerPage + 1 }} til 
            {{ Math.min(currentPage * itemsPerPage, filteredProducts.length) }} af 
            {{ filteredProducts.length }} produkter
          </div>
          <div class="flex space-x-2">
            <button
              @click="currentPage--"
              :disabled="currentPage === 1"
              class="px-3 py-1 rounded border bg-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Forrige
            </button>
            <span class="px-3 py-1">
              Side {{ currentPage }} af {{ totalPages }}
            </span>
            <button
              @click="currentPage++"
              :disabled="currentPage === totalPages"
              class="px-3 py-1 rounded border bg-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Næste
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- ==================== USERS TAB ==================== -->
    <div v-if="activeTab === 'users'">
      <!-- Administrators Section -->
      <div class="bg-blog-post p-6 rounded-lg shadow-md mb-8">
        <h3 class="text-3xl font-bold text-left text-navbar-green mb-3">Administratorer</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div v-for="admin in admins" :key="admin.id" class="flex items-center p-3 bg-white rounded-lg shadow-md">
            <img 
              :src="admin.picture || fallbackLogo" 
              alt="Admin Picture" 
              class="w-16 h-16 rounded-full mr-4 object-cover" 
            />
            <div class="flex-1">
              <h3 class="text-xl font-semibold">{{ admin.name || 'No Name' }}</h3>
              <p class="text-gray-700">{{ admin.email }}</p>
              <p :class="{'text-green-500': admin.online, 'text-red-500': !admin.online}">
                {{ admin.online ? 'Online' : 'Offline' }}
              </p>
            </div>
            <button 
              @click="openMessageModal(admin)" 
              class="text-gray-500 hover:text-gray-700 p-2 rounded-lg hover:bg-gray-100 transition"
              title="Send besked"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12.713l11.985-6.713-11.985-6.713-11.985 6.713 11.985 6.713zm0 2.287l-12-6.75v11.75h24v-11.75l-12 6.75z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- User Management Section with search -->
      <div class="bg-blog-post p-6 rounded-lg shadow-md">
        <h3 class="text-2xl font-semibold text-navbar-green mb-4">Brugerstyring</h3>
        
        <!-- Search box for users -->
        <div class="mb-4">
          <input
            v-model="userSearch"
            type="text"
            placeholder="🔍 Søg brugere..."
            class="border p-2 rounded-lg w-full max-w-md focus:outline-none focus:ring-2 focus:ring-navbar-green"
          />
        </div>

        <!-- Scrollable user table -->
        <div class="overflow-x-auto max-h-[400px] overflow-y-auto">
          <table class="min-w-full table-auto bg-white border">
            <thead class="sticky top-0 bg-gray-50">
              <tr>
                <th class="px-4 py-3 border-b text-left">Email</th>
                <th class="px-4 py-3 border-b text-left hidden md:table-cell">Nuværende Rolle</th>
                <th class="px-4 py-3 border-b text-left">Skift Rolle</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(user, index) in filteredUsers" :key="index" class="hover:bg-gray-50">
                <td class="px-4 py-2 border-b">
                  <span class="block font-medium text-gray-900">{{ user.email }}</span>
                  <span class="block text-sm text-gray-500 md:hidden capitalize">
                    Rolle: {{ user.role }}
                  </span>
                </td>
                <td class="px-4 py-2 border-b capitalize hidden md:table-cell">
                  {{ user.role }}
                </td>
                <td class="px-4 py-2 border-b">
                  <select 
                    v-model="user.role" 
                    @change="updateUserRole(user)" 
                    class="border p-2 rounded w-full bg-white focus:outline-none focus:ring-2 focus:ring-navbar-green"
                  >
                    <option value="regular">Regular</option>
                    <option value="elite">Elite</option>
                  </select>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- ==================== MESSAGES TAB ==================== -->
    <div v-if="activeTab === 'messages'">
      <div class="bg-blog-post p-6 rounded-lg shadow-md">
        <h3 class="text-2xl font-semibold text-navbar-green mb-4">Fællesbeskeder</h3>
        
        <form @submit.prevent="sendBroadcastMessage">
          <label class="block text-gray-700 font-semibold mb-2">Besked</label>
          <textarea 
            v-model="messageContent" 
            class="border p-2 rounded w-full mb-4 focus:outline-none focus:ring-2 focus:ring-navbar-green" 
            placeholder="Skriv din besked her..."
            rows="4"
          ></textarea>
          <button 
            type="submit" 
            class="bg-light-green text-white font-semibold py-2 px-4 rounded hover:bg-dark-green transition"
          >
            Send Besked til Alle
          </button>
        </form>

        <!-- Collapsible messages section -->
        <details class="mt-6">
          <summary class="cursor-pointer fontallel font-medium mb-4 text-lg">
            Vis alle beskeder ({{ allMessages.length }})
          </summary>
          <div class="mt-2 space-y-2 max-h-[300px] overflow-y-auto">
            <div v-for="(msg, idx) in allMessages" :key="idx" class="bg-white p-4 rounded shadow mb-2">
              <p class="text-sm text-gray-500 mb-1">
                <strong>Fra:</strong> {{ msg.from }}
                <strong>Til:</strong> {{ msg.to === 'all' ? 'Alle' : msg.to }}
                <strong>Dato:</strong> {{ formatTimestamp(msg.timestamp) }}
              </p>
              <p class="text-gray-800">{{ msg.content }}</p>
            </div>
          </div>
        </details>
      </div>
    </div>

    <!-- ==================== MODALS ==================== -->
    
    <!-- Add Product Modal -->
    <div 
      v-if="showAddProductModal" 
      class="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 p-4"
    >
      <div class="bg-white p-6 rounded-lg shadow-md w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h3 class="text-2xl font-semibold text-navbar-green mb-4">Tilføj Ny Produkt</h3>
        <form @submit.prevent="handleAddProduct" class="space-y-4">
          <!-- Name -->
          <div>
            <label class="block text-gray-700 font-semibold mb-2">Navn</label>
            <input
              v-model="newProduct.name"
              type="text"
              class="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-navbar-green"
              required
            />
          </div>

          <!-- Description -->
          <div>
            <label class="block text-gray-700 font-semibold mb-2">Kort Beskrivelse</label>
            <textarea
              v-model="newProduct.description"
              class="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-navbar-green"
              rows="2"
              required
            ></textarea>
          </div>

          <!-- Price and Elite Discount -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-gray-700 font-semibold mb-2">Pris</label>
              <input
                v-model="newProduct.price"
                type="text"
                placeholder="DKK 250.00 eller 'Kontakt for pris'"
                class="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-navbar-green"
              />
            </div>
            <div>
              <label class="block text-gray-700 font-semibold mb-2">Elite Discount (%)</label>
              <input
                v-model="newProduct.eliteDiscount"
                type="number"
                min="0"
                max="100"
                class="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-navbar-green"
              />
            </div>
          </div>

          <!-- Categories and Subcategories -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-gray-700 font-semibold mb-2">Kategorier</label>
              <select 
                v-model="selectedCategories" 
                multiple 
                class="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-navbar-green"
                size="4"
              >
                <option v-for="cat in availableCategories" :key="cat" :value="cat">{{ cat }}</option>
              </select>
            </div>
            <div>
              <label class="block text-gray-700 font-semibold mb-2">Underkategorier</label>
              <select 
                v-model="selectedSubcategories" 
                multiple 
                class="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-navbar-green"
                size="4"
              >
                <option v-for="sub in availableSubcategories" :key="sub" :value="sub">{{ sub }}</option>
              </select>
            </div>
          </div>

          <!-- Collapsible Full Description -->
          <details class="border rounded-lg p-4">
            <summary class="cursor-pointer font-semibold text-gray-700">
              Fuldbeskrivelse (Valgfri)
            </summary>
            <textarea
              v-model="newProduct.fullDescription"
              class="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-navbar-green mt-2"
              rows="4"
            ></textarea>
          </details>

          <!-- Form buttons -->
          <div class="flex justify-end space-x-2">
            <button
              type="button"
              @click="closeAddProductModal"
              class="bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded hover:bg-gray-400 transition"
            >
              Annuller
            </button>
            <button
              type="submit"
              class="bg-light-green text-white font-semibold py-2 px-4 rounded hover:bg-dark-green transition"
            >
              Tilføj Produkt
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Message Modal -->
    <div 
      v-if="showMessageModal" 
      class="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 p-4"
    >
      <div class="bg-white p-6 rounded-lg shadow-md max-w-md w-full relative">
        <h3 class="text-2xl font-semibold text-navbar-green mb-4">
          Send Besked til {{ selectedAdmin?.name }}
        </h3>
        <form @submit.prevent="sendMessage">
          <div>
            <label class="block text-gray-700 font-semibold mb-2">Besked</label>
            <textarea 
              v-model="message" 
              class="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-navbar-green" 
              rows="4"
              required
            ></textarea>
          </div>
          <div class="flex justify-end space-x-4 mt-4">
            <button 
              type="button" 
              @click="closeMessageModal" 
              class="bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded hover:bg-gray-400 transition"
            >
              Annuller
            </button>
            <button 
              type="submit" 
              class="bg-light-green text-white font-semibold py-2 px-4 rounded hover:bg-dark-green transition"
            >
              Send Besked
            </button>
          </div>
        </form>
      </div>
    </div>
    
    <!-- Edit Product Modal -->
    <div 
      v-if="showEditModal" 
      class="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 p-4"
    >
      <div class="bg-white p-6 rounded-lg shadow-md w-full max-w-3xl max-h-[90vh] overflow-y-auto relative">
        <h3 class="text-2xl font-semibold text-navbar-green mb-4">Rediger Produkt</h3>
        <form @submit.prevent="handleEditProduct" class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Name -->
          <div>
            <label class="block text-gray-700 font-semibold mb-2">Navn</label>
            <input 
              v-model="editProductData.name" 
              type="text" 
              class="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-navbar-green" 
              required 
            />
          </div>
          
          <!-- Elite Discount -->
          <div>
            <label class="block text-gray-700 font-semibold mb-2">Elite Discount (%)</label>
            <input 
              v-model="editProductData.eliteDiscount" 
              type="number" 
              min="0" 
              max="100" 
              class="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-navbar-green" 
            />
          </div>
          
          <!-- Price -->
          <div>
            <label class="block text-gray-700 font-semibold mb-2">Pris</label>
            <input 
              v-model="editProductData.price" 
              type="text" 
              class="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-navbar-green" 
            />
          </div>
          
          <!-- Image -->
          <div>
            <label class="block text-gray-700 font-semibold mb-2">Billede (URL)</label>
            <input 
              v-model="editProductData.image" 
              type="text" 
              class="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-navbar-green" 
            />
          </div>
          
          <!-- Short Description -->
          <div class="md:col-span-2">
            <label class="block text-gray-700 font-semibold mb-2">Kort Beskrivelse</label>
            <textarea 
              v-model="editProductData.description" 
              class="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-navbar-green" 
              rows="2"
              required
            ></textarea>
          </div>
          
          <!-- Full Description -->
          <div class="md:col-span-2">
            <label class="block text-gray-700 font-semibold mb-2">Fuldbeskrivelse</label>
            <textarea 
              v-model="editProductData.fullDescription" 
              class="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-navbar-green"
              rows="3"
            ></textarea>
          </div>
          
          <!-- Categories -->
          <div>
            <label class="block text-gray-700 font-semibold mb-2">Kategorier</label>
            <select 
              v-model="selectedEditCategories" 
              multiple 
              class="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-navbar-green"
              size="4"
            >
              <option v-for="category in availableCategories" :key="category" :value="category">
                {{ category }}
              </option>
            </select>
          </div>
          
          <!-- Subcategories -->
          <div>
            <label class="block text-gray-700 font-semibold mb-2">Underkategorier</label>
            <select 
              v-model="selectedEditSubcategories" 
              multiple 
              class="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-navbar-green"
              size="4"
            >
              <option v-for="subcategory in availableSubcategories" :key="subcategory" :value="subcategory">
                {{ subcategory }}
              </option>
            </select>
          </div>
          
          <!-- Action buttons -->
          <div class="md:col-span-2 flex justify-end space-x-4 mt-4">
            <button 
              type="button" 
              @click="closeEditModal" 
              class="bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded hover:bg-gray-400 transition"
            >
              Annuller
            </button>
            <button 
              type="submit" 
              class="bg-light-green text-white font-semibold py-2 px-4 rounded hover:bg-dark-green transition"
            >
              Gem ændringer
            </button>
          </div>
        </form>
      </div>
    </div>
  </section>
</template>

<script>
import { ref, onMounted, computed, watch } from 'vue';
import { getFirestore, collection, getDocs, updateDoc, doc, addDoc, serverTimestamp } from 'firebase/firestore';
import { app } from '../firebase/init';
import { useAuthStore } from '../stores/authStore'; 
import { useProductStore } from '../stores/productStore';
import { useFeaturedProductsStore } from '../stores/featuredProductsStore';
import fallbackLogo from '../assets/img/logo.png';

export default {
  name: 'AdminPanel',
  setup() {
    const activeTab = ref('products');
    const authStore = useAuthStore();
    const db = getFirestore(app);
    const usersCollection = collection(db, 'users');
    const messagesCollection = collection(db, 'messages');

    // ==================== Admin Display ====================
    const showMessageModal = ref(false);
    const selectedAdmin = ref(null);
    const message = ref('');

    const openMessageModal = (admin) => {
      selectedAdmin.value = admin;
      showMessageModal.value = true;
    };
    
    const closeMessageModal = () => {
      showMessageModal.value = false;
      message.value = '';
    };
    
    const sendMessage = async () => {
      if (!selectedAdmin.value || !message.value.trim()) return;
      const currentUserEmail = authStore.user.email;
      const newMsg = {
        from: currentUserEmail,
        to: selectedAdmin.value.email,
        content: message.value.trim(),
        timestamp: serverTimestamp(),
      };
      await addDoc(messagesCollection, newMsg);
      closeMessageModal();
      loadMessages();
    };

    // ==================== User Management ====================
    const users = ref([]);
    const userSearch = ref('');
    
    const admins = computed(() => {
      return users.value.filter(user => user.role === 'admin');
    });

    const filteredUsers = computed(() => {
      const term = userSearch.value.trim().toLowerCase();
      if (!term) return users.value;
      return users.value.filter(user => 
        user.email?.toLowerCase().includes(term) ||
        user.role?.toLowerCase().includes(term)
      );
    });

    const loadUsers = async () => {
      const querySnapshot = await getDocs(usersCollection);
      const all = [];
      querySnapshot.forEach((docSnap) => {
        all.push({ id: docSnap.id, ...docSnap.data() });
      });
      users.value = all;
    };

    const updateUserRole = async (user) => {
      const userDocRef = doc(db, 'users', user.id);
      try {
        if (!authStore.isAdmin()) {
          throw new Error('Insufficient permissions');
        }
        await updateDoc(userDocRef, { role: user.role });
      } catch (error) {
        console.error('Error updating user role:', error);
      }
    };

    // ==================== Messaging Section ====================
    const messageContent = ref('');
    const allMessages = ref([]);

    const sendBroadcastMessage = async () => {
      if (!messageContent.value.trim()) return;
      const currentUserEmail = authStore.user.email;
      const newMsg = {
        from: currentUserEmail,
        to: 'all',
        content: messageContent.value.trim(),
        timestamp: serverTimestamp(),
      };
      await addDoc(messagesCollection, newMsg);
      messageContent.value = '';
      loadMessages();
    };

    const loadMessages = async () => {
      const querySnapshot = await getDocs(messagesCollection);
      const all = [];
      querySnapshot.forEach((docSnap) => {
        all.push(docSnap.data());
      });
      all.sort((a, b) => (b.timestamp?.seconds || 0) - (a.timestamp?.seconds || 0));
      allMessages.value = all;
    };

    const formatTimestamp = (timestamp) => {
      if (!timestamp) return 'N/A';
      const date = timestamp.toDate();
      return date.toLocaleString('da-DK');
    };

    // ==================== Product Management ====================
    const productStore = useProductStore();
    const featuredStore = useFeaturedProductsStore();
    const { allProducts, addProduct, updateProduct, deleteProduct } = productStore;
    const { featuredProductIds, addFeaturedProduct, removeFeaturedProduct } = featuredStore;

    const availableCategories = ref(['mennesker', 'heste', 'hunde', 'katte']);
    const availableSubcategories = ref(['Vitaminer & Mineraler', 'Fordøjelse', 'Collagen', 'Olie', 'Andre produkter']);

    // Add Product Modal State
    const showAddProductModal = ref(false);
    const newProduct = ref({
      name: '',
      description: '',
      fullDescription: '',
      price: 'DKK 250.00',
      image: '',
      categories: [],
      subcategories: [],
      eliteDiscount: 0,
    });
    const selectedCategories = ref([]);
    const selectedSubcategories = ref([]);

    const closeAddProductModal = () => {
      showAddProductModal.value = false;
      // Reset form
      newProduct.value = {
        name: '',
        description: '',
        fullDescription: '',
        price: 'DKK 250.00',
        image: '',
        categories: [],
        subcategories: [],
        eliteDiscount: 0,
      };
      selectedCategories.value = [];
      selectedSubcategories.value = [];
    };

    const handleAddProduct = () => {
      newProduct.value.categories = selectedCategories.value;
      newProduct.value.subcategories = selectedSubcategories.value;
      addProduct({ ...newProduct.value });
      closeAddProductModal();
    };

    // Edit product modal
    const showEditModal = ref(false);
    const editProductData = ref({
      id: null,
      name: '',
      description: '',
      fullDescription: '',
      price: '',
      image: '',
      categories: [],
      subcategories: [],
      eliteDiscount: 0,
    });
    const selectedEditCategories = ref([]);
    const selectedEditSubcategories = ref([]);

    const openEditModal = (product) => {
      editProductData.value = { ...product };
      selectedEditCategories.value = product.categories || [];
      selectedEditSubcategories.value = product.subcategories || [];
      showEditModal.value = true;
    };
    
    const closeEditModal = () => {
      showEditModal.value = false;
    };
    
    const handleEditProduct = () => {
      editProductData.value.categories = selectedEditCategories.value;
      editProductData.value.subcategories = selectedEditSubcategories.value;
      updateProduct(editProductData.value);
      closeEditModal();
    };

    const handleDelete = (productId) => {
      if (confirm('Er du sikker på at du vil slette dette produkt?')) {
        deleteProduct(productId);
      }
    };

    // Featured product toggles
    const isFeatured = (productId) => {
      return featuredProductIds.includes(productId);
    };
    
    const toggleFeatured = (productId) => {
      if (isFeatured(productId)) {
        removeFeaturedProduct(productId);
      } else {
        addFeaturedProduct(productId);
      }
    };

    // Product Search and Pagination
    const adminSearch = ref('');
    const filteredProducts = computed(() => {
      const term = adminSearch.value.trim().toLowerCase();
      if (!term) {
        return allProducts.value;
      }
      return allProducts.value.filter((p) => {
        const nameMatch = p.name?.toLowerCase().includes(term);
        const idMatch = String(p.id).toLowerCase().includes(term);
        const categoryMatch = p.categories?.some(cat => cat.toLowerCase().includes(term));
        return nameMatch || idMatch || categoryMatch;
      });
    });

    const currentPage = ref(1);
    const itemsPerPage = 10;
    const totalPages = computed(() => {
      return Math.max(1, Math.ceil(filteredProducts.value.length / itemsPerPage));
    });
    const paginatedProducts = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage;
      const end = start + itemsPerPage;
      return filteredProducts.value.slice(start, end);
    });

    watch(adminSearch, () => {
      currentPage.value = 1;
    });

    onMounted(() => {
      loadUsers();
      loadMessages();
    });

    return {
      // Tab management
      activeTab,
      fallbackLogo,

      // Admin display
      admins,
      showMessageModal,
      selectedAdmin,
      message,
      openMessageModal,
      closeMessageModal,
      sendMessage,

      // User Management
      users,
      userSearch,
      filteredUsers,
      updateUserRole,
      loadUsers,

      // Messaging Section
      messageContent,
      sendBroadcastMessage,
      allMessages,
      formatTimestamp,

      // Product Management
      allProducts,
      showAddProductModal,
      newProduct,
      availableCategories,
      availableSubcategories,
      selectedCategories,
      selectedSubcategories,
      closeAddProductModal,
      handleAddProduct,
      showEditModal,
      editProductData,
      selectedEditCategories,
      selectedEditSubcategories,
      openEditModal,
      closeEditModal,
      handleEditProduct,
      handleDelete,

      // Featured
      isFeatured,
      toggleFeatured,

      // Product Search and Pagination
      adminSearch,
      filteredProducts,
      currentPage,
      itemsPerPage,
      totalPages,
      paginatedProducts,
    };
  },
};
</script>

<style scoped>
.bg-blog-post {
  background-color: #efede4;
}

/* Custom scrollbar for scrollable sections */
.overflow-y-auto::-webkit-scrollbar {
  width: 8px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #555;
}

/* Sticky table headers */
thead.sticky {
  position: sticky;
  top: 0;
  z-index: 10;
}
</style>