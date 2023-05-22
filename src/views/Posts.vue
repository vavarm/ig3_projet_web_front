<script>
import axios from "axios";
export default {
    name: "Posts",
    data() {
        return {
            posts: [],
            error: "",
            errorDialog: "",
            search: "",
            dialog: false,
            title: "",
            content: "",
            existingTags: [],
            selectedTags: [],
            newTag: "",
        };
    },
    created() {
        this.getPosts();
        this.getTags();
    },
    methods: {
        getPosts() {
            axios
                .get(this.$store.getters.getBackEndUri + "/posts")
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
        deletePost(postId) {
            axios
                .delete(this.$store.getters.getBackEndUri + "/posts/" + postId)
                .then((response) => {
                    console.log(response);
                    this.getPosts();
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
        },
        getTags() {
            axios
                .get(this.$store.getters.getBackEndUri + "/tags")
                .then((response) => {
                    console.log(response);
                    //map tags to array
                    this.existingTags = response.data.map((tag) => {
                        return tag.name;
                    });
                })
                .catch((error) => {
                    console.log(error);
                    this.error = error.response.data.message;
                });
        },
        openDialog() {
            this.dialog = true;
            this.getTags();
        },
        closeDialog() {
            this.dialog = false;
            this.title = "";
            this.content = "";
            this.selectedTags = [];
        },
        async createPost() {
            if (!this.title) {
                this.errorDialog = "Title is required";
                return;
            }
            try {
                const response = await axios.post(this.$store.getters.getBackEndUri + "/posts", {
                    "title": this.title,
                    "content": this.content,
                    "tags": this.selectedTags,
                })
                console.log(response)
                this.getPosts()
                this.closeDialog()
            } catch (error) {
                console.log(error);
                this.errorDialog = error.response.data.message;
                this.$store.commit("logout")
                this.$router.push("/login")
            }
        },
        async createTag() {
            if (this.newtag.length > 20) {
                this.errorDialog = "Tag must be less than 20 characters";
                return;
            }
            if (this.existingTags.includes(this.newTag)) {
                this.errorDialog = "Tag already exists";
                return;
            }
            try {
                const response = await axios.post(this.$store.getters.getBackEndUri + "/tags", {
                    "name": this.newTag,
                })
                console.log(response)
                this.getTags()
                this.newTag = ""
            } catch (error) {
                console.log(error);
                this.errorDialog = error.response.data.message;
                this.$store.commit("logout")
                this.$router.push("/login")
            }
        }
    },
    computed: {
        filteredPosts() {
            if (!this.search || this.search === 'ALL') {
                return this.posts;
            }
            return this.posts.filter((post) => {
                return post.Tags.some((tag) => {
                    return tag.name.toLowerCase().includes(this.search.toLowerCase());
                });
            });
        },
        selectTags() {
            const items = [...this.existingTags]
            items.unshift('ALL')
            return items
        },
    },
}

</script>

<template>
    <!--Modal to create a new post-->
    <v-dialog v-model="dialog" max-width="500px" :fullscreen="$vuetify.display.mdAndDown" hide-overlay transition="dialog-bottom-transition">
        <v-card color="primary">
            <v-card-title>
                <span class="headline">Create a new post</span>
            </v-card-title>
                <v-form ref="form">
                    <v-text-field v-model="title" label="Title" :rules="[v => !!v || 'Title is required']"></v-text-field>
                    <v-textarea v-model="content" label="Content"></v-textarea>
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
                <v-btn color="blue darken-1" text @click="closeDialog">Cancel</v-btn>
                <v-btn color="blue darken-1" text @click="createPost">Save</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>

    <div class="ma-4" id="posts">
        <h1>Posts</h1>
        <!--button to open the modal to create a new post-->
        <v-btn color="primary" class="mb-4" @click="openDialog" >Create a new post</v-btn>
        <!--SearchBar to filter the posts by tag (the tags are displayed as chips)-->
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
            <div v-if="error" class="error">{{error}}</div>
            <div v-else-if="posts.length === 0" class="loading">Loading...</div>
            <div v-else v-for="post in filteredPosts" :key="post.id" class="d-flex" style="width: 100%" xs12 md6 lg4>
                <v-card class="mb-4" color="#5A33CE" style="width: 100%">
                    <v-card-title>
                        {{post.title}}
                    </v-card-title>
                    <div class="d-flex flex-row" style="width: 100%">
                        <v-chip color="white" class="ml-2 mb-2" v-for="tag in post.Tags" :key="tag.name">{{tag.name}}</v-chip>
                    </div>
                    <v-card-subtitle>{{post.author_id + " - " + formatDate(post.createdAt) }}</v-card-subtitle>
                    <v-card-text>{{post.content}}</v-card-text>
                    <v-card-actions v-if="(this.$store.getters.getMailAddress === post.author_id) || this.$store.getters.isAdmin">
                        <v-spacer></v-spacer>
                        <v-btn color="red darken-1" text @click="deletePost(post.id)">Delete</v-btn>
                    </v-card-actions>
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
.line {
    background-color: white;
    height: 2px;
    margin: 20px 0;
}
.error {
    color: red;
}
</style>