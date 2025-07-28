<script setup lang="ts">
const authStore = useAuthStore();
await authStore.init();
</script>

<template>
  <div class="flex min-h-screen flex-col">
    <app-nav-bar />
    <main class="flex-1 flex flex-col">
      <slot />
    </main>
  </div>
</template>
