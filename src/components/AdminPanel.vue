<template>
  <section class="container mt-10 mx-auto px-4 md:px-10">
    <h2 class="text-3xl font-bold text-left text-navbar-green mb-8">Admin Panel</h2>

      <!-- ====================== NEW: User Management ====================== -->
      <div class="bg-blog-post p-6 rounded-lg shadow-md mb-8 mt-8">
      <h3 class="text-2xl font-semibold text-navbar-green mb-4">Brugerstyring</h3>
      
      <!-- Table of all users -->
      <table class="min-w-full bg-white border">
        <thead>
          <tr>
            <th class="px-6 py-3 border-b text-left">Email</th>
            <th class="px-6 py-3 border-b text-left">Nuværende Rolle</th>
            <th class="px-6 py-3 border-b text-left">Skift Rolle</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(user, index) in users"
            :key="index"
            class="hover:bg-gray-50"
          >
            <td class="px-6 py-4 border-b">{{ user.email }}</td>
            <td class="px-6 py-4 border-b capitalize">{{ user.role }}</td>
            <td class="px-6 py-4 border-b">
              <button
                v-if="user.role !== 'elite'"
                @click="makeElite(user)"
                class="bg-green-500 text-white font-semibold py-1 px-3 rounded hover:bg-green-600 transition mr-2"
              >
                Opgrader til Elite
              </button>
              <button
                v-else
                @click="makeRegular(user)"
                class="bg-gray-500 text-white font-semibold py-1 px-3 rounded hover:bg-gray-600 transition mr-2"
              >
                Nedgrader bruger
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- ====================== NEW: Messaging Section ====================== -->
    <div class="bg-blog-post p-6 rounded-lg shadow-md mb-8 mt-8">
      <h3 class="text-2xl font-semibold text-navbar-green mb-4">Send en Besked til Bruger</h3>
      <form @submit.prevent="sendAdminMessage">
        <label class="block text-gray-700 font-semibold mb-2">Vælg Bruger</label>
        <select v-model="selectedUserEmail" class="border p-2 rounded w-full mb-4">
          <option disabled value="">-- Vælg en bruger --</option>
          <option v-for="(user, index) in users" :key="index" :value="user.email">
            {{ user.email }}
          </option>
        </select>

        <label class="block text-gray-700 font-semibold mb-2">Besked</label>
        <textarea
          v-model="messageContent"
          class="border p-2 rounded w-full mb-4"
          placeholder="Skriv din besked her..."
        ></textarea>

        <button
          type="submit"
          class="bg-light-green text-white font-semibold py-2 px-4 rounded hover:bg-dark-green transition"
        >
          Send Besked
        </button>
      </form>

      <!-- Show all messages (basic approach, admin sees all messages) -->
      <div class="mt-8">
        <h4 class="text-xl font-bold text-navbar-green mb-2">All Messages</h4>
        <div
          v-for="(msg, idx) in allMessages"
          :key="idx"
          class="bg-white p-4 rounded shadow mb-2"
        >
          <p class="text-sm text-gray-500 mb-1">
            <strong>Fra:</strong> {{ msg.from }}
            <strong>Til:</strong> {{ msg.to }}
            <strong>Dato:</strong> {{ msg.timestamp?.toDate().toLocaleString() }}
          </p>
          <p class="text-gray-800">{{ msg.content }}</p>
        </div>
      </div>
    </div>

    <!-- Add New Product Form -->
    <div class="bg-blog-post p-6 rounded-lg shadow-md mb-8">
      <h3 class="text-2xl font-semibold text-navbar-green mb-4">Tilføj Ny Produkt</h3>
      <form @submit.prevent="handleAddProduct" class="space-y-4">
        <!-- Input fields for product details -->
        <div>
          <label class="block text-gray-700 font-semibold mb-2" for="name">Navn</label>
          <input
            v-model="newProduct.name"
            type="text"
            id="name"
            class="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-navbar-green"
            required
          />
        </div>
        
        <div>
          <label class="block text-gray-700 font-semibold mb-2" for="description">Kort Beskrivelse</label>
          <textarea
            v-model="newProduct.description"
            id="description"
            class="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-navbar-green"
            required
          ></textarea>
        </div>

        <div>
          <label class="block text-gray-700 font-semibold mb-2" for="fullDescription">Fuldbeskrivelse</label>
          <textarea
            v-model="newProduct.fullDescription"
            id="fullDescription"
            class="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-navbar-green"
          ></textarea>
        </div>

        <div class="flex gap-4">
          <div class="flex-1">
            <label class="block text-gray-700 font-semibold mb-2" for="price">Pris</label>
            <input
              v-model="newProduct.price"
              type="text"
              id="price"
              placeholder="e.g. DKK 250.00 eller 'Kontakt for pris'"
              class="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-navbar-green"
            />
          </div>
          <div class="flex-1">
            <label class="block text-gray-700 font-semibold mb-2" for="image">Billede (URL)</label>
            <input
              v-model="newProduct.image"
              type="text"
              id="image"
              placeholder="/img/produkter/epinutrics_epic.jpg"
              class="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-navbar-green"
            />
          </div>
        </div>

        <div>
          <label class="block text-gray-700 font-semibold mb-2" for="categories">Kategorier (kommasepareret)</label>
          <input
            v-model="categoriesInput"
            type="text"
            id="categories"
            class="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-navbar-green"
            placeholder="f.eks. mennesker, heste, hunde, katte"
          />
        </div>

        <div>
          <label class="block text-gray-700 font-semibold mb-2" for="subcategories">Underkategorier (kommasepareret)</label>
          <input
            v-model="subcategoriesInput"
            type="text"
            id="subcategories"
            class="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-navbar-green"
            placeholder="f.eks. Vitaminer & Mineraler"
          />
        </div>

        <button
          type="submit"
          class="bg-light-green text-white font-semibold py-3 px-6 rounded-lg hover:bg-dark-green transition"
        >
          Tilføj Produkt
        </button>
      </form>
    </div>

    <!-- Table displaying all products -->
    <div class="overflow-x-auto">
      <table class="min-w-full bg-blog-post border">
        <!-- Table Headers for ID, Name, Category, etc -->
        <thead>
          <tr>
            <th class="px-6 py-3 border-b text-left">#</th>
            <th class="px-6 py-3 border-b text-left">Produktnavn</th>
            <th class="px-6 py-3 border-b text-left">Kategori(er)</th>
            <th class="px-6 py-3 border-b text-left">Udvalgt</th>
            <th class="px-6 py-3 border-b text-left">Handlinger</th>
          </tr>
        </thead>
        <!-- Table Rows -->
        <tbody>
          <tr
            v-for="product in allProducts"
            :key="product.id"
            class="hover:bg-gray-50"
          >
            <!-- Display product details for edit or delete -->
            <td class="px-6 py-4 border-b">{{ product.id }}</td>
            <td class="px-6 py-4 border-b">{{ product.name }}</td>
            <td class="px-6 py-4 border-b">{{ product.categories.join(', ') }}</td>
            <td class="px-6 py-4 border-b">
              <input
                type="checkbox"
                :checked="isFeatured(product.id)" 
                @change="toggleFeatured(product.id)"
              />
            </td>
            <td class="px-6 py-4 border-b">
              <!-- Edit Button -->
              <button
                class="bg-blue-500 text-white font-semibold py-1 px-3 rounded hover:bg-blue-600 transition mr-2"
                @click="openEditModal(product)"
              >
                Rediger
              </button>

              <!-- Delete Button -->
              <button
                class="bg-red-500 text-white font-semibold py-1 px-3 rounded hover:bg-red-600 transition"
                @click="handleDelete(product.id)"
              >
                Slet
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal for editing product details -->
    <div v-if="showEditModal" class="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 p-4">
      <div class="bg-white p-6 rounded-lg shadow-md max-w-md w-full relative">
        <h3 class="text-2xl font-semibold text-navbar-green mb-4">Rediger Produkt</h3>
        <form @submit.prevent="handleEditProduct" class="space-y-4">
          <!-- Input fields for editing product details -->
          <div>
            <label class="block text-gray-700 font-semibold mb-2" for="editName">Navn</label>
            <input
              v-model="editProductData.name"
              type="text"
              id="editName"
              class="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-navbar-green"
              required
            />
          </div>
          
          <div>
            <label class="block text-gray-700 font-semibold mb-2" for="editDescription">Kort Beskrivelse</label>
            <textarea
              v-model="editProductData.description"
              id="editDescription"
              class="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-navbar-green"
              required
            ></textarea>
          </div>

          <div>
            <label class="block text-gray-700 font-semibold mb-2" for="editFullDescription">Fuldbeskrivelse</label>
            <textarea
              v-model="editProductData.fullDescription"
              id="editFullDescription"
              class="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-navbar-green"
            ></textarea>
          </div>

          <div class="flex gap-4">
            <div class="flex-1">
              <label class="block text-gray-700 font-semibold mb-2" for="editPrice">Pris</label>
              <input
                v-model="editProductData.price"
                type="text"
                id="editPrice"
                class="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-navbar-green"
              />
            </div>
            <div class="flex-1">
              <label class="block text-gray-700 font-semibold mb-2" for="editImage">Billede (URL)</label>
              <input
                v-model="editProductData.image"
                type="text"
                id="editImage"
                class="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-navbar-green"
              />
            </div>
          </div>

          <div>
            <label class="block text-gray-700 font-semibold mb-2" for="editCategories">Kategorier (kommasepareret)</label>
            <input
              v-model="editCategoriesInput"
              type="text"
              id="editCategories"
              class="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-navbar-green"
            />
          </div>

          <div>
            <label class="block text-gray-700 font-semibold mb-2" for="editSubcategories">Underkategorier (kommasepareret)</label>
            <input
              v-model="editSubcategoriesInput"
              type="text"
              id="editSubcategories"
              class="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-navbar-green"
            />
          </div>

          <div class="flex justify-end space-x-4">
            <button
              type="button"
              @click="closeEditModal"
              class="bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded hover:bg-gray-400 transition"
            >
              Annuller
            </button>
            <button
              type="submit"
              class="bg-navbar-green text-white font-semibold py-2 px-4 rounded hover:bg-green-700 transition"
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
import { useProductStore } from '../stores/productStore';
import { useFeaturedProductsStore } from '../stores/featuredProductsStore';
import { ref, onMounted } from 'vue';
import {
  getFirestore,
  collection,
  getDocs,
  updateDoc,
  doc,
  addDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { app } from '../firebase/init';

export default {
  name: 'AdminPanel',
  setup() {
    const productStore = useProductStore();
    const featuredStore = useFeaturedProductsStore();

    // Extract specific methods and properties from the product and featured stores
    const { allProducts, addProduct, updateProduct, deleteProduct } = productStore;
    const { featuredProductIds, addFeaturedProduct, removeFeaturedProduct } = featuredStore;

    // New product form fields (via Reactive object)
    const newProduct = ref({
      name: '',
      description: '',
      fullDescription: '',
      price: 'DKK 250.00',
      image: '',
      categories: [],
      subcategories: []
    });

    // Input fields for categories and subcategories
    const categoriesInput = ref('');
    const subcategoriesInput = ref('');

    // Handles adding a new product
    const handleAddProduct = () => {
      // Process categories and subcategories inputs into arrays
      newProduct.value.categories = categoriesInput.value
        .split(',')
        .map(cat => cat.trim())
        .filter(Boolean);
      newProduct.value.subcategories = subcategoriesInput.value
        .split(',')
        .map(sub => sub.trim())
        .filter(Boolean);

      // Call the addProduct function from the store
      addProduct({ ...newProduct.value });
      // Reset form inputs
      newProduct.value = {
        name: '',
        description: '',
        fullDescription: '',
        price: 'DKK 250.00',
        image: '',
        categories: [],
        subcategories: []
      };
      categoriesInput.value = '';
      subcategoriesInput.value = '';
    };

    // Edit Product Modal logic
    const showEditModal = ref(false);
    const editProductData = ref({
      id: null,
      name: '',
      description: '',
      fullDescription: '',
      price: '',
      image: '',
      categories: [],
      subcategories: []
    });
    const editCategoriesInput = ref('');
    const editSubcategoriesInput = ref('');

    // Opens the edit modal with pre-filled product data
    const openEditModal = (product) => {  // The product to edit
      editProductData.value = { ...product };
      editCategoriesInput.value = product.categories.join(', ');
      editSubcategoriesInput.value = product.subcategories.join(', ');
      showEditModal.value = true;
    };

    const closeEditModal = () => {
      showEditModal.value = false;
    };

    const handleEditProduct = () => {
      editProductData.value.categories = editCategoriesInput.value
        .split(',')
        .map(cat => cat.trim())
        .filter(Boolean);
      editProductData.value.subcategories = editSubcategoriesInput.value
        .split(',')
        .map(sub => sub.trim())
        .filter(Boolean);

      updateProduct(editProductData.value);
      closeEditModal();
    };

    // Delete Product
    const handleDelete = (productId) => {
      if (confirm('Er du sikker på at du vil slette dette produkt?')) {
        deleteProduct(productId);
      }
    };

    // Featured handling
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

    const db = getFirestore(app);
    const usersCollection = collection(db, 'users');
    const messagesCollection = collection(db, 'messages');

    const users = ref([]); // holds all user docs
    const selectedUserEmail = ref('');
    const messageContent = ref('');

    const allMessages = ref([]); // to store all messages

    // 1) Load all users from Firestore
    const loadUsers = async () => {
      const querySnapshot = await getDocs(usersCollection);
      const all = [];
      querySnapshot.forEach(docSnap => {
        all.push(docSnap.data());
      });
      users.value = all;
    };

    // 2) Promote to Elite or Demote to Regular
    const makeElite = async (userObj) => {
      // We need the doc reference. One approach: query by user email
      // For simplicity, we'll re-query to find the doc ID. In a real scenario,
      // you’d store the doc ID in the user object.
      const querySnapshot = await getDocs(usersCollection);
      querySnapshot.forEach(async (docSnap) => {
        const data = docSnap.data();
        if (data.email === userObj.email) {
          const userDocRef = doc(db, 'users', docSnap.id);
          await updateDoc(userDocRef, { role: 'elite' });
        }
      });
      // Reload users
      loadUsers();
    };

    const makeRegular = async (userObj) => {
      const querySnapshot = await getDocs(usersCollection);
      querySnapshot.forEach(async (docSnap) => {
        const data = docSnap.data();
        if (data.email === userObj.email) {
          const userDocRef = doc(db, 'users', docSnap.id);
          await updateDoc(userDocRef, { role: 'regular' });
        }
      });
      // Reload users
      loadUsers();
    };

    // ============ NEW: Messaging logic ============
    const sendAdminMessage = async () => {
      if (!selectedUserEmail.value || !messageContent.value.trim()) return;

      // Admin’s "from" can be "admin@webshop.com" or whichever is relevant
      // In real usage, you might store the admin’s email in your auth store as well.
      const newMsg = {
        from: 'admin@webshop.com',
        to: selectedUserEmail.value,
        content: messageContent.value.trim(),
        timestamp: serverTimestamp(),
      };
      await addDoc(messagesCollection, newMsg);

      // Clear input
      messageContent.value = '';
      selectedUserEmail.value = '';
      // Reload messages
      loadMessages();
    };

    // Load all messages
    const loadMessages = async () => {
      const querySnapshot = await getDocs(messagesCollection);
      const all = [];
      querySnapshot.forEach((docSnap) => {
        all.push(docSnap.data());
      });
      // Sort messages by timestamp desc
      all.sort((a, b) => b.timestamp?.seconds - a.timestamp?.seconds);
      allMessages.value = all;
    };

    onMounted(() => {
      loadUsers();
      loadMessages();
    });

    // Expose methods and data for template
    return {
      allProducts,
      isFeatured,
      toggleFeatured,
      newProduct,
      categoriesInput,
      subcategoriesInput,
      handleAddProduct,
      showEditModal,
      editProductData,
      editCategoriesInput,
      editSubcategoriesInput,
      openEditModal,
      closeEditModal,
      handleEditProduct,
      handleDelete,
      users,
      selectedUserEmail,
      messageContent,
      makeElite,
      makeRegular,
      sendAdminMessage,
      allMessages,
    };
  },
};
</script>

<style scoped>
.bg-blog-post {
  background-color: #efede4; 
}
</style>
