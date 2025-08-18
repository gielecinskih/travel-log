<script setup lang="ts">
const locationStore = useLocationStore();
const mapStore = useMapStore();

const { locations, locationsStatus } = storeToRefs(locationStore);

onMounted(() => {
  locationStore.refreshLocations();
});
</script>

<template>
  <div class="p-4">
    <h2 class="text-2xl">
      Locations
    </h2>
    <div v-if="locationsStatus === 'pending'" class="mt-4">
      <span class="loading loading-spinner loading-xl" />
    </div>
    <div v-else-if="locations && locations.length" class="flex flex-nowrap my-4 gap-2 overflow-auto">
      <nuxt-link
        v-for="location in locations"
        :key="location.id"
        :to="{ name: 'dashboard-location-slug', params: { slug: location.slug } }"
        class="card card-compact bg-base-300 border-2 border-transparent h-40 w-72 mb-2 shrink-0 hover:cursor-pointer"
        :class="{ '!border-accent': isPointSelected(location, mapStore.selectedPoint) }"
        @mouseenter="mapStore.selectedPoint = createMapPointFromLocation(location ?? null)"
        @mouseleave="mapStore.selectedPoint = null"
      >
        <div class="card-body">
          <h3 class="text-xl">
            {{ location.name }}
          </h3>
          <p>{{ location.description }}</p>
        </div>
      </nuxt-link>
    </div>
    <div v-else class="flex flex-col gap-2 mt-4">
      <p>
        Add a location to get started
      </p>
      <nuxt-link to="/dashboard/add" class="btn btn-primary w-40">
        Add Location
        <Icon name="tabler:circle-plus-filled" size="24" />
      </nuxt-link>
    </div>
  </div>
</template>
