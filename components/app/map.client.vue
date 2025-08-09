<script lang="ts" setup>
import { CENTER_POLAND } from "~/lib/constants";

const colorMode = useColorMode();
const style = computed(() => {
  return colorMode.value === "dark" ? "/styles/dark.json" : "https://tiles.openfreemap.org/styles/liberty";
});

const mapStore = useMapStore();

onMounted(() => {
  mapStore.initMap();
});

const center = CENTER_POLAND;
const zoom = 4;
</script>

<template>
  <MglMap
    :map-style="style"
    :center="center"
    :zoom="zoom"
  >
    <MglNavigationControl />
    <MglMarker
      v-for="point in mapStore.mapPoints"
      :key="point.id"
      :coordinates="[point.lng, point.lat]"
    >
      <template #marker>
        <div class="tooltip" :data-tip="point.label">
          <Icon
            name="tabler:map-pin-filled"
            :size="30"
            class="text-secondary"
          />
        </div>
      </template>
    </MglMarker>
  </MglMap>
</template>
