<script>
</script>

<template>
    <v-form class="form">
        <v-form-title>Sign Up</v-form-title>
        <v-text-field
            v-model="email"
            label="Email"
            type="email"
            required
        ></v-text-field>
        <v-text-field
            v-model="username"
            label="Username"
            type="text"
            required
        ></v-text-field>
        <v-text-field
            v-model="password"
            label="Password"
            type="password"
            required
        ></v-text-field>
        <v-text-field
            v-model="confirmPassword"
            label="Confirm Password"
            type="password"
            required
        ></v-text-field>
        <v-checkbox
            v-model="newsletter"
            label="I want to receive the new content and updates in my mailbox."
            required
        ></v-checkbox>
        <v-btn color="primary" type="submit">Sign Up</v-btn>
    </v-form>
</template>

<style scoped>
    .form {
        width: 100%;
        max-width: 500px;
        margin: 30px auto;
    }
    v-form-title {
        font-size: 2rem;
        font-weight: bold;
        margin-bottom: 1rem;
    }
</style>