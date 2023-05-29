<script>
import axios from "axios"

export default{
    name: "Account",
    data() {
        return {
            user: {},
            deleteDialog: false,
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
        async subscribe(){
            try {
                const response = await axios.put(this.$store.getters.getBackEndUri + "/auth/users/subscribe")
                console.log(response)
                this.getUser()
            } catch (error) {
                console.log(error);
                this.$store.commit("logout")
                this.$router.push("/login")
            }
        },
        async unsubscribe(){
            try {
                const response = await axios.put(this.$store.getters.getBackEndUri + "/auth/users/unsubscribe")
                console.log(response)
                this.getUser()
            } catch (error) {
                console.log(error);
                this.$store.commit("logout")
                this.$router.push("/login")
            }
        },
        async deleteUser(){
            this.deleteDialog = false
            try {
                const response = await axios.delete(this.$store.getters.getBackEndUri + "/auth/users/" + this.$store.getters.getMailAddress)
                console.log(response)
                this.$store.commit("logout")
                this.$router.push("/login")
            } catch (error) {
                console.log(error);
                this.$store.commit("logout")
                this.$router.push("/login")
            }
        }
    }
}

</script>

<template>
    <v-dialog v-model="deleteDialog" max-width="500px">
        <v-card>
            <v-card-title>
                <span class="headline">Delete account</span>
            </v-card-title>
            <v-card-text>
                Are you sure you want to delete your account?
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="orange darken-1" @click="deleteDialog = false" variant="flat">Cancel</v-btn>
                <v-btn color="red darken-1" @click="deleteUser()" variant="flat">Delete</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
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
                <p>{{ user.subscribed ? "Yes" : "No" }}</p>
                <v-btn v-if="user.subscribed" @click="unsubscribe">Unsubscribe</v-btn>
                <v-btn v-else @click="subscribe">Subscribe</v-btn>
            </v-card-text>
        </v-card>
        <v-card>
            <v-card-text>
                <v-btn color="red darken-1" @click="deleteDialog = true" variant="flat">Delete account</v-btn>
            </v-card-text>
        </v-card>
    </div>
</template>