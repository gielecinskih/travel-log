<script setup lang="ts">
const authStore = useAuthStore();
</script>

<template>
  <div class="hero bg-base-300 container mx-auto mt-4">
    <div class="hero-content text-center min-h-96">
      <div class="max-w-md">
        <h1 class="text-5xl font-bold">
          Travel Log
        </h1>
        <p class="py-6">
          Discover and share your travel experiences with the world. Join our community of travelers and start logging your adventures today!
        </p>
        <auth-button v-if="!authStore.user" />
        <nuxt-link v-else to="/dashboard" class="btn btn-primary">
          Go to Dashboard
        </nuxt-link>
      </div>
    </div>
  </div>
</template>
