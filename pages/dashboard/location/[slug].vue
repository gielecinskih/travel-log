<script setup lang="ts">
const locationsStore = useLocationStore();
const { currentLocation, currentLocationStatus, currentLocationError } = storeToRefs(locationsStore);

onMounted(() => {
  locationsStore.refreshCurrentLocation();
});
</script>

<template>
  <div class="p-4 min-h-64">
    <div v-if="currentLocationStatus === 'pending'">
      <div class="loading" />
    </div>
    <div v-if="currentLocation && currentLocationStatus !== 'pending' ">
      <h2 class="text-xl">
        {{ currentLocation.name }}
      </h2>
      <p class="text-sm">
        {{ currentLocation.description }}
      </p>
      <div v-if="!currentLocation.locationLogs.length" class="mt-4">
        <p class="text-sm ">
          Add a location log to get started.
        </p>
        <nuxt-link :to="{ name: 'dashboard-location-slug-add', params: { slug: currentLocation.slug } }" class="btn btn-primary mt-2">
          Add Location log
          <Icon name="tabler:map-pin-plus" size="24" />
        </nuxt-link>
      </div>
    </div>
    <div v-if="currentLocationError && currentLocationStatus !== 'pending'" class="alert alert-error">
      <h2 class="text-lg">
        {{ currentLocationError.statusMessage }}
      </h2>
    </div>
  </div>
</template>
