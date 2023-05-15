<script>
import axios from "axios";

export default {
  name: "LoginForm",
  data() {
    return {
        valid: true,
        requestError: "",
        email: "",
        password: "",
        emailRules: [
            (v) => !!v || "Email is required",
            (v) => /.+@.+\..+/.test(v) || "Email must be valid",
        ],
        passwordRules: [
            (v) => !!v || "Password is required",
            (v) => v.length >= 2 || "Password must be at least 2 characters",
        ],
    };
  },
  methods: {
    async login() {
        const { valid } = await this.$refs.form.validate();
        if (!valid) {
            return;
        }
        try {
            const response = await axios.post("http://localhost:3002/auth/login", {
	            "mail_address": this.email,
	            "password": this.password
        });
            console.log(response);
            localStorage.setItem("token", response.data.token);
            this.$store.commit("setToken", response.data.token);
            this.$router.push("/");
        } catch (error) {
            console.log(error);
            this.requestError = error.response.data.message;
        }
    },
  },
};
</script>

<template>
  <v-form class="form" ref="form">
    <h1>Login</h1>
    <v-text-field
        v-model="email"
        label="Email"
        type="email"
        required
        :rules="emailRules"
    ></v-text-field>
    <v-text-field
        v-model="password"
        label="Password"
        type="password"
        required
        :rules="passwordRules"
    ></v-text-field>
    <div>
        <v-btn color="primary" type="submit" @click.prevent="login">Login</v-btn>
        <v-btn color="secondary" to="/signup">I don't have an account</v-btn>
    </div>
    <p>{{ requestError }}</p>
    
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