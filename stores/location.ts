import type { SelectLocationWithLogs } from "~/lib/db/schema";
import type { MapPoint } from "~/lib/types";

const listLocationsInSidebar = new Set(["dashboard", "dashboard-add"]);
const listCurrentLocationsInSidebar = new Set(["dashboard-location-slug", "dashboard-location-slug-edit", "dashboard-location-slug-add"]);

export const useLocationStore = defineStore("location", () => {
  const route = useRoute();

  const { data: locations, status: locationsStatus, refresh: refreshLocations } = useFetch("/api/locations", {
    lazy: true,
  });

  const sidebarStore = useSidebarStore();
  const mapStore = useMapStore();

  const locationUrlWithSlug = computed(() => {
    return `/api/location/${route.params.slug}`;
  });
  const { data: currentLocation, status: currentLocationStatus, error: currentLocationError, refresh: refreshCurrentLocation }
    = useFetch<SelectLocationWithLogs>(locationUrlWithSlug, { lazy: true, immediate: false, watch: false });

  effect(() => {
    if (locations.value && listLocationsInSidebar.has(route.name?.toString() || "")) {
      const mapPoints: MapPoint[] = [];
      const sidebarItems: SidebarItem[] = [];

      locations.value.forEach((location) => {
        const mapPoint = (createPointFromLocation(location));
        sidebarItems.push({
          id: `location-${location.id}`,
          name: location.name,
          icon: "tabler:map-pin",
          to: { name: "dashboard-location-slug", params: { slug: location.slug } },
          mapPoint,
        });
        mapPoints.push(mapPoint);
      });

      sidebarStore.sidebarItems = sidebarItems;
      mapStore.mapPoints = mapPoints;
    }
    else if (currentLocation.value && listCurrentLocationsInSidebar.has(route.name?.toString() || "")) {
      sidebarStore.sidebarItems = [];
      mapStore.mapPoints = [currentLocation.value];
    }

    sidebarStore.loading = locationsStatus.value === "pending";
  });

  return { locations, locationsStatus, refreshLocations, currentLocation, currentLocationStatus, currentLocationError, refreshCurrentLocation };
});
