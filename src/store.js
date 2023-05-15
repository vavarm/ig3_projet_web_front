import Vuex from 'vuex';

export default new Vuex.Store({
  state: {
    token: null
  },
  mutations: {
    setToken(state, token) {
      state.token = token;
    },
    clearToken(state) {
      state.token = null;
    }
  },
  getters: {
    isLoggedIn(state) {
      return state.token !== null;
    }
  }
});
