import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../views/HomePage.vue'; // The new HomePage
import AdminPanel from '../components/AdminPanel.vue';
import CategoryPage from '../views/CategoryPage.vue'; // The dynamic category page
import MenneskerPage from '../views/MenneskerPage.vue';
import HestePage from '../views/HestePage.vue'; 
import HundePage from '../views/HundePage.vue'; 
import KattePage from '../views/KattePage.vue'; 
import CartPage from '../views/CartPage.vue';
import ProductPage from '../views/ProductPage.vue';
import BlogPage from '../views/BlogPage.vue';
import BlogPostPage from '../views/BlogPostPage.vue';
import LoginPage from '../views/LoginPage.vue'; 
import RegisterPage from '../views/RegisterPage.vue';
import { useAuthStore } from '../stores/authStore';





const routes = [
  { path: '/admin', component: AdminPanel },
  { path: '/', component: HomePage }, // HomePage.vue as the homepage
  { path: '/login', component: LoginPage },
  { path: '/register', component: RegisterPage },
  { path: '/cart', component: CartPage },
  { path: '/category/mennesker', component: MenneskerPage },
  { path: '/category/heste', component: HestePage }, 
  { path: '/category/hunde', component: HundePage }, 
  { path: '/category/katte', component: KattePage }, 
  { path: '/category/:name', component: CategoryPage }, // Dynamic category page
  { path: '/product/:id', component: ProductPage },
  { path: '/blog', component: BlogPage },
  { path: '/blog/:id', component: BlogPostPage }, // Dynamic route for individual posts
 
 
  

];

const router = createRouter({
  history: createWebHistory(),
  routes,
  linkActiveClass: 'active-link', // Customize the active link class globally
  linkExactActiveClass: 'exact-active-link', // For exact matches only
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();

  // Define routes that require authentication
  const authRequiredRoutes = ['/admin', '/cart'];

  if (authRequiredRoutes.includes(to.path) && !authStore.isAuthenticated()) {
    next({
      path: '/login',
      query: { redirect: to.fullPath }, // Add the unauthenticated user's intended route as a query parameter to the login URL
    });
  } else {
    next();
  }
});

export default router;