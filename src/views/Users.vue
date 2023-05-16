<script>
import axios from "axios"

export default {
    name: "Users",
    data() {
        return {
        users: [],
        error: "",
        deleteDialog: false,
        setAdminDialog: false,
        unsetAdminDialog: false,
        current_user: "",
        };
    },
    created() {
        this.getUsers()
    },
    methods: {
        async getUsers() {
            try {
                const config = {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                }
                const response = await axios.get("http://localhost:3002/auth/users", config)
                console.log(response)
                this.users = response.data
            } catch (error) {
                console.log(error);
                this.$store.commit("logout")
                this.$router.push("/login")
            }
        },
        async deleteUser() {
            try {
                const config = {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                }
                const response = await axios.delete("http://localhost:3002/auth/users/" + this.current_user, config)
                console.log(response)
                this.getUsers()
            } catch (error) {
                console.log(error);
                this.$store.commit("logout")
                this.$router.push("/login")
            }
            this.deleteDialog = false
        },
        async setAdmin() {
            try {
                const config = {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                }
                const response = await axios.put("http://localhost:3002/auth/users/set-admin/", {
                    "mail_address": this.current_user
                }, config)
                console.log(response)
                this.getUsers()
                this.setAdminDialog = false
            } catch (error) {
                console.log(error);
                this.$store.commit("logout")
                this.$router.push("/login")
            }
        },
        async unsetAdmin() {
            try {
                const config = {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                }
                const response = await axios.put("http://localhost:3002/auth/users/unset-admin/", {
                    "mail_address": this.current_user
                }, config)
                console.log(response)
                this.getUsers()
                this.unsetAdminDialog = false
            } catch (error) {
                console.log(error);
                this.$store.commit("logout")
                this.$router.push("/login")
            }
        },
        openDeleteDialog(user) {
            this.current_user = user
            this.deleteDialog = true
        },
        openSetAdminDialog(user) {
            this.current_user = user
            this.setAdminDialog = true
        },
        openUnsetAdminDialog(user) {
            this.current_user = user
            this.unsetAdminDialog = true
        },
    },
}
</script>

<template>
    <div>
        <v-dialog
            v-model="deleteDialog"
            persistent
            width="auto"
        >
            <v-card>
            <v-card-title class="text-h5">
                Are you sure you want to delete this user ?
            </v-card-title>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                    color="red darken-1"
                    variant="text"
                    @click="deleteDialog = false"
                >
                    No
                </v-btn>
                <v-btn
                    color="green-darken-1"
                    variant="text"
                    @click="deleteUser"
                >
                    Yes
                </v-btn>
            </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog
            v-model="setAdminDialog"
            persistent
            width="auto"
        >
            <v-card>
            <v-card-title class="text-h5">
                Are you sure you want to set this user as admin ?
            </v-card-title>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                    color="red darken-1"
                    variant="text"
                    @click="setAdminDialog = false"
                >
                    No
                </v-btn>
                <v-btn
                    color="green-darken-1"
                    variant="text"
                    @click="setAdmin"
                >
                    Yes
                </v-btn>
            </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog
            v-model="unsetAdminDialog"
            persistent
            width="auto"
        >
            <v-card>
            <v-card-title class="text-h5">
                Are you sure you want to unset this user as admin ?
            </v-card-title>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                    color="red darken-1"
                    variant="text"
                    @click="unsetAdminDialog = false"
                >
                    No
                </v-btn>
                <v-btn
                    color="green-darken-1"
                    variant="text"
                    @click="unsetAdmin"
                >
                    Yes
                </v-btn>
            </v-card-actions>
            </v-card>
        </v-dialog>

        <v-container fluid>
            <h1>Users</h1>
            <v-layout row wrap>
                <div v-if="error" class="error">{{error}}</div>
                <div v-else-if="users.length === 0" class="loading">Loading...</div>
                <div v-else v-for="user in users" :key="user.mail_address" class="d-flex" xs12 md6 lg4>
                    <v-card>
                    <v-card-title>
                        <h2>{{ user.username +  " " + (user.admin_level>0 ? "[ADMIN]" : "") }}</h2>
                    </v-card-title>
                    <v-card-text>
                        <p>Mail address: {{ user.mail_address }}</p>
                    </v-card-text>
                    <v-card-actions>
                        <v-btn @click="openDeleteDialog(user.mail_address)">Delete user</v-btn>
                        <v-btn v-if="user.admin_level==0" @click="openSetAdminDialog(user.mail_address)">Set admin</v-btn>
                        <v-btn v-else @click="openUnsetAdminDialog(user.mail_address)">Unset admin</v-btn>
                    </v-card-actions>
                    </v-card>
                </div>
            </v-layout>
        </v-container>
    </div>
</template>

<style scoped>
.v-card {
  width: 100%;
  margin-bottom: 16px;
  margin-right: 16px;
  background-color: #F8F8F8;
}

.v-card-title {
  padding: 16px;
  background-color: #F5F5F5;
}

.v-card-text {
  padding: 16px;
}

.v-card-actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
}

.v-btn:not(:last-child) {
  margin-right: 8px;
}
</style>