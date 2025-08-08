<script lang="ts" setup>
import { CENTER_POLAND } from "~/lib/constants";

const colorMode = useColorMode();
const style = computed(() => {
  return colorMode.value === "dark" ? "/styles/dark.json" : "https://tiles.openfreemap.org/styles/liberty";
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
  </MglMap>
</template>
