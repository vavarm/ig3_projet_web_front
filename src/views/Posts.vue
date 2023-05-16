<script>
import axios from "axios";
export default {
    name: "Posts",
    data() {
        return {
            posts: [],
            error: "",
        };
    },
    created() {
        this.getPosts();
    },
    methods: {
        getPosts() {
            axios
                .get("http://localhost:3002/posts")
                .then((response) => {
                    console.log(response);
                    //arrrange posts by date
                    response.data.sort((a, b) => {
                        return new Date(b.createdAt) - new Date(a.createdAt);
                    });
                    this.posts = response.data;
                })
                .catch((error) => {
                    console.log(error);
                    this.error = error.response.data.message;
                });
        },
        formatDate(dateString) {
            const date = new Date(dateString);
            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            return date.toLocaleDateString('en-US', options);
        }
    }
}

</script>

<template>
    <div class="ma-4">
        <h1>Posts</h1>
        <div>
            <div v-if="error" class="error">{{error}}</div>
            <div v-else-if="posts.length === 0" class="loading">Loading...</div>
            <div v-else v-for="post in posts" :key="post.id" class="d-flex" style="width: 100%" xs12 md6 lg4>
                <v-card class="ma-4" color="#5A33CE" style="width: 100%">
                    <v-card-title>
                        {{post.title}}
                    </v-card-title>
                    <v-card-subtitle>{{post.author_id + " - " + formatDate(post.createdAt) }}</v-card-subtitle>
                    <v-card-text>{{post.content}}</v-card-text>
                </v-card>
            </div>
        </div>
    </div>
</template>

<style scoped>
.v-card-title {
    color: white;
}
.v-card-subtitle {
    color: white;
}
.v-card-text {
    color: white;
}
</style>