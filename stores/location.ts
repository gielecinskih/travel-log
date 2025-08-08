export const useLocationStore = defineStore("location", () => {
  const { data, status, refresh } = useFetch("/api/locations", {
    lazy: true,
    immediate: false,
  });

  const sidebarStore = useSidebarStore();

  watchEffect(() => {
    if (data.value) {
      sidebarStore.sidebarItems = data.value.map(location => ({
        id: `location-${location.id}`,
        label: location.name,
        icon: "tabler:map-pin",
        href: `#`,
      }));
    }

    sidebarStore.loading = status.value === "pending";
  });

  return { locations: data, status, refresh };
});
