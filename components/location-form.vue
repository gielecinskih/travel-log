<script lang="ts" setup>
import { CENTER_POLAND } from "~/lib/constants";
import { InsertLocation } from "~/lib/db/schema";

const props = defineProps<{
  initialValues?: InsertLocation;
  onSubmit: (location: InsertLocation) => Promise<any>;
  onSubmitComplete: () => void;
  submitLabel: string;
  submitIcon: string;
  zoom?: number;
}>();
</script>

<template>
  <location-base-form
    v-slot="{ errors, loading }"
    :zoom="props.zoom || 6"
    :schema="InsertLocation"
    :initial-values="props.initialValues || {
      name: '',
      description: '',
      lng: CENTER_POLAND.lng,
      lat: CENTER_POLAND.lat,
    }"
    :on-submit
    :on-submit-complete
    :submit-label
    :submit-icon
  >
    <app-form-field
      name="name"
      label="Name"
      :error="errors.name"
      :disabled="loading"
    />
    <app-form-field
      name="description"
      label="Description"
      as="textarea"
      :error="errors.description"
      :disabled="loading"
    />
  </location-base-form>
</template>
