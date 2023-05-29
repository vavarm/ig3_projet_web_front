<script setup>
import Navbar from "./components/Navbar.vue"
</script>

<script>
export default {
  name: "App",
  components: {
    Navbar,
  },
  data() {
    return {
      drawer: false,
    }
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
  methods: {
    handleDrawer() {
      this.drawer = !this.drawer
      console.log(this.drawer)
    },
    logout() {
      this.drawer = false
      this.$store.commit("logout")
      this.$router.push("/")
    },
    goToHome() {
      this.drawer = false
      this.$router.push("/")
    },
    goToLessons() {
      this.drawer = false
      this.$router.push("/lessons")
    },
    goToEvents() {
      this.drawer = false
      this.$router.push("/events")
    },
    goToMyEvents() {
      this.drawer = false
      this.$router.push("/myevents")
    },
    goToUsers() {
      this.drawer = false
      this.$router.push("/users")
    },
    goToAccount() {
      this.drawer = false
      this.$router.push("/account")
    },
    goToLogin() {
      this.drawer = false
      this.$router.push("/login")
    },
    goToSignup() {
      this.drawer = false
      this.$router.push("/signup")
    },
  },
  computed: {
    isLoggedIn() {
      return this.$store.getters.isLoggedIn
    },
    isAdmin() {
      return this.$store.getters.isAdmin
    },
  },
}
</script>

<template>
    <Navbar class="navbar" @drawer="handleDrawer"/>
    <div v-if="drawer" class="drawer">
      <v-btn @click="goToHome" variant="text" width="100%" height="10%">
        <v-icon>mdi-home</v-icon>
        <span>Home</span>
      </v-btn>
      <div class="divider"></div>
      <v-btn @click="goToLessons" variant="text" width="100%" height="10%">
        <v-icon>mdi-book</v-icon>
        <span>Lessons</span>
      </v-btn>
      <div v-if="isLoggedIn" class="divider"></div>
      <v-btn v-if="isLoggedIn" @click="goToEvents" variant="text" width="100%" height="10%">
        <v-icon>mdi-calendar</v-icon>
        <span>Events</span>
      </v-btn>
      <div v-if="isLoggedIn" class="divider"></div>
      <v-btn v-if="isLoggedIn" @click="goToMyEvents" variant="text" width="100%" height="10%">
        <v-icon>mdi-calendar-check</v-icon>
        <span>My Events</span>
      </v-btn>
      <div v-if="isAdmin" class="divider"></div>
      <v-btn v-if="isAdmin" @click="goToUsers" variant="text" width="100%" height="10%">
        <v-icon>mdi-account-group</v-icon>
        <span>Users</span>
      </v-btn>
      <div v-if="isLoggedIn" class="divider"></div>
      <v-btn v-if="isLoggedIn" @click="goToAccount" variant="text" width="100%" height="10%">
        <v-icon>mdi-account</v-icon>
        <span>Account</span>
      </v-btn>
      <div v-if="!isLoggedIn" class="divider"></div>
      <v-btn color="primary" @click="goToLogin" v-if="!isLoggedIn" width="100%" height="10%">Login</v-btn>
      <div v-if="!isLoggedIn" class="divider"></div>
      <v-btn color="primary" @click="goToSignup" v-if="!isLoggedIn" width="100%" height="10%">Sign Up</v-btn>
      <div v-if="isLoggedIn" class="divider"></div>
      <v-btn color="red" @click="logout" v-if="isLoggedIn" variant="text" width="100%" height="10%">Logout</v-btn>
    </div>
    <router-view></router-view>
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
.drawer {
  position: absolute;
  z-index: 100;
  top: 60px;
  background-color: lightgray;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: start;
  height: calc(100vh - 60px);
  width: 100%;
}
.divider {
  width: 100%;
  height: 2px;
  background-color: black;
}
.home-section {
  flex: 1;
}
</style>
