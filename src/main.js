import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import './assets/styles/global.css';
import '@fortawesome/fontawesome-free/css/all.css';
import Toast from 'vue-toastification';
import 'vue-toastification/dist/index.css';

const app = createApp(App);
const pinia = createPinia();

const options = {};

app.use(Toast, options);
app.use(router);
app.use(pinia);
app.mount('#app');
