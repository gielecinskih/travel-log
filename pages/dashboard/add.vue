<script setup lang="ts">
import { toTypedSchema } from "@vee-validate/zod";

import { insertLocationSchema } from "~/lib/db/schema";

const { handleSubmit, errors, meta } = useForm({
  validationSchema: toTypedSchema(insertLocationSchema),
});

const onSubmit = handleSubmit(async (values) => {
  // eslint-disable-next-line no-console
  console.log(values);
});

const router = useRouter();

onBeforeRouteLeave(() => {
  if (meta.value.dirty) {
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
    <form class="flex flex-col gap-2" @submit.prevent="onSubmit">
      <app-form-field
        label="Name"
        name="name"
        type="text"
        :error="errors.name"
      />
      <app-form-field
        label="Description"
        name="description"
        type="text"
        as="textarea"
        :error="errors.description"
      />
      <app-form-field
        label="Latitude"
        name="lat"
        type="number"
        :error="errors.lat"
      />
      <app-form-field
        label="Longitude"
        name="lng"
        type="number"
        :error="errors.lng"
      />

      <div class="flex justify-end gap-2">
        <button type="button" class="btn btn-outline" @click="router.back()">
          <Icon name="tabler:arrow-left" size="24" />
          Cancel
        </button>
        <button type="submit" class="btn btn-primary">
          Add
          <Icon name="tabler:circle-plus-filled" size="24" />
        </button>
      </div>
    </form>
  </div>
</template>
