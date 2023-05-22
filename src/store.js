import Vuex from 'vuex'

export default new Vuex.Store({
  state: {
    user_admin_level: 0,
    user_mail_address: null,
    back_end_uri: import.meta.env.VITE_BACK_END_URI
  },
  mutations: {
    setUserAdminLevel(state, user_admin_level) {
      state.user_admin_level = user_admin_level
    },
    setUserMailAddress(state, user_mail_address) {
      state.user_mail_address = user_mail_address
    },
    logout(state) {
      // clear cookies
      document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie = "user_admin_level=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie = "user_mail_address=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      // clear state
      state.user_admin_level = 0
      state.user_mail_address = null
    }
  },
  getters: {
    isLoggedIn(state) {
      return state.user_mail_address != null
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
