<script setup>
import { useDisplay } from "vuetify"
const { lgAndUp, smAndDown } = useDisplay()
</script>

<script>
export default {
  name: "Navbar",
  methods: {
    logout() {
      this.$store.commit("logout")
      this.$router.push("/")
    },
    drawer() {
      this.$emit("drawer")
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
      <span>Learn'nTeach</span>
    </v-toolbar-title>
    <v-spacer />
    <v-toolbar-items>
      <v-btn v-if="!smAndDown" to="/">
        <v-icon>mdi-home</v-icon>
        <span v-if="lgAndUp" class="ml-1">Home</span>
        <v-tooltip activator="parent" location="bottom">
          Home
        </v-tooltip>
      </v-btn>
      <v-btn v-if="!smAndDown" to="/lessons">
        <v-icon>mdi-book</v-icon>
        <span v-if="lgAndUp" class="ml-1">Lessons</span>
        <v-tooltip activator="parent" location="bottom">
          Lessons
        </v-tooltip>
      </v-btn>
      <v-btn v-if="isLoggedIn && !smAndDown" to="/events">
        <v-icon>mdi-calendar</v-icon>
        <span v-if="lgAndUp" class="ml-1">Events</span>
        <v-tooltip activator="parent" location="bottom">
          Events
        </v-tooltip>
      </v-btn>
      <v-btn v-if="isLoggedIn && !smAndDown" to="/myevents">
        <v-icon>mdi-calendar-check</v-icon>
        <span v-if="lgAndUp" class="ml-1">My Events</span>
        <v-tooltip activator="parent" location="bottom">
          My Events
        </v-tooltip>
      </v-btn>
      <v-btn v-if="isAdmin && !smAndDown" to="/users">
        <v-icon>mdi-account-group</v-icon>
        <span v-if="lgAndUp" class="ml-1">Users</span>
        <v-tooltip activator="parent" location="bottom">
          Users
        </v-tooltip>
      </v-btn>
        <v-btn v-if="isLoggedIn && !smAndDown" to="/account">
        <v-icon>mdi-account</v-icon>
        <span v-if="lgAndUp" class="ml-1">Account</span>
        <v-tooltip activator="parent" location="bottom">
          {{ this.$store.getters.getMailAddress }}
        </v-tooltip>
      </v-btn>
      <v-btn color="primary" class="ml-5" rounded="xl" to="/login" v-if="!isLoggedIn && !smAndDown">Login</v-btn>
      <v-btn color="primary" class="ml-2" rounded="xl" to="/signup" v-if="!isLoggedIn && !smAndDown">Sign Up</v-btn>
      <v-btn text color="red" class="ml-5" @click="logout" v-if="isLoggedIn && !smAndDown">Logout</v-btn>
      <v-btn icon v-if="smAndDown" @click="drawer">
        <v-icon>mdi-dots-vertical</v-icon>
      </v-btn>
    </v-toolbar-items>
  </div>
</template>
