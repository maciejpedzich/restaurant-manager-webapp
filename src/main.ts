import { createApp } from 'vue';

import PrimeVue from 'primevue/config';
import 'primevue/resources/primevue.min.css';
import 'primeflex/primeflex.css';
import 'primevue/resources/themes/saga-green/theme.css';
import 'primeicons/primeicons.css';

import App from './App.vue';
import router from './router';

const app = createApp(App);

app
  .use(PrimeVue)
  .use(router)
  .mount('#app');
