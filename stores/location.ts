import type { SelectLocationLogWithImages, SelectLocationWithLogs } from "~/lib/db/schema";
import type { MapPoint } from "~/lib/types";

import { CURRENT_LOCATION_PAGES, LOCATION_PAGES } from "~/lib/constants";

export const useLocationStore = defineStore("location", () => {
  const route = useRoute();

  const { data: locations, status: locationsStatus, refresh: refreshLocations } = useFetch("/api/locations", {
    lazy: true,
  });

  const sidebarStore = useSidebarStore();
  const mapStore = useMapStore();

  const locationUrlWithSlug = computed(() => {
    return `/api/locations/${route.params.slug}`;
  });
  const locationLogUrlWithSlugAndId = computed(() => `/api/locations/${route.params.slug}/${route.params.id}`);

  const { data: currentLocation, status: currentLocationStatus, error: currentLocationError, refresh: refreshCurrentLocation }
    = useFetch<SelectLocationWithLogs>(locationUrlWithSlug, { lazy: true, immediate: false, watch: false });

  const {
    data: currentLocationLog,
    status: currentLocationLogStatus,
    error: currentLocationLogError,
    refresh: refreshCurrentLocationLog,
  } = useFetch<SelectLocationLogWithImages>(locationLogUrlWithSlugAndId, {
    lazy: true,
    immediate: false,
    watch: false,
  });

  effect(() => {
    if (locations.value && LOCATION_PAGES.has(route.name?.toString() || "")) {
      const mapPoints: MapPoint[] = [];
      const sidebarItems: SidebarItem[] = [];

      locations.value.forEach((location) => {
        const mapPoint = (createMapPointFromLocation(location));
        sidebarItems.push({
          id: `location-${location.id}`,
          label: location.name,
          icon: "tabler:map-pin",
          to: { name: "dashboard-location-slug", params: { slug: location.slug } },
          mapPoint,
        });
        mapPoints.push(mapPoint);
      });

      sidebarStore.sidebarItems = sidebarItems;
      mapStore.mapPoints = mapPoints;
    }
    else if (currentLocation.value && CURRENT_LOCATION_PAGES.has(route.name?.toString() || "")) {
      sidebarStore.sidebarItems = [];
      mapStore.mapPoints = [currentLocation.value];
    }

    sidebarStore.loading = locationsStatus.value === "pending";
  });

  return { locations, locationsStatus, refreshLocations, currentLocation, currentLocationStatus, currentLocationError, refreshCurrentLocation, currentLocationLog, currentLocationLogStatus, currentLocationLogError, refreshCurrentLocationLog };
});
