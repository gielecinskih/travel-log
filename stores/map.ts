import type { LngLatBounds } from "maplibre-gl";

import type { MapPoint } from "~/lib/types";

export const useMapStore = defineStore("map", () => {
  const mapPoints = ref<MapPoint[]>([]);

  const selectedPoint = ref<MapPoint | null>(null);
  const shouldFlyTo = ref(true);

  const selectPointWithoutFlyTo = (point: MapPoint | null) => {
    shouldFlyTo.value = false;
    selectedPoint.value = point;
  };

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

    effect(() => {
      if (selectedPoint.value) {
        if (shouldFlyTo.value) {
          mapOne.map?.flyTo({
            center: [selectedPoint.value.lng, selectedPoint.value.lat],
            essential: true,
            speed: 0.8,
          });
        }
        shouldFlyTo.value = true;
      }
      else if (bounds) {
        mapOne.map?.fitBounds(bounds, {
          padding: 60,
          essential: true,
          speed: 0.8,
        });
      }
    });
  }

  return { mapPoints, selectedPoint, initMap, selectPointWithoutFlyTo };
});
