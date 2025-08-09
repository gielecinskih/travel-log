<script setup lang="ts">
import type { FetchError } from "ofetch";

import { toTypedSchema } from "@vee-validate/zod";

import { CENTER_POLAND } from "~/lib/constants";
import { insertLocationSchema } from "~/lib/db/schema";

const { $csrfFetch } = useNuxtApp();
const mapStore = useMapStore();

const loading = ref(false);
const submited = ref(false);

const submitError = ref("");
const { handleSubmit, errors, meta, setErrors, setFieldValue, controlledValues } = useForm({
  initialValues: {
    name: "",
    description: "",
    lat: CENTER_POLAND.lat,
    lng: CENTER_POLAND.lng,
  },
  validationSchema: toTypedSchema(insertLocationSchema),
});

onMounted(() => {
  mapStore.addedPoint = {
    id: 1,
    name: "",
    description: "",
    lat: CENTER_POLAND.lat,
    lng: CENTER_POLAND.lng,
  };
});

const onSubmit = handleSubmit(async (values) => {
  if (loading.value)
    return;

  submitError.value = ""; // Reset error message before submission
  try {
    loading.value = true;
    await $csrfFetch("/api/locations", {
      method: "post",
      body: values,
    });

    submited.value = true;
    navigateTo("/dashboard");
  }
  catch (e) {
    const error = e as FetchError;
    if (error.data.data)
      setErrors(error.data.data || {});
    submitError.value = error.data.statusMessage || error.statusMessage || "An error occurred while adding the location.";
  }
  finally {
    loading.value = false;
  }
});

effect(() => {
  if (mapStore.addedPoint) {
    setFieldValue("lat", mapStore.addedPoint.lat);
    setFieldValue("lng", mapStore.addedPoint.lng);
  }
});

const router = useRouter();

onBeforeRouteLeave(() => {
  if (meta.value.dirty && !submited.value) {
    // eslint-disable-next-line no-alert
    const confirm = window.confirm("You have unsaved changes. Are you sure you want to leave?");
    if (!confirm) {
      return false;
    }
  }
  return true;
});

onUnmounted(() => {
  mapStore.addedPoint = null;
});

function formatValue(value?: number) {
  if (!value)
    return 0;
  return value.toFixed(5);
}
</script>

<template>
  <div class="container max-w-md mx-auto p-4">
    <div class="my-4">
      <h1 class="text-lg">
        Add location
      </h1>
      <p class="text-sm">
        A location is a place you have traveled or will travel to. It can be a city, country, state or point of interest. You can add specific times you visited this location after adding it.
      </p>
    </div>
    <div
      v-if="submitError"
      role="alert"
      class="alert alert-error"
    >
      <span>{{ submitError }}</span>
    </div>
    <form class="flex flex-col gap-2" @submit.prevent="onSubmit">
      <app-form-field
        label="Name"
        name="name"
        type="text"
        :disabled="loading"
        :error="errors.name"
      />
      <app-form-field
        label="Description"
        name="description"
        type="text"
        as="textarea"
        :disabled="loading"
        :error="errors.description"
      />
      <p>
        Drag the marker <Icon
          name="tabler:map-pin-filled"
          class="text-warning"
          size="14"
        /> to your desired location. Or double click on the map.
      </p>
      <p class="text-xs text-gray-400">
        Current location: {{ formatValue(controlledValues.lat) }} {{ formatValue(controlledValues.lng) }}
      </p>

      <div class="flex justify-end gap-2">
        <button
          type="button"
          class="btn btn-outline"
          :disabled="loading"
          @click="router.back()"
        >
          <Icon name="tabler:arrow-left" size="24" />
          Cancel
        </button>
        <button
          type="submit"
          class="btn btn-primary"
          :disabled="loading"
        >
          Add
          <span v-if="loading" class="loading loading-dots loading-sm" />
          <Icon
            v-else
            name="tabler:circle-plus-filled"
            size="24"
          />
        </button>
      </div>
    </form>
  </div>
</template>
