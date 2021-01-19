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
  nextRefreshTimestamp: (state: AuthModuleState) => state.nextRefreshTimestamp
};

const actions = {
  register({ commit }: ActionContext<AuthModuleState, {}>, user: User) {
    return new Promise<void>(async (resolve, reject) => {
      try {
        const res = await axios.post('/api/auth/register', user);
        const accessToken = res.headers.authorization;
        const currentUser = res.data;

        commit('saveCredentials', { accessToken, currentUser });
        resolve();
      } catch (error) {
        const res = (error as AxiosError).response;
        const message = res
          ? res.data.message
          : 'An unexpected application error occurred';

        reject(new Error(message));
      }
    });
  },
  logIn({ commit }: ActionContext<AuthModuleState, {}>, user: User) {
    return new Promise<void>(async (resolve, reject) => {
      try {
        const res = await axios.post('/api/auth/login', user);
        const accessToken = res.headers.authorization;
        const currentUser = res.data;

        commit('saveCredentials', { accessToken, currentUser });
        resolve();
      } catch (error) {
        const res = (error as AxiosError).response;
        const message = res
          ? res.data.message
          : 'An unexpected application error occurred';

        reject(new Error(message));
      }
    });
  },
  silentRefresh(
    { state, dispatch, commit }: ActionContext<AuthModuleState, {}>,
    payload: { timeout: number }
  ) {
    state.silentRefreshTimeout = setTimeout(async () => {
      try {
        const res = await axios.post(
          '/api/auth/refresh',
          {},
          { headers: { Authorization: `Bearer ${state.accessToken}` } }
        );
        const accessToken = res.headers.authorization;
        const currentUser = res.data;
        state.nextRefreshTimestamp = new Date().getTime() + FIFTEEN_MINUTES;

        commit('saveCredentials', { accessToken, currentUser });
        Promise.resolve(
          dispatch('silentRefresh', { timeout: FIFTEEN_MINUTES })
        );
      } catch (error) {
        const res = (error as AxiosError).response;
        const message = res
          ? res.data.message
          : 'An unexpected application error occurred';

        Promise.reject(new Error(message));
      }
    }, payload.timeout);
  }
};

const mutations = {
  saveCredentials(state: AuthModuleState, payload: SaveCredentialsPayload) {
    state.accessToken = payload.accessToken;
    state.currentUser = payload.currentUser;
  },
  clearRefreshTimeout(state: AuthModuleState) {
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
