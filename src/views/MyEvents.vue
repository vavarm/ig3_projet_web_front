<script>
import axios from "axios"

export default {
    name: "MyEvents",
    data() {
        return {
            ownEvents: [],
            registeredEvents: [],
            registeredEventsIds: [],
            eventId: "",
            error: "",
            deleteDialog: false,
        };
    },
    created() {
        this.getOwnEvents()
        this.getRegisteredEventsIds().then(() => {
            this.getRegisteredEvents()
        })
    },
    methods: {
        async returnEventById(id){
            await axios
                .get(this.$store.getters.getBackEndUri + "/events/" + id)
                .then((response) => {
                    console.log(response)
                    console.log(response.data)
                    return response.data
                })
                .catch((error) => {
                    console.log(error)
                    this.error = error.response.data.message
                    this.$store.commit("logout")
                    this.$router.push("/login")
                })
        },
        async getOwnEvents(){
            await axios
                .get(this.$store.getters.getBackEndUri + "/events/users/owned")
                .then((response) => {
                    console.log(response)
                    response.data.sort((a, b) => {
                        return new Date(b.date) - new Date(a.date);
                    })
                    this.ownEvents = response.data
                })
                .catch((error) => {
                    console.log(error)
                    this.error = error.response.data.message
                    this.$store.commit("logout")
                    this.$router.push("/login")
                })
        },
        async getRegisteredEventsIds(){
            await axios
                .get(this.$store.getters.getBackEndUri + "/events/users/registered")
                .then((response) => {
                    console.log(response)
                    // map events to array
                    this.registeredEventsIds = response.data.map((event) => {
                        return event.event_id
                    })
                })
                .catch((error) => {
                    console.log(error)
                    this.error = error.response.data.message
                    this.$store.commit("logout")
                    this.$router.push("/login")
                })
        },
        async getRegisteredEvents(){
            this.registeredEvents = []
            this.registeredEventsIds.forEach(async (id) => {
                await axios
                    .get(this.$store.getters.getBackEndUri + "/events/" + id)
                    .then((response) => {
                        console.log(response)
                        this.registeredEvents.push(response.data)
                    })
                    .catch((error) => {
                        console.log(error)
                        this.error = error.response.data.message
                        this.$store.commit("logout")
                        this.$router.push("/login")
                    })
            })
        },
        async deleteEvent(eventId) {
            await axios
                .delete(this.$store.getters.getBackEndUri + "/events/" + eventId)
                .then((response) => {
                    console.log(response)
                    this.getOwnEvents()
                    this.closeDeleteDialog()
                })
                .catch((error) => {
                    console.log(error)
                    this.error = error.response.data.message
                    this.$store.commit("logout")
                    this.$router.push("/login")
                })
        },
        async unregisterEvent(eventId) {
            await axios
                .post(this.$store.getters.getBackEndUri + "/events/unregister/" + eventId)
                .then((response) => {
                    console.log(response)
                    this.getRegisteredEventsIds().then(() => {
                        this.getRegisteredEvents()
                    })
                })
                .catch((error) => {
                    console.log(error)
                    this.error = error.response.data.message
                    this.$store.commit("logout")
                    this.$router.push("/login")
                })
        },
        formatDate(dateString) {
            const date = new Date(dateString);
            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            return date.toLocaleDateString('en-US', options);
        },
        openDeleteDialog(eventId) {
            this.deleteDialog = true
            this.eventId = eventId
        },
        closeDeleteDialog() {
            this.deleteDialog = false
        },
    }
}

</script>

<template>
    <v-dialog v-model="deleteDialog" max-width="500px">
        <v-card color="primary" dark>
            <v-card-title class="headline">Delete Event</v-card-title>
            <v-card-text>Are you sure you want to delete this event?</v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="closeDeleteDialog">Cancel</v-btn>
                <v-btn color="blue darken-1" text @click="deleteEvent(eventId)">Delete</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>

    <div class="ma-4">
        <h1>Own Events</h1>
        <div v-if="error" class="error">
            {{error}}
        </div>
        <div v-else-if="ownEvents.length === 0">
            <h3>You have no owned events</h3>
        </div>
        <div v-else v-for="event in ownEvents" :key="event.id">
            <v-card class="mb-4" color="#5A33CE" style="width: 100%" @click="this.$router.push({ path: '/event/' + event.id })">
                <v-card-title>
                        {{event.name}}
                    </v-card-title>
                    <div class="d-flex flex-row" style="width: 100%">
                        <v-chip color="white" class="ml-2 mb-2" v-for="tag in event.Tags" :key="tag.name">{{tag.name}}</v-chip>
                    </div>
                    <v-card-text>{{"Beginning of the event: " + formatDate(event.date) + " | Duration: " + event.duration + " hours | Address: "+ event.location + ", " + event.postal_code + " " + event.city }}</v-card-text>
                    <v-card-text>{{event.description}}</v-card-text>
                    <v-card-subtitle v-if="event.price > 0">{{"Price: " + event.price + " USD"}}</v-card-subtitle>
                    <v-card-subtitle v-else>{{"Price: Free"}}</v-card-subtitle>
                    <v-card-subtitle>{{ "Organizer: " + event.organizer_id }}</v-card-subtitle>
                <v-card-actions>
                    <v-btn color="red darken-1" @click.stop="openDeleteDialog(event.id)">Delete</v-btn>
                </v-card-actions>
            </v-card>
        </div>
        <h1>Registered Events</h1>
        <div v-if="error" class="error">
            {{error}}
        </div>
        <div v-else-if="registeredEvents.length === 0">
            <h3>You have no registered events</h3>
        </div>
        <div v-else v-for="event in registeredEvents" :key="event.id">
            <v-card class="mb-4" color="#5A33CE" style="width: 100%" @click="this.$router.push({ path: '/event/' + event.id })">
                <v-card-title>
                        {{event.name}}
                    </v-card-title>
                    <div class="d-flex flex-row" style="width: 100%">
                        <v-chip color="white" class="ml-2 mb-2" v-for="tag in event.Tags" :key="tag.name">{{tag.name}}</v-chip>
                    </div>
                    <v-card-text>{{"Beginning of the event: " + formatDate(event.date) + " | Duration: " + event.duration + " hours | Address: "+ event.location + ", " + event.postal_code + " " + event.city }}</v-card-text>
                    <v-card-text>{{event.description}}</v-card-text>
                    <v-card-subtitle v-if="event.price > 0">{{"Price: " + event.price + " USD"}}</v-card-subtitle>
                    <v-card-subtitle v-else>{{"Price: Free"}}</v-card-subtitle>
                    <v-card-subtitle>{{ "Organizer: " + event.organizer_id }}</v-card-subtitle>
                <v-card-actions>
                    <v-btn color="orange darken-1" @click.stop="unregisterEvent(event.id)">Unregister</v-btn>
                </v-card-actions>
            </v-card>
        </div>
    </div>
</template>

<style scoped>
    .v-card-title {
    color: white
}
.v-card-subtitle {
    color: white
}
.v-card-text {
    color: white
}
.line {
    background-color: white;
    height: 2px;
    margin: 20px 0
}
.error {
    color: red
}
</style>