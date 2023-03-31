<script setup>
import { useDisplay } from "vuetify"
const { lgAndUp } = useDisplay()
</script>

<script>
export default {
  name: "Navbar",
}
</script>

<template>
  <v-app-bar>
    <v-toolbar-title class="ml-2">
      <v-icon>mdi-vuetify</v-icon>
      <span v-if="lgAndUp">Learn'nTeach</span>
    </v-toolbar-title>
    <v-spacer />
    <v-toolbar-items>
      <v-btn>
        <v-icon>mdi-home</v-icon>
        <span v-if="lgAndUp" class="ml-1">Home</span>
      </v-btn>
      <v-btn>
        <v-icon>mdi-book</v-icon>
        <span v-if="lgAndUp" class="ml-1">Courses</span>
      </v-btn>
      <v-btn>
        <v-icon>mdi-calendar</v-icon>
        <span v-if="lgAndUp" class="ml-1">Events</span>
      </v-btn>
      <v-btn>
        <v-icon>mdi-calendar-check</v-icon>
        <span v-if="lgAndUp" class="ml-1">My Events</span>
      </v-btn>
      <v-btn>
        <v-icon>mdi-account-group</v-icon>
        <span v-if="lgAndUp" class="ml-1">Users</span>
      </v-btn>
      <v-btn>
        <v-icon>mdi-account</v-icon>
        <span v-if="lgAndUp" class="ml-1">Account</span>
      </v-btn>
      <v-btn color="primary" class="ml-5">Login</v-btn>
      <v-btn color="primary" class="ml-2">Sign Up</v-btn>
    </v-toolbar-items>
  </v-app-bar>
</template>
