<script>
import axios from "axios"

export default {
  name: "LoginForm",
  data() {
    return {
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
    }
  },
  methods: {
    async login() {
        const { valid } = await this.$refs.form.validate()
        if (!valid) {
            return;
        }
        let encodedPassword = btoa(this.password)
        try {
            const response = await axios.post(this.$store.getters.getBackEndUri + "/auth/login", {
	            "mail_address": this.email,
	            "password": encodedPassword,
        })
            console.log(response)
            // expiration date = 24 hours
            let expirationDate = new Date(Date.now() + 24 * 60 * 60 * 1000);
            document.cookie = "token=" + response.data.token + ";expires=" + expirationDate.toUTCString() + ";path=/" + ";domain=" + this.$store.getters.getDomainName
            document.cookie = "user_mail_address=" + response.data.user_mail_address + ";expires=" + expirationDate.toUTCString() + ";path=/" + ";domain=" + this.$store.getters.getDomainName
            document.cookie = "user_admin_level=" + response.data.user_admin_level + ";expires=" + expirationDate.toUTCString() + ";path=/" + ";domain=" + this.$store.getters.getDomainName
            this.$store.commit("setUserAdminLevel", response.data.user_admin_level)
            this.$store.commit("setUserMailAddress", response.data.user_mail_address)
            this.$router.push("/");
        } catch (error) {
            console.log(error)
            this.requestError = error.response.data.message
        }
    },
  },
}
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
    <div class="d-flex">
        <v-btn color="primary" type="submit" @click.prevent="login">Login</v-btn>
        <v-spacer />
        <v-btn color="secondary" to="/signup">I don't have an account</v-btn>
    </div>
    <div v-if="requestError" class="error">
        {{requestError}}
    </div>
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
  .error {
    color: red;
    margin-top: 1rem;
  }
</style>