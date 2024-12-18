import { ref } from 'vue';
// Import Firestore functions
import { getFirestore, collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { app } from '../firebase/init'; // Make sure to export `app` from init.js

// Initialize Firestore
const db = getFirestore(app);
const productsCollection = collection(db, 'products');

export const useProductStore = () => {
  const allProducts = ref([]);

  // Fetch products from Firestore
  const fetchProducts = async () => {
    const querySnapshot = await getDocs(productsCollection);
    const products = [];
    querySnapshot.forEach((docSnap) => {
      // docSnap.data() contains the product fields
      const productData = docSnap.data();
      products.push({
        ...productData,
        id: parseInt(docSnap.id, 10)  // Convert docSnap.id to a number
      });
    });
    allProducts.value = products;
  };

  // Call fetchProducts once on store initialization
  fetchProducts().catch(console.error);

  // Utility method: If Firestore docs don't store `id` in the data itself,
  // you can map them by using docSnap.id and store it into the product object.
  // In that case, ensure that each doc has a unique ID assigned by Firestore.

  // Adds a new product to Firestore and store
  const addProduct = async (newProduct) => {
    // Generate a unique ID client-side or rely on Firestore's auto-ID
    // Remove the line that generated ID from array since Firestore does it
    // Example: We can let Firestore generate an ID automatically
    const docRef = await addDoc(productsCollection, {
      ...newProduct,
      // If you used 'id' in your code heavily, you can store it too:
      // But commonly we use doc().id after creation.
      // Firestore auto-generated ID can be obtained via docRef.id
    });

    // After adding, if you need the ID in your local state:
    const addedProduct = { ...newProduct, id: docRef.id };
    allProducts.value.push(addedProduct);
  };

  // Updates an existing product in Firestore and store
  const updateProduct = async (updatedProduct) => {
    // You must have a way to find the product's Firestore doc. 
    // If doc IDs are the same as product IDs, use that:
    const docRef = doc(db, 'products', updatedProduct.id.toString()); 
    await updateDoc(docRef, { ...updatedProduct });
    
    const index = allProducts.value.findIndex(p => p.id === updatedProduct.id);
    if (index !== -1) {
      allProducts.value[index] = { ...updatedProduct };
    }
  };

  // Removes a product from Firestore and store
  const deleteProduct = async (productId) => {
    const docRef = doc(db, 'products', productId.toString());
    await deleteDoc(docRef);

    allProducts.value = allProducts.value.filter(p => p.id !== productId);
  };

  // Filter methods remain the same, they just operate on `allProducts.value`
  const getProductsByCategory = (category) => {
    return allProducts.value.filter((product) =>
      product.categories.includes(category)
    );
  };

  const getProductsByCategoryAndSubcategory = (category, subcategory) => {
    return allProducts.value.filter(
      (product) =>
        product.categories.includes(category) &&
        product.subcategories.includes(subcategory)
    );
  };

  const getSubcategoriesByCategory = (category) => {
    const subcategoriesSet = new Set();
    allProducts.value.forEach((product) => {
      if (product.categories.includes(category)) {
        if (product.subcategories.length > 0) {
          product.subcategories.forEach((subcat) => subcategoriesSet.add(subcat));
        }
      }
    });
    return Array.from(subcategoriesSet);
  };

  return {
    allProducts,
    getProductsByCategory,
    getProductsByCategoryAndSubcategory,
    getSubcategoriesByCategory,
    addProduct,
    updateProduct,
    deleteProduct,
  };
};