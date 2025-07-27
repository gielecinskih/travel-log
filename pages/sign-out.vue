<script setup lang="ts">
const authStore = useAuthStore();

onMounted(async () => {
  await authStore.signOut();
  navigateTo("/");
});
</script>

<template>
  <div class="card  container mt-4 min-h-72 text-center mx-auto flex flex-col items-center justify-center gap-4">
    <span class="loading loading-dots loading-xl" />
  </div>
</template>
