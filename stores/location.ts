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
        label: location.name,
        icon: "tabler:map-pin",
        href: `#`,
      }));

      mapStore.mapPoints = data.value.map(location => ({
        id: location.id,
        label: location.name,
        lat: location.lat,
        lng: location.lng,
      }));
    }

    sidebarStore.loading = status.value === "pending";
  });

  return { locations: data, status, refresh };
});
