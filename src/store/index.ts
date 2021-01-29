import { createStore } from 'vuex';
import createPersistedState from 'vuex-persistedstate';

import auth from './modules/auth';
import order from './modules/order';

const store = createStore({
  state: {},
  getters: {},
  actions: {},
  mutations: {},
  modules: {
    auth,
    order
  },
  plugins: [createPersistedState()]
});

export default store;
