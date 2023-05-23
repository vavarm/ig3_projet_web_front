<script>
import axios from "axios"
export default{
    name: "Events",
    data() {
        return {
            currentEventId: -1,
            events: [],
            registeredEventsIds: [],
            eventFullDialog: false,
            deleteDialog: false,
            error: "",
            errorDialog: "",
            search: "",
            dialog: false,
            name: "",
            description: "",
            date: null,
            duration: 0,
            location: "",
            postal_code: "",
            city: "",
            price: 0,
            max_participants: 0,
            existingTags: [],
            selectedTags: [],
            newTag: "",
        }
    },
    created() {
        this.getEvents()
        this.getTags()
        this.getRegisteredEvents()
    },
    methods: {
        async getEvents(){
            await axios
                .get(this.$store.getters.getBackEndUri + "/events")
                .then((response) => {
                    console.log(response)
                    //arrrange events by date
                    response.data.sort((a, b) => {
                        return new Date(b.date) - new Date(a.date)
                    })
                    this.events = response.data
                })
                .catch((error) => {
                    console.log(error)
                    this.error = error.response.data.message
                })
        },
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
        async getTags() {
            await axios
                .get(this.$store.getters.getBackEndUri + "/tags")
                .then((response) => {
                    console.log(response)
                    //map tags to array
                    this.existingTags = response.data.map((tag) => {
                        return tag.name
                    })
                })
                .catch((error) => {
                    console.log(error)
                    this.error = error.response.data.message
                })
        },
        async deleteEvent(eventId){
            await axios
                .delete(this.$store.getters.getBackEndUri + "/events/" + eventId)
                .then((response) => {
                    console.log(response)
                    this.getEvents()
                    this.deleteDialog = false
                })
                .catch((error) => {
                    console.log(error)
                    this.error = error.response.data.message
                    this.$store.commit("logout")
                    this.$router.push("/login")
                })
        },
        formatDate(dateString){
            const date = new Date(dateString)
            const options = { year: 'numeric', month: 'long', day: 'numeric' }
            return date.toLocaleDateString('en-US', options)
        },
        openDialog(){
            this.dialog = true
        },
        closeDialog(){
            this.dialog = false
            this.name = ""
            this.description = ""
            this.date = null
            this.duration = 0
            this.location = ""
            this.postal_code = ""
            this.city = ""
            this.price = 0
            this.max_participants = 0
            this.selectedTags = []
        },
        openDeleteDialog(eventId){
            this.deleteDialog = true
            this.currentEventId = eventId
        },
        closeDeleteDialog(){
            this.deleteDialog = false
            this.currentEventId = -1
        },
        async createEvent(){
            await axios
                .post(this.$store.getters.getBackEndUri + "/events", {
                    "name": this.name,
                    "description": this.description,
                    "date": this.date,
                    "duration": this.duration,
                    "location": this.location,
                    "postal_code": this.postal_code,
                    "city": this.city,
                    "price": this.price,
                    "max_participants": this.max_participants,
                    "tags": this.selectedTags,
                })
                .then((response) => {
                    console.log(response)
                    this.getEvents()
                    this.dialog = false
                })
                .catch((error) => {
                    console.log(error)
                    this.errorDialog = error.response.data.message
                    this.$store.commit("logout")
                    this.$router.push("/login")
                })
        },
        async createTag(){
            await axios
                .post(this.$store.getters.getBackEndUri + "/tags", {
                    "name": this.newTag,
                })
                .then((response) => {
                    console.log(response)
                    this.getTags()
                    this.newTag = ""
                })
                .catch((error) => {
                    console.log(error)
                    this.errorDialog = error.response.data.message
                    this.$store.commit("logout")
                    this.$router.push("/login")
                })
        },
        async registerToEvent(eventId){
            await axios
                .post(this.$store.getters.getBackEndUri + "/events/register/" + eventId)
                .then((response) => {
                    console.log(response)
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
        async unregisterToEvent(eventId){
            await axios
                .post(this.$store.getters.getBackEndUri + "/events/unregister/" + eventId)
                .then((response) => {
                    console.log(response)
                    this.getRegisteredEvents()
                })
                .catch((error) => {
                    console.log(error)
                    this.error = error.response.data.message
                    this.$store.commit("logout")
                    this.$router.push("/login")
                })
        },
    },
    computed: {
        filteredEvents() {
            if (!this.search || this.search === 'ALL') {
                return this.events
            }
            return this.events.filter((event) => {
                return event.Tags.some((tag) => {
                    return tag.name.toLowerCase().includes(this.search.toLowerCase())
                })
            })
        },
        selectTags() {
            const items = [...this.existingTags]
            items.unshift('ALL')
            return items
        },
    }
}
</script>

<template>
    <v-dialog v-model="dialog" max-width="1000px" :fullscreen="$vuetify.display.smAndDown" hide-overlay transition="dialog-bottom-transition">
        <v-card color="primary">
            <v-card-title>
                <span class="headline">Create a new event</span>
            </v-card-title>
                <v-form ref="form">
                    <v-text-field v-model="name" label="Name" :rules="[v => !!v || 'Name is required']"></v-text-field>
                    <v-textarea v-model="description" label="Description" :rules="[v => !!v || 'Description is required']"></v-textarea>
                    <v-text-field v-model="date" label="Date" type="date" :rules="[v => !!v || 'Date is required']"></v-text-field>
                    <v-text-field v-model="duration" label="Duration (hours)" type="number" :rules="[v => !!v || 'Duration is required']"></v-text-field>
                    <v-text-field v-model="location" label="Location" :rules="[v => !!v || 'Location is required']"></v-text-field>
                    <v-text-field v-model="postal_code" label="Postal code" :rules="[v => !!v || 'Postal code is required']"></v-text-field>
                    <v-text-field v-model="city" label="City" :rules="[v => !!v || 'City is required']"></v-text-field>
                    <v-text-field v-model="price" label="Price (USD)" type="number" :rules="[v => !!v || 'Price is required']"></v-text-field>
                    <v-text-field v-model ="max_participants" label="Max participants" type="number" :rules="[v => !!v || 'Max participants is required']"></v-text-field>
                    <v-select
                        v-model="selectedTags"
                        :items="existingTags"
                        item-text="name"
                        item-value="name"
                        label="Tags"
                        multiple
                        chips
                        small-chips
                        deletable-chips
                    ></v-select>
                    <div class="line"></div>
                    <v-text-field v-model="newTag" label="New tag" :rules="[v => !!v || 'Tag is required', v => v.length <= 20 || 'Tag must be less than 20 characters']"></v-text-field>
                    <v-btn color="primary" @click="createTag">Create tag</v-btn>
                    <div class="line"></div>
                </v-form>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="orange darken-1" text @click="closeDialog" variant="flat">Cancel</v-btn>
                <v-btn color="blue darken-1" text @click="createEvent" variant="flat">Save</v-btn>
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

    <v-dialog v-model="eventFullDialog" max-width="600px" hide-overlay transition="dialog-bottom-transition">
        <v-card color="primary" class="d-flex justify-center align-center">
            <v-card-title>
                <span class="headline"> The event is full </span>
            </v-card-title>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="eventFullDialog = false" variant="flat">Ok</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>

    <div class="ma-4">
        <h1>Events</h1>
        <!--button to open the modal to create a new event-->
        <v-btn color="primary" class="mb-4" @click="openDialog" >Create a new event</v-btn>
        <!--SearchBar to filter the events by tag (the tags are displayed as chips)-->
        <v-select
            v-model="search"
            :items="selectTags"
            item-text="name"
            item-value="name"
            label="Search by tag"
            chips
            small-chips
            deletable-chips
        ></v-select>
        <div>
            <div v-if="events.length === 0" class="loading">Loading...</div>
            <div v-for="event in filteredEvents" :key="event.id" class="d-flex" style="width: 100%" xs12 md6 lg4>
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
                    <v-card-actions v-if="this.$store.getters.isLoggedIn">
                        <v-spacer></v-spacer>
                        <v-btn v-if="!this.registeredEventsIds.includes(event.id) && !(this.$store.getters.getMailAddress === event.organizer_id)" color="blue darken-1" @click.stop="registerToEvent(event.id)" variant="flat">
                            <v-icon>mdi-account-plus</v-icon>
                            Register
                        </v-btn>
                        <v-btn v-else-if="this.registeredEventsIds.includes(event.id) && !(this.$store.getters.getMailAddress === event.organizer_id)" color="orange darken-1" @click.stop="unregisterToEvent(event.id)" variant="flat">
                            <v-icon>mdi-account-minus</v-icon>
                            Unregister
                        </v-btn>
                        <v-btn v-if="(this.$store.getters.getMailAddress === event.organizer_id) || this.$store.getters.isAdmin" color="red darken-1" @click.stop="openDeleteDialog(event.id)" variant="flat">
                            <v-icon>mdi-delete</v-icon>
                            Delete
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </div>
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