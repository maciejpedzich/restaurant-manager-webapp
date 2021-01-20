import { ActionContext } from 'vuex';
import axios, { AxiosError } from 'axios';

import User from '@/interfaces/user';
import AuthModuleState from '@/interfaces/auth-module-state';
import SaveCredentialsPayload from '@/interfaces/save-credentials-payload';

const FIFTEEN_MINUTES = 60 * 15 * 1000;

const state: AuthModuleState = {
  accessToken: null,
  currentUser: null,
  nextRefreshTimestamp: null,
  silentRefreshTimeout: null
};

const getters = {
  accessToken: (state: AuthModuleState) => state.accessToken,
  user: (state: AuthModuleState) => state.currentUser,
  isAuthenticated: (state: AuthModuleState) =>
    !!state.accessToken && !!state.currentUser,
  nextRefreshTimestamp: (state: AuthModuleState) => state.nextRefreshTimestamp,
  silentRefreshTimeout: (state: AuthModuleState) => state.silentRefreshTimeout
};

const actions = {
  async register(
    { commit, dispatch }: ActionContext<AuthModuleState, {}>,
    user: User
  ) {
    try {
      const res = await axios.post('/api/auth/register', user);
      const accessToken = res.headers.authorization;
      const currentUser = res.data;

      commit('saveCredentials', { accessToken, currentUser });
      await dispatch('silentRefresh', { timeout: FIFTEEN_MINUTES });
    } catch (error) {
      const errRes = (error as AxiosError).response;
      const message = errRes
        ? errRes.data.message
        : 'An unexpected application error occurred';

      throw new Error(message);
    }
  },
  async logIn(
    { commit, dispatch }: ActionContext<AuthModuleState, {}>,
    user: User
  ) {
    try {
      const res = await axios.post('/api/auth/login', user);
      const accessToken = res.headers.authorization;
      const currentUser = res.data;

      commit('saveCredentials', { accessToken, currentUser });
      await dispatch('silentRefresh', { timeout: FIFTEEN_MINUTES });
    } catch (error) {
      const errRes = (error as AxiosError).response;
      const message = errRes
        ? errRes.data.message
        : 'An unexpected application error occurred';

      throw new Error(message);
    }
  },
  silentRefresh(
    { state, commit, dispatch }: ActionContext<AuthModuleState, {}>,
    { timeout }: { timeout: number }
  ) {
    return new Promise<number>((resolve, reject) => {
      const silentRefreshTimeout = setTimeout(() => {
        axios
          .post(
            '/api/auth/refresh',
            {},
            { headers: { Authorization: `Bearer ${state.accessToken}` } }
          )
          .then((res) => {
            const accessToken = res.headers.authorization;
            const currentUser = res.data;

            commit('saveCredentials', { accessToken, currentUser });
            dispatch('silentRefresh', { timeout: FIFTEEN_MINUTES });
          })
          .catch((error) => {
            const res = (error as AxiosError).response;
            const message = res
              ? res.data.message
              : 'An unexpected application error occurred';

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
