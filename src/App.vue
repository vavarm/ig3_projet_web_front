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
    const token = localStorage.getItem("token");
    if (token) {
      this.$store.commit('setToken', token)
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
