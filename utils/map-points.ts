import type { SelectLocation } from "~/lib/db/schema";
import type { MapPoint } from "~/lib/types";

export function createPointFromLocation(location: SelectLocation): MapPoint {
  return {
    ...location,
    to: { name: "dashboard-location-slug", params: { slug: location.slug } },
    toLabel: "View",
  };
}

export function isPointSelected(item: Pick<MapPoint, "id" | "lat" | "lng"> | null | undefined, selectedPoint?: MapPoint | null | undefined) {
  if (!item || !selectedPoint)
    return false;
  return item.id === selectedPoint.id && item.lat === selectedPoint.lat && item.lng === selectedPoint.lng;
}
