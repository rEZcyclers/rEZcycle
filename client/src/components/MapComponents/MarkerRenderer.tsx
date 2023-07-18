import { ReactElement } from "react";
import { LocationInfo } from "../../DataTypes";
import { Marker } from "react-map-gl";
import BuildIcon from "@mui/icons-material/Build";
import RecyclingIcon from "@mui/icons-material/Recycling";
import WhereToVoteOutlinedIcon from "@mui/icons-material/WhereToVoteOutlined";
import { Typography } from "@mui/material";

interface MarkerParams {
  itemMarkersToShow: boolean[];
  closestLocList: (LocationInfo | null)[];
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
          const closestLoc: LocationInfo | null = closestLocList[i];
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
                    <div style={{ position: "relative" }}>
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
                      <Typography
                        sx={{
                          color: "black",
                          position: "absolute",
                          left: "50%", // Center the text horizontally
                          transform: "translateX(-50%)", // Center the text horizontally
                          backgroundColor: "white",
                          borderRadius: 3,
                          padding: 1,
                          fontSize: 11,
                          fontWeight: "bold",
                        }}
                      >
                        {closestLoc["item"]}
                      </Typography>
                    </div>
                  ) : itemType === 1 ? (
                    <div style={{ position: "relative" }}>
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
                      <Typography
                        sx={{
                          color: "black",
                          position: "absolute",
                          left: "50%", // Center the text horizontally
                          transform: "translateX(-50%)", // Center the text horizontally
                          backgroundColor: "white",
                          borderRadius: 3,
                          padding: 1,
                          fontSize: 11,
                          fontWeight: "bold",
                        }}
                      >
                        {closestLoc["item"]}
                      </Typography>
                    </div>
                  ) : itemType === 2 ? (
                    <div style={{ position: "relative" }}>
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
                      <Typography
                        sx={{
                          color: "black",
                          position: "absolute",
                          left: "50%", // Center the text horizontally
                          transform: "translateX(-50%)", // Center the text horizontally
                          backgroundColor: "white",
                          borderRadius: 3,
                          padding: 1,
                          fontSize: 11,
                          fontWeight: "bold",
                        }}
                      >
                        {closestLoc["item"]}
                      </Typography>
                    </div>
                  ) : itemType === 3 ? (
                    <div style={{ position: "relative" }}>
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
                      <Typography
                        sx={{
                          color: "black",
                          position: "absolute",
                          left: "50%", // Center the text horizontally
                          transform: "translateX(-50%)", // Center the text horizontally
                          backgroundColor: "white",
                          borderRadius: 3,
                          padding: 1,
                          fontSize: 11,
                          fontWeight: "bold",
                        }}
                      >
                        {closestLoc["item"]}
                      </Typography>
                    </div>
                  ) : (
                    <div style={{ position: "relative" }}>
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
                      <Typography
                        sx={{
                          color: "black",
                          position: "absolute",
                          left: "50%", // Center the text horizontally
                          transform: "translateX(-50%)", // Center the text horizontally
                          backgroundColor: "white",
                          borderRadius: 3,
                          padding: 1,
                          fontSize: 11,
                          fontWeight: "bold",
                        }}
                      >
                        {closestLoc["item"]}
                      </Typography>
                    </div>
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
