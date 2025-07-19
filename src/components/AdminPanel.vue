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
      <div class="bg-blog-post p-3 rounded-lg shadow-md">
        <h3 class="text-2xl font-semibold text-navbar-green mb-3">Produktliste</h3>
        
        <!-- Search Box -->
        <div class="mb-3 flex justify-center">
          <input
            v-model="adminSearch"
            type="text"
            placeholder="🔍 Søg listen af produkter..."
            class="border p-3 rounded-lg shadow-md w-full max-w-lg focus:outline-none focus:ring-2 focus:ring-navbar-green"
          />
        </div>

        <!-- Desktop Table View (hidden on mobile) -->
        <div class="hidden md:block overflow-x-auto">
          <table class="min-w-full table-auto text-sm bg-white border">
            <thead class="sticky top-0 bg-gray-50">
              <tr>
                <th class="px-2 py-2 border-b text-left">#</th>
                <th class="px-2 py-2 border-b text-left">Produktnavn</th>
                <th class="px-2 py-2 border-b text-left">Elite Discount (%)</th>
                <th class="px-2 py-2 border-b text-left">Kategori(er)</th>
                <th class="px-2 py-2 border-b text-left">Udvalgt</th>
                <th class="px-2 py-2 border-b text-left">Handlinger</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="product in paginatedProducts" :key="product.id" class="hover:bg-gray-50">
                <td class="px-2 py-2 border-b">{{ product.id }}</td>
                <td class="px-2 py-2 border-b">{{ product.name }}</td>
                <td class="px-2 py-2 border-b">{{ product.eliteDiscount ?? 0 }}</td>
                <td class="px-2 py-2 border-b">{{ product.categories.join(', ') }}</td>
                <td class="px-2 py-2 border-b">
                  <input
                    type="checkbox"
                    :checked="isFeatured(product.id)"
                    @change="toggleFeatured(product.id)"
                    class="w-4 h-4 cursor-pointer"
                  />
                </td>
                <td class="px-2 py-2 border-b">
                  <div class="flex space-x-2">
                    <button 
                      class="px-3 py-1 rounded border border-green-500 text-green-800 hover:bg-green-50 transition bg-green-200" 
                      @click="openEditModal(product)"
                    >
                      Rediger
                    </button>
                    <button 
                      class="px-3 py-1 rounded border border-red-500 text-red-800 hover:bg-red-50 transition bg-red-200" 
                      @click="handleDelete(product.id)"
                    >
                      Slet
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Mobile Card View (visible only on mobile) -->
        <div class="md:hidden space-y-3">
          <div 
            v-for="product in paginatedProducts" 
            :key="product.id" 
            class="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
          >
            <!-- Product Header -->
            <div class="flex justify-between items-start mb-3">
              <div class="flex-1">
                <h4 class="font-semibold text-gray-900 text-lg">{{ product.name }}</h4>
                <p class="text-sm text-gray-500 mt-1">ID: {{ product.id }}</p>
              </div>
              <label class="flex items-center">
                <input
                  type="checkbox"
                  :checked="isFeatured(product.id)"
                  @change="toggleFeatured(product.id)"
                  class="w-5 h-5 cursor-pointer mr-2"
                />
                <span class="text-sm text-gray-600">Udvalgt</span>
              </label>
            </div>

            <!-- Product Details -->
            <div class="space-y-2 mb-4">
              <div class="flex items-center text-sm">
                <span class="text-gray-600 font-medium mr-2">Kategorier:</span>
                <span class="text-gray-800">{{ product.categories.join(', ') || 'Ingen' }}</span>
              </div>
              <div class="flex items-center text-sm">
                <span class="text-gray-600 font-medium mr-2">Elite Discount:</span>
                <span class="text-gray-800 font-semibold">{{ product.eliteDiscount ?? 0 }}%</span>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex gap-2">
              <button 
                class="flex-1 px-3 py-2 rounded border border-green-500 text-green-800 hover:bg-green-50 transition bg-green-100 font-medium text-sm" 
                @click="openEditModal(product)"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Rediger
              </button>
              <button 
                class="flex-1 px-3 py-2 rounded border border-red-500 text-red-800 hover:bg-red-50 transition bg-red-100 font-medium text-sm" 
                @click="handleDelete(product.id)"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Slet
              </button>
            </div>
          </div>
        </div>

        <!-- Pagination Controls (Responsive) -->
        <div class="mt-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 text-sm">
          <!-- Results Info -->
          <div class="text-gray-600 text-center sm:text-left">
            <span class="hidden sm:inline">
              Viser {{ (currentPage - 1) * itemsPerPage + 1 }} til 
              {{ Math.min(currentPage * itemsPerPage, filteredProducts.length) }} af 
              {{ filteredProducts.length }} produkter
            </span>
            <span class="sm:hidden">
              {{ filteredProducts.length }} produkter (side {{ currentPage }}/{{ totalPages }})
            </span>
          </div>
          
          <!-- Pagination Buttons -->
          <div class="flex justify-center items-center space-x-2">
            <!-- Previous Button -->
            <button
              @click="currentPage--"
              :disabled="currentPage === 1"
              class="px-3 py-1.5 rounded border bg-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition"
              :class="currentPage === 1 ? 'border-gray-200' : 'border-gray-300'"
            >
              <span class="hidden sm:inline">Forrige</span>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 sm:hidden" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <!-- Page Numbers (Desktop) -->
            <div class="hidden sm:flex items-center space-x-1">
              <span class="px-3 py-1">
                Side {{ currentPage }} af {{ totalPages }}
              </span>
            </div>
            
            <!-- Page Indicator (Mobile) -->
            <div class="sm:hidden flex items-center space-x-1">
              <span class="px-2 py-1 text-sm font-medium">
                {{ currentPage }}/{{ totalPages }}
              </span>
            </div>
            
            <!-- Next Button -->
            <button
              @click="currentPage++"
              :disabled="currentPage === totalPages"
              class="px-3 py-1.5 rounded border bg-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition"
              :class="currentPage === totalPages ? 'border-gray-200' : 'border-gray-300'"
            >
              <span class="hidden sm:inline">Næste</span>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 sm:hidden" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
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
      <div class="bg-blog-post p-3 rounded-lg shadow-md">
        <h3 class="text-2xl font-semibold text-navbar-green mb-4">Brugerstyring</h3>
        
        <!-- Search box for users -->
        <div class="mb-3">
          <input
            v-model="userSearch"
            type="text"
            placeholder="🔍 Søg brugere..."
            class="border p-1 rounded-lg w-full max-w-md focus:outline-none focus:ring-2 focus:ring-navbar-green text-sm"
          />
        </div>

        <!-- Scrollable user table -->
        <div class="overflow-x-auto max-h-[400px] overflow-y-auto">
          <table class="min-w-full table-auto bg-white border">
            <thead class="sticky top-0 bg-gray-50">
              <tr>
                <th class="px-2 py-2 border-b text-left">Email</th>
                <th class="px-2 py-2 border-b text-left hidden md:table-cell">Nuværende Rolle</th>
                <th class="px-2 py-2 border-b text-left">Skift Rolle</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(user, index) in filteredUsers" :key="index" class="hover:bg-gray-50">
                <td class="px-2 py-2 border-b">
                  <span class="block font-medium text-gray-900">{{ user.email }}</span>
                  <span class="block text-xs text-gray-500 md:hidden capitalize">
                    Rolle: {{ user.role }}
                  </span>
                </td>
                <td class="px-2 py-2 border-b capitalize hidden md:table-cell">
                  {{ user.role }}
                </td>
                <td class="px-2 py-2 border-b">
                  <select 
                    v-model="user.role" 
                    @change="updateUserRole(user)" 
                    class="border p-1 rounded w-full bg-white focus:outline-none focus:ring-2 focus:ring-navbar-green text-sm"
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
        
        <!-- Validation Summary -->
        <div v-if="hasValidationErrors" class="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <h4 class="text-red-800 font-semibold mb-2">Venligst ret følgende fejl:</h4>
          <ul class="text-red-700 text-sm space-y-1">
            <li v-for="error in validationErrorsList" :key="error">• {{ error }}</li>
          </ul>
        </div>

        <form @submit.prevent="handleAddProduct" class="space-y-4">
          <!-- Name -->
          <div>
            <label class="block text-gray-700 font-semibold mb-2">
              Navn <span class="text-red-500">*</span>
            </label>
            <input
              v-model="newProduct.name"
              type="text"
              :class="[
                'w-full p-2 border rounded-lg focus:outline-none focus:ring-2',
                validationErrors.name ? 'border-red-500 focus:ring-red-500' : 'focus:ring-navbar-green'
              ]"
              @input="clearFieldError('name')"
            />
            <p v-if="validationErrors.name" class="text-red-500 text-sm mt-1">{{ validationErrors.name }}</p>
          </div>

          <!-- Description -->
          <div>
            <label class="block text-gray-700 font-semibold mb-2">
              Kort Beskrivelse <span class="text-red-500">*</span>
            </label>
            <textarea
              v-model="newProduct.description"
              :class="[
                'w-full p-2 border rounded-lg focus:outline-none focus:ring-2',
                validationErrors.description ? 'border-red-500 focus:ring-red-500' : 'focus:ring-navbar-green'
              ]"
              rows="2"
              @input="clearFieldError('description')"
            ></textarea>
            <p v-if="validationErrors.description" class="text-red-500 text-sm mt-1">{{ validationErrors.description }}</p>
          </div>

          <!-- Price and Elite Discount -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-gray-700 font-semibold mb-2">Pris</label>
              <input
                v-model="newProduct.price"
                type="text"
                placeholder="DKK 250.00 eller 'Kontakt for pris'"
                :class="[
                  'w-full p-2 border rounded-lg focus:outline-none focus:ring-2',
                  validationErrors.price ? 'border-red-500 focus:ring-red-500' : 'focus:ring-navbar-green'
                ]"
                @input="clearFieldError('price')"
              />
              <p v-if="validationErrors.price" class="text-red-500 text-sm mt-1">{{ validationErrors.price }}</p>
            </div>
            <div>
              <label class="block text-gray-700 font-semibold mb-2">Elite Discount (%)</label>
              <input
                v-model="newProduct.eliteDiscount"
                type="number"
                min="0"
                max="100"
                step="1"
                :class="[
                  'w-full p-2 border rounded-lg focus:outline-none focus:ring-2',
                  validationErrors.eliteDiscount ? 'border-red-500 focus:ring-red-500' : 'focus:ring-navbar-green'
                ]"
                @input="clearFieldError('eliteDiscount')"
              />
              <p v-if="validationErrors.eliteDiscount" class="text-red-500 text-sm mt-1">{{ validationErrors.eliteDiscount }}</p>
            </div>
          </div>

          <!-- Image URL -->
          <div>
            <label class="block text-gray-700 font-semibold mb-2">Billede URL</label>
            <input
              v-model="newProduct.image"
              type="url"
              placeholder="https://example.com/image.jpg"
              :class="[
                'w-full p-2 border rounded-lg focus:outline-none focus:ring-2',
                validationErrors.image ? 'border-red-500 focus:ring-red-500' : 'focus:ring-navbar-green'
              ]"
              @input="clearFieldError('image')"
            />
            <p v-if="validationErrors.image" class="text-red-500 text-sm mt-1">{{ validationErrors.image }}</p>
          </div>

          <!-- Categories and Subcategories -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-gray-700 font-semibold mb-2">
                Kategorier <span class="text-red-500">*</span>
              </label>
              <select 
                v-model="selectedCategories" 
                multiple 
                :class="[
                  'w-full p-2 border rounded-lg focus:outline-none focus:ring-2',
                  validationErrors.categories ? 'border-red-500 focus:ring-red-500' : 'focus:ring-navbar-green'
                ]"
                size="4"
                @change="clearFieldError('categories')"
              >
                <option v-for="cat in availableCategories" :key="cat" :value="cat">{{ cat }}</option>
              </select>
              <p class="text-xs text-gray-500 mt-1">Hold Ctrl/Cmd for at vælge flere</p>
              <p v-if="validationErrors.categories" class="text-red-500 text-sm mt-1">{{ validationErrors.categories }}</p>
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
              <p class="text-xs text-gray-500 mt-1">Hold Ctrl/Cmd for at vælge flere</p>
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
              placeholder="Detaljeret beskrivelse af produktet..."
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
              :disabled="isSubmitting"
              :class="[
                'font-semibold py-2 px-4 rounded transition',
                isSubmitting 
                  ? 'bg-gray-400 text-gray-600 cursor-not-allowed' 
                  : 'bg-light-green text-white hover:bg-dark-green'
              ]"
            >
              {{ isSubmitting ? 'Tilføjer...' : 'Tilføj Produkt' }}
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

    // ==================== Validation State ====================
    const validationErrors = ref({});
    const isSubmitting = ref(false);

    const hasValidationErrors = computed(() => {
      return Object.keys(validationErrors.value).length > 0;
    });

    const validationErrorsList = computed(() => {
      return Object.values(validationErrors.value);
    });

    // ==================== Validation Rules ====================
    const validateProduct = (product, categories, subcategories) => {
      const errors = {};

      // Name validation
      if (!product.name?.trim()) {
        errors.name = 'Produktnavn er påkrævet';
      } else if (product.name.trim().length < 2) {
        errors.name = 'Produktnavn skal være mindst 2 tegn langt';
      } else if (product.name.trim().length > 100) {
        errors.name = 'Produktnavn må ikke overstige 100 tegn';
      }

      // Description validation
      if (!product.description?.trim()) {
        errors.description = 'Kort beskrivelse er påkrævet';
      } else if (product.description.trim().length < 10) {
        errors.description = 'Kort beskrivelse skal være mindst 10 tegn lang';
      } else if (product.description.trim().length > 500) {
        errors.description = 'Kort beskrivelse må ikke overstige 500 tegn';
      }

      // Price validation
      if (product.price?.trim()) {
        const priceStr = product.price.trim();
        // Check if it's a valid price format (DKK followed by number) or "Kontakt for pris"
        const priceRegex = /^(DKK\s*\d+([.,]\d{1,2})?|Kontakt for pris)$/i;
        if (!priceRegex.test(priceStr)) {
          errors.price = 'Pris skal være i format "DKK 250.00" eller "Kontakt for pris"';
        }
      }

      // Elite discount validation
      if (product.eliteDiscount !== null && product.eliteDiscount !== undefined && product.eliteDiscount !== '') {
        const discount = Number(product.eliteDiscount);
        if (isNaN(discount) || discount < 0 || discount > 100) {
          errors.eliteDiscount = 'Elite discount skal være mellem 0 og 100';
        }
      }

      // Image URL validation
      if (product.image?.trim()) {
        try {
          new URL(product.image.trim());
          // Check if it's a valid image URL format
          const imageExtensions = /\.(jpg|jpeg|png|gif|webp|svg)$/i;
          const hasImageExtension = imageExtensions.test(product.image.trim());
          const isImageService = /\/(images|img|media|photo|picture)/i.test(product.image.trim());
          
          if (!hasImageExtension && !isImageService) {
            errors.image = 'Billede URL skal pege på et gyldigt billede';
          }
        } catch {
          errors.image = 'Billede URL skal være en gyldig URL';
        }
      }

      // Categories validation
      if (!categories || categories.length === 0) {
        errors.categories = 'Mindst én kategori skal vælges';
      }

      // Full description validation (optional but if provided, should meet criteria)
      if (product.fullDescription?.trim() && product.fullDescription.trim().length > 2000) {
        errors.fullDescription = 'Fuldbeskrivelse må ikke overstige 2000 tegn';
      }

      return errors;
    };

    const clearFieldError = (fieldName) => {
      if (validationErrors.value[fieldName]) {
        const newErrors = { ...validationErrors.value };
        delete newErrors[fieldName];
        validationErrors.value = newErrors;
      }
    };

    const clearAllErrors = () => {
      validationErrors.value = {};
    };

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
      price: '',
      image: '',
      categories: [],
      subcategories: [],
      eliteDiscount: 0,
    });
    const selectedCategories = ref([]);
    const selectedSubcategories = ref([]);

    const closeAddProductModal = () => {
      showAddProductModal.value = false;
      clearAllErrors();
      // Reset form
      newProduct.value = {
        name: '',
        description: '',
        fullDescription: '',
        price: '',
        image: '',
        categories: [],
        subcategories: [],
        eliteDiscount: 0,
      };
      selectedCategories.value = [];
      selectedSubcategories.value = [];
    };

    const handleAddProduct = async () => {
      isSubmitting.value = true;
      clearAllErrors();
      
      try {
        // Validate the product
        const errors = validateProduct(newProduct.value, selectedCategories.value, selectedSubcategories.value);
        
        if (Object.keys(errors).length > 0) {
          validationErrors.value = errors;
          return;
        }

        // Check for duplicate product names
        const existingProduct = allProducts.value.find(
          p => p.name.toLowerCase().trim() === newProduct.value.name.toLowerCase().trim()
        );
        
        if (existingProduct) {
          validationErrors.value = { name: 'Et produkt med dette navn eksisterer allerede' };
          return;
        }

        // Prepare product data
        const productData = {
          ...newProduct.value,
          name: newProduct.value.name.trim(),
          description: newProduct.value.description.trim(),
          fullDescription: newProduct.value.fullDescription?.trim() || '',
          price: newProduct.value.price?.trim() || 'Kontakt for pris',
          image: newProduct.value.image?.trim() || '',
          categories: selectedCategories.value,
          subcategories: selectedSubcategories.value,
          eliteDiscount: Number(newProduct.value.eliteDiscount) || 0,
        };

        // Add the product
        await addProduct(productData);
        closeAddProductModal();
        
        // Show success message (you can implement a toast notification here)
        console.log('Produkt tilføjet succesfuldt!');
        
      } catch (error) {
        console.error('Error adding product:', error);
        validationErrors.value = { general: 'Der opstod en fejl ved tilføjelse af produktet' };
      } finally {
        isSubmitting.value = false;
      }
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

      // Validation
      validationErrors,
      hasValidationErrors,
      validationErrorsList,
      clearFieldError,
      isSubmitting,

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

/* Error input styling */
.border-red-500 {
  border-color: #ef4444;
}

.focus\:ring-red-500:focus {
  ring-color: #ef4444;
}

/* Success styling for valid inputs */
.border-green-500 {
  border-color: #10b981;
}

.focus\:ring-green-500:focus {
  ring-color: #10b981;
}

</style>