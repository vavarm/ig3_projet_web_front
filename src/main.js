import { createApp } from "vue"
import store from "./store"
import "./normalize.css"
import App from "./App.vue"
import Login from "./views/Login.vue"
import Signup from "./views/Signup.vue"
import Home from "./views/Home.vue"
import Events from "./views/Events.vue"
import MyEvents from "./views/MyEvents.vue"
import Event from "./views/Event.vue"
import Lessons from "./views/Lessons.vue"
import Users from "./views/Users.vue"
import Account from "./views/Account.vue"
import * as VueRouter from "vue-router"
import axios from "axios"

// Axios
axios.defaults.withCredentials = true

// Vue Router
const routes = [
  { path: "/", component: Home },
  { path: "/events", component: Events },
  { path: "/myevents", component: MyEvents },
  { path: "/event/:id", component: Event },
  { path: "/lessons", component: Lessons },
  { path: "/login", component: Login },
  { path: "/signup", component: Signup },
  { path: "/users", component: Users },
  { path: "/account", component: Account },
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
