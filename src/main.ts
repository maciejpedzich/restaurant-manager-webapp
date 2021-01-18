import { createApp } from 'vue';
import axios from 'axios';

import PrimeVue from 'primevue/config';
import ToastService from 'primevue/toastservice';
import 'primevue/resources/primevue.min.css';
import 'primeflex/primeflex.css';
import 'primevue/resources/themes/saga-green/theme.css';
import 'primeicons/primeicons.css';

import App from './App.vue';
import router from './router';

axios.defaults.baseURL = process.env.VUE_APP_API_URL;
axios.defaults.withCredentials = true;

const app = createApp(App);

app
  .use(PrimeVue)
  .use(ToastService)
  .use(router)
  .mount('#app');
