import { ReactNode, useState } from "react";
import { LocationInfo } from "../../DataTypes";
import { Marker } from "react-map-gl";

interface MarkerParams {
  itemMarkersToShow: boolean[];
  closestLocList: LocationInfo[];
  allLocations: LocationInfo[][];
  markerColor: string;
  markerStyle: ReactNode | null;
  showClosest: boolean;
  setActiveMarker: (loc: LocationInfo) => void;
}

export default function MarkerRenderer({
  itemMarkersToShow,
  closestLocList,
  allLocations,
  markerColor,
  markerStyle,
  showClosest,
  setActiveMarker,
}: MarkerParams) {
  return (
    <>
      {showClosest &&
        itemMarkersToShow.map((sel, i) => {
          sel; // Prevent unused declaration
          const closestLoc: LocationInfo = closestLocList[i];
          return (
            <Marker
              latitude={closestLoc.lat}
              longitude={closestLoc.lng}
              color={markerColor}
              onClick={() => setActiveMarker(closestLoc)}
            >
              {markerStyle != null && markerStyle}
            </Marker>
          );
        })}
      {itemMarkersToShow
        .map((sel, i) => (sel ? i : -1))
        .filter((i) => i != -1)
        .map((i) => {
          const locations: LocationInfo[] = allLocations[i];
          return (
            <>
              {locations.map((location: LocationInfo) => {
                return (
                  <Marker
                    latitude={location.lat}
                    longitude={location.lng}
                    color={markerColor}
                    onClick={() => setActiveMarker(location)}
                  >
                    {markerStyle != null && markerStyle}
                  </Marker>
                );
              })}
            </>
          );
        })}
    </>
  );
}
