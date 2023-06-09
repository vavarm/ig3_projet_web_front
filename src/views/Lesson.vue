<script>
import axios from "axios"

export default {
    name: "Lesson",
    data() {
        return {
            lessonId: this.$route.params.id,
            lesson: {},
            error: "",
            deleteDialog: false,
            documentUrl: "",
        }
    },
    created() {
        this.getLesson(this.$route.params.id)
        this.documentUrl = this.$store.getters.getBackEndUri + "/" + this.$route.params.id + ".pdf"
        console.log(this.documentUrl)
    },
    methods: {
        async getLesson(id) {
            await axios
                .get(this.$store.getters.getBackEndUri + "/lessons/" + id)
                .then((response) => {
                    console.log(response)
                    this.lesson = response.data
                })
                .catch((error) => {
                    console.log(error)
                    this.error = error.response.data.message
                    this.$store.commit("logout")
                    this.$router.push("/login")
                })
        },
        async deleteLesson(id) {
            await axios
                .delete(this.$store.getters.getBackEndUri + "/lessons/" + this.$route.params.id)
                .then((response) => {
                    console.log(response)
                    this.$router.push("/lessons")
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
        openPdf() {
            window.open(this.documentUrl, '_blank');
        }
    }
}

</script>

<!--Create a v-card to display all the infos of the event and to display "NumberOfParticipants/NumberOfParticipantsMax"-->
<template>

    <v-dialog v-model="deleteDialog" max-width="600px" hide-overlay transition="dialog-bottom-transition">
        <v-card color="primary">
            <v-card-title>
                <span class="headline">Are you sure you want to delete this lesson ?</span>
            </v-card-title>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="orange darken-1" text @click="deleteDialog = false" variant="flat">Cancel</v-btn>
                <v-btn color="red darken-1" text @click="deleteLesson(currentEventId)" variant="flat">Delete</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
    <div class="d-flex flex-column justify-space-between page-section" style="width: 100%">
        <v-card class="pa-4">
        <v-card-title class="lesson-title">{{lesson.name}}</v-card-title>
        <div class="d-flex flex-row justify-center">
            <v-chip class="ml-2 mb-2" v-for="tag in lesson.Tags" :key="tag.name">{{tag.name}}</v-chip>
        </div>
        <v-card-text class="lesson-description">{{ lesson.description }}</v-card-text>
        <v-card-text>
            <div class="d-flex flex-row"><v-icon>mdi-calendar</v-icon><p> Date of creation: {{ formatDate(lesson.createdAt) }}</p></div>
            <div class="d-flex flex-row"><v-icon>mdi-pen</v-icon><p> Author: {{ lesson.author_id }}</p></div>
        </v-card-text>
        </v-card>
        <div class="pdf-container"><iframe width="100%" height="100%" :src="`${this.documentUrl}`"></iframe></div>
        <div class="d-flex flex-row justify-space-between" style="width: 100%">
            <v-btn @click="openPdf()" color="primary" variant="flat">
                <v-icon>mdi-open-in-new</v-icon>
                Open In New Tab
            </v-btn>
            <v-btn v-if="(this.$store.getters.getMailAddress === lesson.author_id) || this.$store.getters.isAdmin" color="red darken-1" @click="openDeleteDialog()" variant="flat">
                <v-icon>mdi-delete</v-icon>
                Delete
            </v-btn>
        </div>
    </div>
</template>

<style scoped>
    .lesson-title {
        font-weight: bold;
        text-align: center;
    }
    .lesson-description {
        text-align: center;
    }
    .page-section {
        height: calc(100vh - 60px);
    }
    .pdf-container {
        flex: 1;
        width: 100%;
    }
</style>