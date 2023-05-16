<script setup>
import Posts from "./Posts.vue"
</script>

<script>
export default {
  name: "Home",
  data() {
    return{
      title: "Learn'nTeach",
      description: "A platform for learning and teaching around diverse topics and skills with a community of passionate people."
    }
    
  },
  methods: {
    scrollToPosts() {
      const element = document.getElementById('posts');
      element.scrollIntoView({ behavior: 'smooth' });
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
    <div class="home-section">
      <div class="front-text">
        <h1 class="display-1 font-weight-bold mb-4">{{title}}</h1>
        <p class="subheading mb-5">{{description}}<b> Join us now!</b></p>
        <div v-if="!isLoggedIn" class="d-flex justify-center">
          <v-btn color="primary" dark class="mr-3" to="login">Login</v-btn>
          <v-btn color="secondary" dark to="/signup">Signup</v-btn>
        </div>
      </div>
      <div class="d-flex flex-column align-center">
        <v-btn @click="scrollToPosts" class="mb-2">
          <v-icon>mdi-arrow-down-bold-circle</v-icon>
          <div>See the recent posts</div>
        </v-btn>
      </div>
    </div>
    <Posts id="posts"/>
</template>
  
  <style scoped>
  .home-section {
    height: calc(100vh - 60px);
    padding: 30px auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-evenly;
    background-image: url("../assets/home.png");
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    color: #fff;
  }
  .front-text {
    max-width: 40%;
    text-align: center;
    background-color: dimgrey;
    padding: 20px;
    opacity: 0.9;
    border-radius: 20px;
  }
  @media (max-width: 800px) {
    .front-text {
      max-width: 100%;
    }
  }
  </style>