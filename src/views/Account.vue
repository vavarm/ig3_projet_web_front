<script>
import axios from "axios"

export default{
    name: "Account",
    data() {
        return {
            user: {},
        }
    },
    created() {
        this.getUser()
    },
    methods: {
        async getUser(){
            await axios
                .get(this.$store.getters.getBackEndUri + "/auth/users/" + this.$store.getters.getMailAddress)
                .then((response) => {
                    console.log(response)
                    this.user = response.data
                })
                .catch((error) => {
                    console.log(error)
                    this.error = error.response.data.message
                    this.$store.commit("logout")
                    this.$router.push("/login")
                })
        },
        async suscribe(){
            try {
                const response = await axios.put(this.$store.getters.getBackEndUri + "/auth/users/suscribe")
                console.log(response)
                this.getUser()
            } catch (error) {
                console.log(error);
                this.$store.commit("logout")
                this.$router.push("/login")
            }
        },
        async unsuscribe(){
            try {
                const response = await axios.put(this.$store.getters.getBackEndUri + "/auth/users/unsuscribe")
                console.log(response)
                this.getUser()
            } catch (error) {
                console.log(error);
                this.$store.commit("logout")
                this.$router.push("/login")
            }
        },
    }
}

</script>

<template>
    <div class="ma-4">
        <h1>Account</h1>
        <v-card>
            <v-card-title>
                <h2>Username</h2>
            </v-card-title>
            <v-card-text>
                <p>{{ user.username }}</p>
            </v-card-text>
        </v-card>
        <v-card>
            <v-card-title>
                <h2>Email</h2>
            </v-card-title>
            <v-card-text>
                <p>{{ user.mail_address }}</p>
            </v-card-text>
        </v-card>
        <v-card>
            <v-card-title>
                <h2>Agree to receive emails ?</h2>
            </v-card-title>
            <v-card-text class="d-flex flex-row justify-space-between align-center">
                <p>{{ user.suscribed ? "Yes" : "No" }}</p>
                <v-btn v-if="user.suscribed" @click="unsuscribe">Unsuscribe</v-btn>
                <v-btn v-else @click="suscribe">Suscribe</v-btn>
            </v-card-text>
        </v-card>
    </div>
</template>