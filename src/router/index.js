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

const routes = [
  { path: '/admin', component: AdminPanel },
  { path: '/', component: HomePage }, // HomePage.vue as the homepage
  { path: '/cart', component: CartPage },
  { path: '/category/:name', component: CategoryPage }, // Dynamic category page
  { path: '/category/mennesker', component: MenneskerPage },
  { path: '/category/heste', component: HestePage }, 
  { path: '/category/hunde', component: HundePage }, 
  { path: '/category/katte', component: KattePage }, 
  { path: '/product/:id', component: ProductPage },
  { path: '/blog', component: BlogPage },
  { path: '/blog/:id', component: BlogPostPage }, // Dynamic route for individual posts

];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
