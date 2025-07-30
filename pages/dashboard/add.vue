<script setup lang="ts">
import type { FetchError } from "ofetch";

import { toTypedSchema } from "@vee-validate/zod";

import { insertLocationSchema } from "~/lib/db/schema";

const { $csrfFetch } = useNuxtApp();

const loading = ref(false);
const submited = ref(false);

const submitError = ref("");
const { handleSubmit, errors, meta, setErrors } = useForm({
  validationSchema: toTypedSchema(insertLocationSchema),
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
    submitError.value = error.statusMessage || "An error occurred while adding the location.";
  }
  finally {
    loading.value = false;
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
    <div v-if="submitError" role="alert" class="alert alert-error">
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
      <app-form-field
        label="Latitude"
        name="lat"
        type="number"
        :disabled="loading"
        :error="errors.lat"
      />
      <app-form-field
        label="Longitude"
        name="lng"
        type="number"
        :disabled="loading"
        :error="errors.lng"
      />

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
        <button type="submit" class="btn btn-primary" :disabled="loading">
          Add
          <span v-if="loading" class="loading loading-dots loading-sm" />
          <Icon v-else name="tabler:circle-plus-filled" size="24" />
        </button>
      </div>
    </form>
  </div>
</template>
