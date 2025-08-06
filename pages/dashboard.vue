<script setup lang="ts">
const sidebarStore = useSidebarStore();
const locationStore = useLocationStore();
const route = useRoute();
const isSideBarOpen = ref(true);

function toggleSidebar() {
  isSideBarOpen.value = !isSideBarOpen.value;
  localStorage.setItem("sidebarOpen", isSideBarOpen.value.toString());
}

onMounted(() => {
  isSideBarOpen.value = localStorage.getItem("sidebarOpen") !== "false";
  if (route.path !== "/dashboard") {
    locationStore.refresh();
  }
});
</script>

<template>
  <div class="flex-1 flex">
    <div class="bg-base-100 w-16 transition-all duration-300" :class="{ 'w-64': isSideBarOpen }">
      <div class="flex justify-end cursor-pointer hover:bg-base-200 p-2" :class="{ '!justify-center': !isSideBarOpen }" @click="toggleSidebar">
        <Icon v-if="isSideBarOpen" name="tabler:chevron-left" size="32" />
        <Icon v-else name="tabler:chevron-right" size="32" />
      </div>
      <div class="flex flex-col ">
        <sidebar-button
          icon="tabler:map"
          label="Locations"
          href="/dashboard"
          :show-label="isSideBarOpen"
        />
        <sidebar-button
          icon="tabler:circle-plus-filled"
          label="Add location"
          href="/dashboard/add"
          :show-label="isSideBarOpen"
        />
        <div class="divider" />
        <div v-if="sidebarStore.loading" class="px-4">
          <div class="skeleton h-4 w-full" />
        </div>
        <template v-else-if="sidebarStore.sidebarItems.length">
          <sidebar-button
            v-for="item in sidebarStore.sidebarItems"
            :key="item.id"
            :label="item.label"
            :icon="item.icon"
            :href="item.href"
            :show-label="isSideBarOpen"
          />
        </template>
        <div v-if="sidebarStore.loading || sidebarStore.sidebarItems.length" class="divider" />
        <sidebar-button
          icon="tabler:logout-2"
          label="Sign Out"
          href="/sign-out"
          :show-label="isSideBarOpen"
        />
      </div>
    </div>
    <div class="flex-1 ">
      <nuxt-page />
    </div>
  </div>
</template>
