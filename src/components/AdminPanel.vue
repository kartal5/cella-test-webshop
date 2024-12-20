<template>
  <section class="container mt-10 mx-auto px-4 md:px-10">
    
    <h2 class="text-3xl font-bold text-left text-navbar-green mb-8">Admin Panel</h2>


    <!-- Add New Product Form & see admins online or ofline -->
    <div class="bg-blog-post p-6 rounded-lg shadow-md mb-8">
      <h3 class="text-3xl font-bold text-left text-navbar-green mb-3">Admin</h3>
    <div>
      <div class="bg-blog-post p-6 rounded-lg shadow-md mb-1">
          <!-- Grid container for admins -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div v-for="admin in admins" :key="admin.id" class="flex items-center p-1 bg-white rounded-lg shadow-md mb-1">
        <!-- Admin profile picture -->
        <img :src="admin.picture" alt="Admin Picture" class="w-16 h-16 rounded-full mr-4">
        <!-- Admin information -->
        <div class="flex-1">
          <!-- Admin name -->
          <h3 class="text-xl font-semibold">{{ admin.name }}</h3>
           <!-- Admin email -->
           <p class="text-gray-700">{{ admin.email }}</p>
          <!-- Online/Offline status -->
          <p :class="{'text-green-500': admin.online, 'text-red-500': !admin.online}">
            {{ admin.online ? 'Online' : 'Offline' }}
          </p>
        </div>

        
        <!-- Direct message icon -->
        <a href="#" @click.prevent="openMessageModal(admin)" class="text-gray-500 hover:text-gray-700 mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12.713l11.985-6.713-11.985-6.713-11.985 6.713 11.985 6.713zm0 2.287l-12-6.75v11.75h24v-11.75l-12 6.75z"/>
                </svg>
              </a>
      </div>
    </div>
  </div>

  <br>

 <!-- Modal for sending direct message -->
 <div v-if="showMessageModal" class="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 p-4">
      <div class="bg-white p-6 rounded-lg shadow-md max-w-md w-full relative">
        <h3 class="text-2xl font-semibold text-navbar-green mb-4">Send Besked til {{ selectedAdmin.name }}</h3>
        <form @submit.prevent="sendMessage">
          <div>
            <label class="block text-gray-700 font-semibold mb-2" for="message">Besked</label>
            <textarea
              v-model="message"
              id="message"
              class="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-navbar-green"
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
              class="bg-navbar-green text-white font-semibold py-2 px-4 rounded hover:bg-green-700 transition"
            >
              Send Besked
            </button>
          </div>
        </form>
      </div>
    </div>


    </div>
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
          class="bg-navbar-green text-white font-semibold py-3 px-6 rounded-lg hover:bg-green-700 transition"
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
import { ref } from 'vue';
import { useAuthStore } from '../stores/authStore'; // Import the auth store

export default {
  name: 'AdminPanel',
  setup() {
    const authStore = useAuthStore(); // Access the auth store

    const admins = ref([
      { id: 1, name: 'Helene', email: 'Zentia88@live.dk', picture: '/public/img/logo.png', online: true },
      { id: 2, name: 'Maria',  email: 'maria@example.com', picture: '/public/img/logo.png', online: false },
      { id: 3, name: 'Emilie', email:'emilie@example.com', picture: '/public/img/logo.png', online: true },
      { id: 4, name: 'Seyyit', email: 'seyyit@example.com', picture: '/public/img/logo.png', online: false }
    ]);

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
    const sendMessage = () => {
      // Handle sending message logic here
      const currentUserEmail = authStore.user.email; // Get the current user's email from the auth store
      console.log(`Send message to: ${selectedAdmin.value.name} (${selectedAdmin.value.email}) from ${currentUserEmail}`);
      console.log(`Message: ${message.value}`);
      // Implement the logic to send an email or message here
      closeMessageModal();
    };

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
      admins,
      sendMessage,
      showMessageModal,
      openMessageModal,
      selectedAdmin,
      closeMessageModal,
      message,
    };
  },
};
</script>

<style scoped>
.bg-blog-post {
  background-color: #efede4; 
}
</style>
