<script>
export default {
  name: "Home",
  setup() {
    const title = "Learn'nTeach"
    const description = "Learn'nTeach is a platform for learning and teaching."
    return {
      title,
      description,
    }
  },
}
</script>

<template>
    <div class="home-section">
          <h1 class="display-1 font-weight-bold mb-4">{{title}}</h1>
          <p class="subheading mb-5">{{description}}</p>
          <div class="d-flex justify-center">
            <v-btn color="primary" dark class="mr-3" to="login">Login</v-btn>
            <v-btn color="secondary" dark to="/signup">Signup</v-btn>
          </div>
    </div>
</template>
  
  <style scoped>
  .home-section {
    margin: 30px auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  </style>