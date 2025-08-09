<script lang="ts" setup>
import type { LngLat, MapMouseEvent } from "maplibre-gl";

import { CENTER_POLAND } from "~/lib/constants";

const colorMode = useColorMode();
const style = computed(() => {
  return colorMode.value === "dark" ? "/styles/dark.json" : "https://tiles.openfreemap.org/styles/liberty";
});

const mapStore = useMapStore();

onMounted(() => {
  mapStore.initMap();
});

function updateAddedPoint(location: LngLat) {
  if (mapStore.addedPoint) {
    mapStore.addedPoint.lat = location.lat;
    mapStore.addedPoint.lng = location.lng;
  }
}

function onDoubleClick(event: MapMouseEvent) {
  if (mapStore.addedPoint) {
    event.preventDefault();
    updateAddedPoint(event.lngLat);
  }
}

const center = CENTER_POLAND;
const zoom = 4;
</script>

<template>
  <MglMap
    :map-style="style"
    :center="center"
    :zoom="zoom"
    @map:dblclick="onDoubleClick($event.event)"
  >
    <MglNavigationControl />
    <MglMarker
      v-if="mapStore.addedPoint"
      :coordinates="{
        lng: mapStore.addedPoint.lng,
        lat: mapStore.addedPoint.lat,
      }"
      draggable
      @update:coordinates="updateAddedPoint"
    >
      <template #marker>
        <div
          class="tooltip tooltip-top tooltip-open hover:cursor-pointer"
          data-tip="Drag to your desired location"
        >
          <Icon
            name="tabler:map-pin-filled"
            class="text-warning"

            :size="30"
          />
        </div>
      </template>
    </MglMarker>
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
          @mouseenter="mapStore.selectedPoint = point"
          @mouseleave="mapStore.selectedPoint = null"
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
