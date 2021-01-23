import { ActionContext } from 'vuex';
import axios from 'axios';

import User from '@/interfaces/user';
import AuthModuleState from '@/interfaces/auth-module-state';
import RootState from '@/interfaces/root-state';
import determineErrorMessage from '@/utils/error-message';

interface SaveCredentialsPayload {
  accessToken: string;
  currentUser: User;
}

const FIFTEEN_MINUTES = 60 * 15 * 1000;

const state: AuthModuleState = {
  accessToken: null,
  currentUser: null,
  nextRefreshTimestamp: null,
  silentRefreshTimeout: null
};

const getters = {
  accessToken: (state: AuthModuleState) => state.accessToken,
  currentUser: (state: AuthModuleState) => state.currentUser,
  isAuthenticated: (state: AuthModuleState) =>
    !!state.accessToken && !!state.currentUser,
  nextRefreshTimestamp: (state: AuthModuleState) => state.nextRefreshTimestamp,
  silentRefreshTimeout: (state: AuthModuleState) => state.silentRefreshTimeout
};

const actions = {
  async register(
    { commit, dispatch }: ActionContext<AuthModuleState, RootState>,
    user: User
  ) {
    try {
      const res = await axios.post('/api/auth/register', user);
      const accessToken = res.headers.authorization;
      const currentUser = res.data;

      commit('saveCredentials', { accessToken, currentUser });
      await dispatch('silentRefresh', { timeout: FIFTEEN_MINUTES });
    } catch (error) {
      const message = determineErrorMessage(error);

      throw new Error(message);
    }
  },
  async logIn(
    { commit, dispatch }: ActionContext<AuthModuleState, RootState>,
    user: User
  ) {
    try {
      const res = await axios.post('/api/auth/login', user);
      const accessToken = res.headers.authorization;
      const currentUser = res.data;

      commit('saveCredentials', { accessToken, currentUser });
      await dispatch('silentRefresh', { timeout: FIFTEEN_MINUTES });
    } catch (error) {
      const message = determineErrorMessage(error);

      throw new Error(message);
    }
  },
  silentRefresh(
    { commit, dispatch }: ActionContext<AuthModuleState, RootState>,
    { timeout }: { timeout: number }
  ) {
    return new Promise<number>((resolve, reject) => {
      const silentRefreshTimeout = setTimeout(() => {
        axios
          .post('/api/auth/refresh', {})
          .then((res) => {
            const accessToken = res.headers.authorization;
            const currentUser = res.data;

            commit('saveCredentials', { accessToken, currentUser });
            dispatch('silentRefresh', { timeout: FIFTEEN_MINUTES });
          })
          .catch((error) => {
            const message = determineErrorMessage(error);

            reject(new Error(message));
          });
      }, timeout);

      commit('setRefreshTimeout', silentRefreshTimeout);
      resolve(silentRefreshTimeout);
    });
  }
};

const mutations = {
  saveCredentials(
    state: AuthModuleState,
    { accessToken, currentUser }: SaveCredentialsPayload
  ) {
    state.accessToken = accessToken;
    state.currentUser = currentUser;
    state.nextRefreshTimestamp = new Date().getTime() + FIFTEEN_MINUTES;
  },
  setRefreshTimeout(state: AuthModuleState, id: number | null) {
    state.silentRefreshTimeout = id;
  },
  logOut(state: AuthModuleState) {
    state.accessToken = null;
    state.currentUser = null;
    state.nextRefreshTimestamp = null;
    state.silentRefreshTimeout = null;
  }
};

const auth = {
  state,
  getters,
  actions,
  mutations
};

export default auth;
