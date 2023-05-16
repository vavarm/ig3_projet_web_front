import Vuex from 'vuex'

export default new Vuex.Store({
  state: {
    token: null,
    user_admin_level: 0,
    user_mail_address: null,
    back_end_uri: import.meta.env.VITE_BACK_END_URI
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
    setUserMailAddress(state, user_mail_address) {
        state.user_mail_address = user_mail_address
    },
    logout(state) {
        localStorage.removeItem('token')
        localStorage.removeItem('user_admin_level')
        localStorage.removeItem('user_mail_address')
        state.token = null
        state.user_admin_level = 0
        state.user_mail_address = null
    }
  },
  getters: {
    isLoggedIn(state) {
      return state.token !== null
    },
    isAdmin(state) {
        return state.user_admin_level > 0
    },
    getMailAddress(state) {
      return state.user_mail_address
    },
    getBackEndUri(state) {
      return state.back_end_uri
    }
  }
});
