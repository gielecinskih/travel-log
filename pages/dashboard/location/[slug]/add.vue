<script lang="ts" setup>
import type { InsertLocationLog } from "~/lib/db/schema";

import { CENTER_POLAND } from "~/lib/constants";

const route = useRoute();
const { currentLocation } = useLocationStore();

const { $csrfFetch } = useNuxtApp();

async function onSubmit(values: InsertLocationLog) {
  await $csrfFetch(`/api/locations/${route.params.slug}/add`, {
    method: "POST",
    body: values,
  });
}

function submitComplete() {
  navigateTo({
    name: "dashboard-location-slug",
    params: {
      slug: route.params.slug,
    },
  });
}
</script>

<template>
  <location-log-form
    submit-label="Add Location Log"
    submit-icon="tabler:map-pin-plus"
    :on-submit="onSubmit"
    :on-submit-complete="submitComplete"
    :initial-values="{
      name: '',
      description: '',
      startedAt: Date.now() - (24 * 60 * 60 * 1000),
      endedAt: Date.now(),
      lng: currentLocation?.lng || CENTER_POLAND.lng,
      lat: currentLocation?.lat || CENTER_POLAND.lat,
    }"
  />
</template>
