<script>
import axios from "axios"

export default{
    name: "SignupForm",
    data() {
        return{
        requestError: "",
        email: "",
        username: "",
        password: "",
        confirmPassword: "",
        newsletter: false,
        emailRules: [
            (v) => !!v || "Email is required",
            (v) => /.+@.+\..+/.test(v) || "Email must be valid",
        ],
        usernameRules: [
            (v) => !!v || "Username is required",
            (v) => v.length >= 2 || "Username must be at least 2 characters",
        ],
        passwordRules: [
            (v) => !!v || "Password is required",
            (v) => v.length >= 2 || "Password must be at least 2 characters",
        ],
        confirmPasswordRules: [
            (v) => !!v || "Confirm Password is required",
            (v) => v === this.password || "Confirm Password must match Password",
        ],
        };
    },
    methods: {
        async signup() {
            const { valid } = await this.$refs.form.validate()
            if (!valid) {
                return
            }
            let encodedPassword = btoa(this.password)
            try {
                const response = await axios.post(this.$store.getters.getBackEndUri + "/auth/signup", {
                    "mail_address": this.email,
                    "username": this.username,
                    "password": encodedPassword,
                    "suscribed": this.newsletter,
                });
                console.log(response)
                this.$router.push("/login")
            } catch (error) {
                console.log(error)
                this.requestError = error.response.data.message
            }
        }
    }
}
</script>

<template>
    <v-form class="form" ref="form">
        <h1>Sign Up</h1>
        <v-text-field
            v-model="email"
            label="Email"
            type="email"
            required
            :rules="emailRules"
        ></v-text-field>
        <v-text-field
            v-model="username"
            label="Username"
            type="text"
            required
            :rules="usernameRules"
        ></v-text-field>
        <v-text-field
            v-model="password"
            label="Password"
            type="password"
            required
            :rules="passwordRules"
        ></v-text-field>
        <v-text-field
            v-model="confirmPassword"
            label="Confirm Password"
            type="password"
            required
            :rules="confirmPasswordRules"
        ></v-text-field>
        <v-checkbox
            v-model="newsletter"
            label="I want to receive the new content and updates in my mailbox."
        ></v-checkbox>
        <v-btn color="primary" type="submit" @click.prevent="signup">Sign Up</v-btn>
        <div v-if="requestError" class="error">{{requestError}}</div>
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