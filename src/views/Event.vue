<script>
import axios from "axios";

export default {
    name: "Event",
    data() {
        return {
            eventId: this.$route.params.id,
            event: {},
            numberOfParticipants: 0,
            error: "",
            deleteDialog: false,
            eventFullDialog: false,
            registeredEventsIds: [],
        }
    },
    created() {
        this.getEvent(this.$route.params.id)
        this.getNumberOfParticipants(this.$route.params.id)
        this.getRegisteredEvents()
    },
    methods: {
        async getRegisteredEvents(){
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
        async getEvent(id) {
            await axios
                .get(this.$store.getters.getBackEndUri + "/events/" + id)
                .then((response) => {
                    console.log(response)
                    this.event = response.data
                })
                .catch((error) => {
                    console.log(error)
                    this.error = error.response.data.message
                    this.$store.commit("logout")
                    this.$router.push("/login")
                })
        },
        async getNumberOfParticipants(id) {
            await axios
                .get(this.$store.getters.getBackEndUri + "/events/nbregistered/" + id)
                .then((response) => {
                    console.log(response)
                    this.numberOfParticipants = response.data.message
                })
                .catch((error) => {
                    console.log(error)
                    this.error = error.response.data.message
                    this.$store.commit("logout")
                    this.$router.push("/login")
                })
        },
        async registerToEvent(id) {
            await axios
                .post(this.$store.getters.getBackEndUri + "/events/register/" + id)
                .then((response) => {
                    console.log(response)
                    this.getEvent(this.$route.params.id)
                    this.getNumberOfParticipants(this.$route.params.id)
                    this.getRegisteredEvents()
                })
                .catch((error) => {
                    if(error.response.status === 409){
                        this.error = "The event is full"
                        this.eventFullDialog = true
                        return
                    }
                    console.log(error)
                    this.error = error.response.data.message
                    this.$store.commit("logout")
                    this.$router.push("/login")
                })
        },
        async unregisterToEvent(id) {
            await axios
                .post(this.$store.getters.getBackEndUri + "/events/unregister/" + id)
                .then((response) => {
                    console.log(response)
                    this.getEvent(this.$route.params.id)
                    this.getNumberOfParticipants(this.$route.params.id)
                    this.getRegisteredEvents()
                })
                .catch((error) => {
                    console.log(error)
                    this.error = error.response.data.message
                    this.$store.commit("logout")
                    this.$router.push("/login")
                })
        },
        async deleteEvent(id) {
            await axios
                .delete(this.$store.getters.getBackEndUri + "/events/" + id)
                .then((response) => {
                    console.log(response)
                    this.$router.push("/events")
                    this.closeDeleteDialog()
                })
                .catch((error) => {
                    console.log(error)
                    this.error = error.response.data.message
                    this.$store.commit("logout")
                    this.$router.push("/login")
                })
        },
        openDeleteDialog(){
            this.deleteDialog = true
        },
        closeDeleteDialog(){
            this.deleteDialog = false
        },
        formatDate(dateString) {
            const date = new Date(dateString);
            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            return date.toLocaleDateString('en-US', options);
        },
    }
}

</script>

<!--Create a v-card to display all the infos of the event and to display "NumberOfParticipants/NumberOfParticipantsMax"-->
<template>
    <v-dialog v-model="eventFullDialog" max-width="600px" hide-overlay transition="dialog-bottom-transition">
        <v-card color="primary" class="d-flex flex-column align-center">
            <v-card-title>
                <span class="headline"> The event is full </span>
            </v-card-title>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="eventFullDialog = false" variant="flat">Ok</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>

    <v-dialog v-model="deleteDialog" max-width="600px" hide-overlay transition="dialog-bottom-transition">
        <v-card color="primary">
            <v-card-title>
                <span class="headline">Are you sure you want to delete this event ?</span>
            </v-card-title>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="orange darken-1" text @click="deleteDialog = false" variant="flat">Cancel</v-btn>
                <v-btn color="red darken-1" text @click="deleteEvent(currentEventId)" variant="flat">Delete</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>

    <v-card class="d-flex flex-column align-center ma-10 pa-4" color="grey">
        <v-card-title class="event-title">{{event.name}}</v-card-title>
        <div class="d-flex flex-row">
            <v-chip color="white" class="ml-2 mb-2" v-for="tag in event.Tags" :key="tag.name">{{tag.name}}</v-chip>
        </div>
        <v-card-text>
            <p>{{ event.description }}</p>
        </v-card-text>
        <v-card-text>
            <p>Date: {{ formatDate(event.date) }}</p>
            <p>Duration: {{ event.duration }}</p>
            <p>Price: {{ event.price }} USD</p>
            <p>Address: {{ event.location }}, {{ event.postal_code }} {{ event.city }}</p>
            <p>Participants: {{ this.numberOfParticipants }} / {{ event.max_participants }}</p>
        </v-card-text>
        <v-card-actions>
            <v-btn v-if="!this.registeredEventsIds.includes(event.id) && !(this.$store.getters.getMailAddress === event.organizer_id)" color="blue darken-1" @click="registerToEvent(event.id)" variant="flat">
                <v-icon>mdi-account-plus</v-icon>
                Register
            </v-btn>
            <v-btn v-else-if="this.registeredEventsIds.includes(event.id) && !(this.$store.getters.getMailAddress === event.organizer_id)" color="orange darken-1" @click="unregisterToEvent(event.id)" variant="flat">
                <v-icon>mdi-account-minus</v-icon>
                    Unregister
            </v-btn>
            <v-btn v-if="(this.$store.getters.getMailAddress === event.organizer_id) || this.$store.getters.isAdmin" color="red darken-1" @click="openDeleteDialog()" variant="flat">
                <v-icon>mdi-delete</v-icon>
                    Delete
            </v-btn>
        </v-card-actions>
    </v-card>
</template>

<style scoped>
    .event-title {
        font-size: 30px;
        font-weight: bold;
        background-color: darkgray;
        color: white;
        border-radius: 50px;
        margin-bottom: 10px;
    }
</style>