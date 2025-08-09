import type { LngLatBounds } from "maplibre-gl";

import type { MapPoint } from "~/lib/types";

export const useMapStore = defineStore("map", () => {
  const mapPoints = ref<MapPoint[]>([]);

  const selectedPoint = ref<MapPoint | null>(null);
  const addedPoint = ref<MapPoint | null>(null);

  async function initMap() {
    const { useMap } = await import("@indoorequal/vue-maplibre-gl");
    const { LngLatBounds } = await import("maplibre-gl");

    const mapOne = useMap();

    let bounds: LngLatBounds | null = null;

    effect(() => {
      bounds = mapPoints.value.reduce((bounds, point) => {
        return bounds.extend([point.lng, point.lat]);
      }, new LngLatBounds());

      mapOne.map?.fitBounds(bounds, {
        padding: 60,
      });
    });

    watch(addedPoint, (newValue, oldValue) => {
      if (newValue && !oldValue) {
        mapOne.map?.flyTo({
          center: {
            lng: newValue.lng,
            lat: newValue.lat,
          },
          zoom: 4,
          essential: true,
        });
      }
    }, { immediate: true });
  }

  return { mapPoints, selectedPoint, addedPoint, initMap };
});
