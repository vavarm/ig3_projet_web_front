import Vuex from 'vuex'

export default new Vuex.Store({
  state: {
    token: null,
    user_admin_level: 0
  },
  mutations: {
    setToken(state, token) {
      state.token = token
    },
    clearToken(state) {
      state.token = null
    },
    setUserAdminLevel(state, user_admin_level) {
        state.user_admin_level = user_admin_level
    },
    resetUserAdminLevel(state) {
        state.user_admin_level = 0
    },
    logout(state) {
        localStorage.removeItem('token')
        localStorage.removeItem('user_admin_level')
        state.token = null
        state.user_admin_level = 0
    }
  },
  getters: {
    isLoggedIn(state) {
      return state.token !== null
    },
    isAdmin(state) {
        return state.user_admin_level > 0
    }
  }
});
