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
        <div
          class="tooltip tooltip-top hover:cursor-pointer"
          :class="{ ' tooltip-open': mapStore.selectedPoint?.id === point.id }"
          :data-tip="point.name"
          @mouseenter="mapStore.selectPointWithoutFlyTo(point) "
          @mouseleave="mapStore.selectPointWithoutFlyTo(null)"
        >
          <Icon
            name="tabler:map-pin-filled"
            :class="mapStore.selectedPoint?.id === point.id ? 'text-accent' : 'text-secondary'"
            :size="30"
          />
        </div>
      </template>
      <MglPopup>
        <h3 class="text-xl">
          {{ point.name }}
        </h3>
        <p v-if="point.description">
          {{ point.description }}
        </p>
      </MglPopup>
    </MglMarker>
  </MglMap>
</template>
