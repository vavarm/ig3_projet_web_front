import { createApp } from "vue"
import store from "./store"
import "./normalize.css"
import App from "./App.vue"
import Login from "./views/Login.vue"
import Signup from "./views/Signup.vue"
import Home from "./views/Home.vue"
import Users from "./views/Users.vue"
import * as VueRouter from "vue-router"

// Vue Router
const routes = [
  { path: "/", component: Home },
  { path: "/login", component: Login },
  { path: "/signup", component: Signup },
  { path: "/users", component: Users },
]

const router = VueRouter.createRouter({
  history: VueRouter.createWebHistory(),
  routes,
})

// Vuetify
import "vuetify/styles"
import { createVuetify } from "vuetify"
import * as components from "vuetify/components"
import * as directives from "vuetify/directives"
import { aliases, mdi } from "vuetify/lib/iconsets/mdi"
import "@mdi/font/css/materialdesignicons.css"

const vuetify = createVuetify({
  icons: {
    defaultSet: "mdi",
    aliases,
    sets: {
      mdi,
    },
  },
  components,
  directives,
})

createApp(App).use(store).use(vuetify).use(router).mount("#app")
