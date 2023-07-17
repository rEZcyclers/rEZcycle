import { ReactElement } from "react";
import { LocationInfo } from "../../DataTypes";
import { Marker } from "react-map-gl";
import BuildIcon from "@mui/icons-material/Build";
import RecyclingIcon from "@mui/icons-material/Recycling";
import WhereToVoteOutlinedIcon from "@mui/icons-material/WhereToVoteOutlined";

interface MarkerParams {
  itemMarkersToShow: boolean[];
  closestLocList: LocationInfo[];
  allLocations: LocationInfo[][];
  markerColor: string;
  markerStyle: ReactElement | null;
  showClosest: boolean;
  setActiveMarker: (loc: LocationInfo) => void;
  itemType: number; // 0: GD, 1: RD, 2: GE, 3: RE, 4: EE
}

export default function MarkerRenderer({
  itemMarkersToShow,
  closestLocList,
  allLocations,
  markerColor,
  markerStyle,
  showClosest,
  setActiveMarker,
  itemType,
}: MarkerParams) {
  return (
    <>
      {showClosest &&
        itemMarkersToShow.map((sel, i) => {
          sel; // Prevent unused declaration
          const closestLoc: LocationInfo = closestLocList[i];
          return (
            closestLoc != null && (
              <Marker
                latitude={closestLoc.lat}
                longitude={closestLoc.lng}
                color={markerColor}
                onClick={() => setActiveMarker(closestLoc)}
              >
                {markerStyle != null &&
                  (itemType === 0 ? (
                    <WhereToVoteOutlinedIcon
                      sx={{
                        backgroundColor: markerColor,
                        color: "white",
                        border: "3px solid green",
                        width: 27,
                        height: 27,
                        borderRadius: 14,
                      }}
                    />
                  ) : itemType === 1 ? (
                    <BuildIcon
                      sx={{
                        backgroundColor: markerColor,
                        color: "white",
                        border: "3px solid green",
                        width: 27,
                        height: 27,
                        borderRadius: 14,
                      }}
                    />
                  ) : itemType === 2 ? (
                    <WhereToVoteOutlinedIcon
                      sx={{
                        backgroundColor: markerColor,
                        color: "white",
                        border: "3px solid green",
                        width: 27,
                        height: 27,
                        borderRadius: 14,
                      }}
                    />
                  ) : itemType === 3 ? (
                    <BuildIcon
                      sx={{
                        backgroundColor: markerColor,
                        color: "white",
                        border: "3px solid green",
                        width: 27,
                        height: 27,
                        borderRadius: 14,
                      }}
                    />
                  ) : (
                    <RecyclingIcon
                      sx={{
                        backgroundColor: markerColor,
                        color: "white",
                        border: "3px solid green",
                        width: 27,
                        height: 27,
                        borderRadius: 14,
                      }}
                    />
                  ))}
              </Marker>
            )
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
