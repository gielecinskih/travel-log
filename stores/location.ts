export const useLocationStore = defineStore("location", () => {
  const { data, status, refresh } = useFetch("/api/locations", {
    lazy: true,
  });

  const sidebarStore = useSidebarStore();
  const mapStore = useMapStore();

  effect(() => {
    if (data.value) {
      sidebarStore.sidebarItems = data.value.map(location => ({
        id: `location-${location.id}`,
        name: location.name,
        icon: "tabler:map-pin",
        href: `#`,
        location,
      }));

      mapStore.mapPoints = data.value;
    }

    sidebarStore.loading = status.value === "pending";
  });

  return { locations: data, status, refresh };
});
