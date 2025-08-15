<script setup lang="ts">
const sidebarStore = useSidebarStore();
const locationStore = useLocationStore();
const mapStore = useMapStore();
const route = useRoute();
const isSideBarOpen = ref(true);

const { currentLocation } = storeToRefs(locationStore);

function toggleSidebar() {
  isSideBarOpen.value = !isSideBarOpen.value;
  localStorage.setItem("sidebarOpen", isSideBarOpen.value.toString());
}

onMounted(() => {
  isSideBarOpen.value = localStorage.getItem("sidebarOpen") !== "false";
  if (route.path !== "/dashboard") {
    locationStore.refreshLocations();
  }
});

effect(() => {
  if (route.name === "dashboard") {
    sidebarStore.sidebarTopItems = [
      {
        id: "link-dashboard",
        name: "Locations",
        icon: "tabler:map",
        href: "/dashboard",
      },
      {
        id: "link-dashboard-add",
        name: "Add",
        icon: "tabler:circle-plus-filled",
        to: "/dashboard/add",
      },
    ];
  }
  if (route.name === "dashboard-location-slug") {
    sidebarStore.sidebarTopItems = [
      {
        id: "link-dashboard",
        name: "Back to locations",
        icon: "tabler:arrow-left",
        href: "/dashboard",
      },
      {
        id: "link-dashboard-add-log",
        name: currentLocation.value ? currentLocation.value.name : "View logs",
        icon: "tabler:map",
        to: {
          name: "dashboard-location-slug",
          params: {
            slug: currentLocation.value?.slug,
          },
        },
      },
      {
        id: "link-dashboard-slug-edit",
        name: "Edit location",
        icon: "tabler:map-pin-cog",
        to: {
          name: "dashboard-location-slug-edit",
          params: {
            slug: currentLocation.value?.slug,
          },
        },
      },
      {
        id: "link-dashboard-slug-add",
        name: "Add location log",
        icon: "tabler:circle-plus-filled",
        to: {
          name: "dashboard-location-slug-add",
          params: {
            slug: currentLocation.value?.slug,
          },
        },
      },
    ];
  }
});
</script>

<template>
  <div class="flex-1 flex">
    <div class="bg-base-100 w-16 transition-all duration-300 shrink-0" :class="{ 'w-64': isSideBarOpen }">
      <div
        class="flex justify-end cursor-pointer hover:bg-base-200 p-2"
        :class="{ '!justify-center': !isSideBarOpen }"
        @click="toggleSidebar"
      >
        <Icon
          v-if="isSideBarOpen"
          name="tabler:chevron-left"
          size="32"
        />
        <Icon
          v-else
          name="tabler:chevron-right"
          size="32"
        />
      </div>
      <div class="flex flex-col ">
        <sidebar-button
          v-for="item in sidebarStore.sidebarTopItems"
          :key="item.id"
          :icon="item.icon"
          :label="item.name"
          :href="item.href"
          :to="item.to"
          :show-label="isSideBarOpen"
        />
        <div class="divider" />
        <div v-if="sidebarStore.loading" class="px-4">
          <div class="skeleton h-4 w-full" />
        </div>
        <div v-else-if="sidebarStore.sidebarItems.length" class="flex flex-col">
          <sidebar-button
            v-for="item in sidebarStore.sidebarItems"
            :key="item.id"
            :label="item.name"
            :icon="item.icon"
            :href="item.href"
            :to="item.to"
            :show-label="isSideBarOpen"
            :icon-color="isPointSelected(item.mapPoint, mapStore.selectedPoint) ? 'text-accent' : ''"
            @mouseenter="mapStore.selectedPoint = item.mapPoint ?? null"
            @mouseleave="mapStore.selectedPoint = null"
          />
        </div>
        <div v-if="sidebarStore.loading || sidebarStore.sidebarItems.length" class="divider" />
        <sidebar-button
          icon="tabler:logout-2"
          label="Sign Out"
          href="/sign-out"
          :show-label="isSideBarOpen"
        />
      </div>
    </div>
    <div class="flex-1 overflow-auto bg-base-200">
      <div class="flex size-full " :class="{ 'flex-col': route.path !== '/dashboard/add' }">
        <nuxt-page />
        <app-map />
      </div>
    </div>
  </div>
</template>
