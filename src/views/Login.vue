<script>

</script>

<template>
  <v-form class="form">
    <v-form-title>Login</v-form-title>
    <v-text-field
      v-model="email"
      label="Email"
      type="email"
      required
    ></v-text-field>
    <v-text-field
      v-model="password"
      label="Password"
      type="password"
      required
    ></v-text-field>
    <v-column>
        <v-btn color="primary" type="submit">Login</v-btn>
        <v-btn color="secondary" to="/signup">I don't have an account</v-btn>
    </v-column>
    
  </v-form>
</template>

<style scoped>
  .form {
    width: 100%;
    max-width: 500px;
    margin: 30px auto;
  }
  v-form-title {
    font-size: 2rem;
    font-weight: bold;
    margin-bottom: 1rem;
  }
</style>