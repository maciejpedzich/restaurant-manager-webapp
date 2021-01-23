import { createApp } from 'vue';

import PrimeVue from 'primevue/config';
import ToastService from 'primevue/toastservice';
import 'primevue/resources/primevue.min.css';
import 'primeflex/primeflex.css';
import 'primevue/resources/themes/saga-green/theme.css';
import 'primeicons/primeicons.css';

import App from './App.vue';
import store from './store';
import router from './router';
import initAxios from './utils/init-axios';

const app = createApp(App);

initAxios();

app
  .use(store)
  .use(router)
  .use(PrimeVue)
  .use(ToastService)
  .mount('#app');
