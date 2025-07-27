<script setup lang="ts">
const route = useRoute();
const error = route.query.error || "An unknown error occurred";
</script>

<template>
  <div class="card  container mt-4 min-h-72 text-center mx-auto flex flex-col items-center justify-center gap-4">
    <div role="alert" class="alert alert-error min-w-1/2 text-center">
      <span>Oh no! {{ error }}</span>
    </div>
    <nuxt-link to="/" class="btn btn-primary">
      Home
      <icon name="tabler:arrow-left" size="32" />
    </nuxt-link>
  </div>
</template>
