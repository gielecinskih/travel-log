<script setup lang="ts">
const { label, name, type = "text", as = "input", error } = defineProps<{
  label: string;
  name: string;
  type?: "text" | "number";
  as?: "input" | "textarea";
  error?: string;
  disabled?: boolean;
}>();
</script>

<template>
  <fieldset class="fieldset">
    <legend class="fieldset-legend">
      {{ label }}
    </legend>
    <Field
      :name="name"
      :as="as"
      :type="type"
      :disabled
      class="input w-full"
      :class="{ 'input-error': error, [as]: true }"
    />
    <p v-if="error" class="label text-error">
      {{ error }}
    </p>
  </fieldset>
</template>
