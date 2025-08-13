<script setup lang="ts">
import type { FetchError } from "ofetch";

import type { NominatimResult } from "~/lib/types";

import { SearchSchema } from "~/lib/zod-schemas";

const emit = defineEmits<{
  resultSelected: [result: NominatimResult];
}>();

const searchResults = ref<NominatimResult[]>([]);
const form = useTemplateRef("form");
const hasSearched = ref(false);

const errorMessage = ref("");
const loading = ref(false);
async function onSubmit(query: Record<string, string>) {
  try {
    searchResults.value = [];
    hasSearched.value = false;
    errorMessage.value = "";
    loading.value = true;
    const results = await $fetch("/api/search", {
      query,
    });

    hasSearched.value = true;
    searchResults.value = results;
  }
  catch (e) {
    const error = e as FetchError;
    errorMessage.value = getFetchErrorMessage(error);
  }
  finally {
    loading.value = false;
  }
}

function setLocation(result: NominatimResult) {
  emit("resultSelected", result);

  if (form.value) {
    form.value.resetForm();
    searchResults.value = [];
    hasSearched.value = false;
    errorMessage.value = "";
  }
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <Form
      ref="form"
      v-slot="{ errors }"
      class="flex flex-col gap-2 items-center"
      :validation-schema="toTypedSchema(SearchSchema)"
      :initial-values="{ q: '' }"
      @submit="onSubmit"
    >
      <div class="join  mt-4">
        <div>
          <label class="input validator join-item">
            <Icon name="tabler:search" size="24" />
            <Field
              as="input"
              name="q"
              type="text"
              :disabled="loading"
              placeholder="Search for a location..."
              :class="{ 'input-error': errors.q }"
            />
          </label>
          <div v-if="errors.q" class="validator-hint text-error visible">
            {{ errors.q }}
          </div>
        </div>
        <button class="btn btn-neutral join-item" :disabled="loading">
          Search
        </button>
      </div>
    </Form>
    <div
      v-if="errorMessage"
      role="alert"
      class="alert alert-error"
    >
      <span>{{ errorMessage }}</span>
    </div>
    <div
      v-if="hasSearched && !searchResults.length && !loading"
      role="alert"
      class="alert alert-warning"
    >
      <span>No results found</span>
    </div>
    <div v-if="loading" class="flex justify-center">
      <div class="loading loading-lg" />
    </div>
    <div class="flex flex-col gap-4 overflow-auto max-h-72">
      <div
        v-for="result in searchResults"
        :key="result.place_id"
        class="card card-sm bg-base-100"
      >
        <div class="card-body">
          <h4 class="card-title">
            {{ result.display_name }}
          </h4>
          <div class="justify-end card-actions">
            <button class="btn btn-warning btn-sm" @click="setLocation(result)">
              Set location
              <Icon name="tabler:map-pin-share" size="20" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
