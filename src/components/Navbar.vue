<script setup>
import { useDisplay } from "vuetify"
const { lgAndUp } = useDisplay()
</script>

<script>
export default {
  name: "Navbar",
  methods: {
    logout() {
      this.$store.commit("logout")
      this.$router.push("/")
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
  <div class="navbar">
    <v-toolbar-title class="ml-2">
      <v-icon class="mr-2">mdi-school</v-icon>
      <span v-if="lgAndUp">Learn'nTeach</span>
    </v-toolbar-title>
    <v-spacer />
    <v-toolbar-items>
      <v-btn to="/">
        <v-icon>mdi-home</v-icon>
        <span v-if="lgAndUp" class="ml-1">Home</span>
        <v-tooltip activator="parent" location="bottom">
          Home
        </v-tooltip>
      </v-btn>
      <v-btn>
        <v-icon>mdi-book</v-icon>
        <span v-if="lgAndUp" class="ml-1">Courses</span>
        <v-tooltip activator="parent" location="bottom">
          Courses
        </v-tooltip>
      </v-btn>
      <v-btn v-if="isLoggedIn" to="/events">
        <v-icon>mdi-calendar</v-icon>
        <span v-if="lgAndUp" class="ml-1">Events</span>
        <v-tooltip activator="parent" location="bottom">
          Events
        </v-tooltip>
      </v-btn>
      <v-btn v-if="isLoggedIn" to="/myevents">
        <v-icon>mdi-calendar-check</v-icon>
        <span v-if="lgAndUp" class="ml-1">My Events</span>
        <v-tooltip activator="parent" location="bottom">
          My Events
        </v-tooltip>
      </v-btn>
      <v-btn v-if="isAdmin" to="/users">
        <v-icon>mdi-account-group</v-icon>
        <span v-if="lgAndUp" class="ml-1">Users</span>
        <v-tooltip activator="parent" location="bottom">
          Users
        </v-tooltip>
      </v-btn>
        <v-btn v-if="isLoggedIn" to="/account">
        <v-icon>mdi-account</v-icon>
        <span v-if="lgAndUp" class="ml-1">Account</span>
        <v-tooltip activator="parent" location="bottom">
          {{ this.$store.getters.getMailAddress }}
        </v-tooltip>
      </v-btn>
      <v-btn color="primary" class="ml-5" rounded="xl" to="/login" v-if="!isLoggedIn">Login</v-btn>
      <v-btn color="primary" class="ml-2" rounded="xl" to="/signup" v-if="!isLoggedIn">Sign Up</v-btn>
      <v-btn text color="red" class="ml-5" @click="logout" v-if="isLoggedIn">Logout</v-btn>
    </v-toolbar-items>
  </div>
</template>
