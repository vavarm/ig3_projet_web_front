<script setup>
import Navbar from "./components/Navbar.vue"
</script>

<script>
export default {
  name: "App",
  components: {
    Navbar,
  },
  created() {
    // get user info from cookies
    const cookies = document.cookie.split(";")
    let user_mail_address = ""
    let user_admin_level = ""
    user_mail_address = cookies.find((cookie) => cookie.includes("user_mail_address"))
    user_admin_level = cookies.find((cookie) => cookie.includes("user_admin_level"))
    if (user_mail_address) {
      user_mail_address = user_mail_address.split("=")[1]
      this.$store.commit("setUserMailAddress", user_mail_address)
    }
    if (user_admin_level) {
      user_admin_level = user_admin_level.split("=")[1]
      this.$store.commit("setUserAdminLevel", user_admin_level)
    }
  },
}
</script>

<template>
    <Navbar class="navbar" />
    <router-view class="router-view"></router-view>
</template>

<style scoped>
.navbar {
  width: 100%;
  height: 60px;
  display: flex;
  align-items: center;
  background-color: #fff;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  padding: 10px;
}
.router-view {
  flex: 1;
}
</style>
