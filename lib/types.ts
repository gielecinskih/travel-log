import type { UserWithId } from "./auth";

declare module "h3" {
  // eslint-disable-next-line ts/consistent-type-definitions
  interface H3EventContext {
    user?: UserWithId;
  }
}

export type LatLngItem = {
  lat: number;
  lng: number;
};

export type MapPoint = {
  id: number;
  label: string;
} & LatLngItem;
