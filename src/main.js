import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router'; // Import the router
import './assets/style.css';
import clickOutside from './directives/clickOutside';

const app = createApp(App);
app.use(createPinia()); // Use Pinia for state management
app.use(router); // Use the router

// Register the directive globally
app.directive('click-outside', clickOutside);

app.mount('#app');