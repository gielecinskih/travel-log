import type { MapPoint } from "~/lib/types";

export const useMapStore = defineStore("map", () => {
  const mapPoints = ref<MapPoint[]>([]);

  async function initMap() {
    const { useMap } = await import("@indoorequal/vue-maplibre-gl");
    const { LngLatBounds } = await import("maplibre-gl");

    const mapOne = useMap();

    effect(() => {
      const bounds = mapPoints.value.reduce((bounds, point) => {
        return bounds.extend([point.lng, point.lat]);
      }, new LngLatBounds());

      mapOne.map?.fitBounds(bounds, {
        padding: 60,
      });
    });
  }

  return { mapPoints, initMap };
});
