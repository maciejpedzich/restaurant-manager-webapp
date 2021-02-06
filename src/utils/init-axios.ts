import AuthModuleState from '@/interfaces/states/auth-module';
import RootState from '@/interfaces/states/root';
import axios from 'axios';
import store from '../store';

export default function initAxios() {
  axios.defaults.baseURL = process.env.VUE_APP_API_URL;
  axios.defaults.withCredentials = true;

  axios.interceptors.request.use(
    (config) => {
      const state = (store.state as RootState).auth as AuthModuleState;
      const accessToken = state.accessToken;
      const isAuthenticated = !!state.accessToken && !!state.currentUser;

      config.headers.common['Authorization'] = isAuthenticated
        ? `Bearer ${accessToken}`
        : null;

      return config;
    },
    (error) => Promise.reject(error)
  );
}
