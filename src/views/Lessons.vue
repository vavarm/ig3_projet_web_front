<script>
import axios from "axios"

export default {
    name: "Lessons",
    data() {
        return {
            lessons: [],
            error: "",
            dialogError: "",
            openDialog: false,
            name: "",
            description: "",
            selectedFile: null,
            search: "",
            existingTags: [],
            selectedTags: [],
            newTag: "",
        };
    },
    created() {
        this.getLessons()
        this.getTags()
    },
    methods: {
        async getLessons(){
            await axios
                .get(this.$store.getters.getBackEndUri + "/lessons")
                .then((response) => {
                    console.log(response)
                    // arrange lessons by date
                    response.data.sort((a, b) => {
                        return new Date(b.createdAt) - new Date(a.createdAt)
                    })
                    this.lessons = response.data
                })
                .catch((error) => {
                    console.log(error)
                    this.error = error.response.data.message
                    this.$store.commit("logout")
                    this.$router.push("/login")
                })
        },
        async createLesson(){
            if (this.name === ""){
                this.dialogError = "Name cannot be empty"
                return
            }
            if (this.description === ""){
                this.dialogError = "Description cannot be empty"
                return
            }
            if (this.selectedFile === null){
                this.dialogError = "File cannot be empty"
                return
            }
            if (this.name.length > 40){
                this.dialogError = "Name must be less than 20 characters"
                return
            }
            if (this.description.length > 200){
                this.dialogError = "Description must be less than 200 characters"
                return
            }
            await axios
                .post(this.$store.getters.getBackEndUri + "/lessons", {
                    "name": this.name,
                    "description": this.description,
                    "tags": this.selectedTags,
                })
                .then((response) => {
                    console.log(response)
                    this.uploadLesson(response.data.id)
                })
                .catch((error) => {
                    console.log(error)
                    this.dialogError = error.response.data.message
                    this.$store.commit("logout")
                    this.$router.push("/login")
                })
        },
        async uploadLesson(id){
            if (this.selectedFile === null){
                this.dialogError = "File cannot be empty"
                return
            }
            //filesize limit 0.9MB
            if(this.selectedFile[0].size > 900000){
                this.dialogError = "File size must be less than 0.9MB"
                return
            }
            const formData = new FormData()
            formData.append("file", this.selectedFile[0])

            for (var pair of formData.entries()) {
                console.log(pair[0]+ ', ' + pair[1]); 
            }

            await axios
                .post(this.$store.getters.getBackEndUri + `/lessons/upload/${id}`, formData, {headers: {
                    "Content-Type": "multipart/form-data",
                }})
                .then((response) => {
                    console.log(response)
                    this.getLessons()
                    this.openDialog = false
                    this.selectedFile = null
                })
                .catch((error) => {
                    console.log(error)
                    this.dialogError = error.response.data.message
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
        async createTag(){
            if (this.newTag === ""){
                return
            }
            if (this.existingTags.includes(this.newTag)){
                this.dialogError = "Tag already exists"
                return
            }
            if (this.newTag.length > 20){
                this.dialogError = "Tag must be less than 20 characters"
                return
            }
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
                    this.dialogError = error.response.data.message
                    this.$store.commit("logout")
                    this.$router.push("/login")
                })
        },
        closeDialog(){
            this.openDialog = false
            this.name = ""
            this.description = ""
            this.selectedFile = null
            this.selectedTags = []
        },
        formatDate(dateString){
            const date = new Date(dateString)
            const options = { year: 'numeric', month: 'long', day: 'numeric' }
            return date.toLocaleDateString('en-US', options)
        },
    },
    computed: {
        filteredLessons() {
            if (!this.search || this.search === 'ALL') {
                return this.lessons
            }
            return this.lessons.filter((lesson) => {
                return lesson.Tags.some((tag) => {
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
    <v-dialog v-model="openDialog" max-width="1000px" :fullscreen="$vuetify.display.smAndDown" hide-overlay transition="dialog-bottom-transition">
        <v-card color="primary" class="pa-10">
            <v-card-title>
                <span class="headline">Create a new lesson</span>
            </v-card-title>
            <span v-if="dialogError !== ''" class="error">{{ dialogError }}</span>
            <v-form ref="form">
                <v-text-field
                    v-model="name"
                    label="Name"
                    :rules="[v => !!v || 'Name is required', v => v.length <= 40 || 'Name must be less than 40 characters']"
                ></v-text-field>
                <v-textarea
                    v-model="description"
                    label="Description"
                    :rules="[v => !!v || 'Description is required', v => v.length <= 200 || 'Description must be less than 200 characters']"
                ></v-textarea>
                <v-file-input label="File input" v-model="selectedFile" accept="application/pdf"></v-file-input>
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
                <v-text-field
                    v-model="newTag"
                    label="New Tag"
                    :rules="[v => v.length <= 20 || 'Tag must be less than 20 characters']"
                ></v-text-field>
                <v-btn color="primary" @click="createTag">Create Tag</v-btn>
                <div class="line"></div>
            </v-form>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="orange darken-1" @click="createLesson" variant="flat">Create</v-btn>
                <v-btn color="blue darken-1" @click="closeDialog" variant="flat">Close</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>


    <div class="ma-4">
        <h1>Lessons</h1>
        <!--button to open the modal to create a new Lesson-->
        <v-btn v-if="this.$store.getters.isLoggedIn" color="primary" class="mb-4" @click="openDialog = true">Create new Lesson</v-btn>
        <!--Searchbar to filter the lessons by tag (the tags are displayed as chips)-->
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
            <div v-if="lessons.length === 0">
                No lessons found
            </div>
            <div v-for="lesson in filteredLessons" :key="lesson.id">
                <v-card class="mb-4" color="#5A33CE" style="width: 100%" @click="this.$router.push({ path: '/lesson/' + lesson.id })">
                    <v-card-title>
                        <h2>{{ lesson.name }}</h2>
                    </v-card-title>
                    <div class="d-flex flex-row" style="width: 100%">
                        <v-chip color="white" class="ml-2 mb-2" v-for="tag in lesson.Tags" :key="tag.name">{{tag.name}}</v-chip>
                    </div>
                    <v-card-subtitle>
                        <h3>Uploaded by {{ lesson.author_id }}</h3>
                        <h5>{{ formatDate(lesson.createdAt) }}</h5>
                    </v-card-subtitle>
                    <v-card-text>
                        <p>{{ lesson.description }}</p>
                    </v-card-text>
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