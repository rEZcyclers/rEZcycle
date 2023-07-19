// import { useState } from "react";
// import Map, { Marker, Popup } from "react-map-gl";
// import {
//   DonateLocation,
//   RepairLocation,
//   DonateOrganisationLocations,
//   EbinLocations,
//   EbinLocation,
//   Ebin,
//   Bluebin,
// } from "../DataTypes";
// import BuildIcon from "@mui/icons-material/Build";
// import RecyclingIcon from "@mui/icons-material/Recycling";
// import GeocoderControl from "./MapComponents/GeocoderControl";

// interface Props {
//   showBluebin: boolean;
//   showGDPins: boolean[][];
//   showRDPins: boolean[][];
//   showGEPins: boolean[][];
//   showREPins: boolean[][];
//   showEwastePins: boolean[][];

//   setShowBluebin: (showBluebin: boolean) => void;
//   setShowGDPins: (showGDPins: boolean[][]) => void;
//   setShowRDPins: (showRDPins: boolean[][]) => void;
//   setShowGEPins: (showGEPins: boolean[][]) => void;
//   setShowREPins: (showREPins: boolean[][]) => void;
//   setShowEwastePins: (showEwastePins: boolean[][]) => void;

//   bluebinsData: Bluebin[];
//   goodDonatablesResults: DonateOrganisationLocations[][]; // List of donateOrganisations & their locations for every selected good donatable
//   repairDonatablesResults: RepairLocation[][]; // List of repairLocations for every selected repairable donatable
//   goodEwasteResults: DonateOrganisationLocations[][]; // List of donateLocations & their locations for every selected good Ewaste
//   repairEwasteResults: RepairLocation[][]; // List of repairLocations for every selected repairable Ewaste
//   ebinEwasteResults: EbinLocations[][];
// }

// const recyclableColor = "#00FF00";
// const donatableColor = "#FC2BA1";
// const ewasteColor = "#FFC300";

// const MAPBOX_TOKEN =
//   "pk.eyJ1IjoiaWFuNDQ0NCIsImEiOiJjbGhpeTVrMjcwY253M2RwNThlY2wzMWJ6In0.f3cyuNBJ5dmOBt-JTI6iCw";

// type LocationInfo = {
//   locationType: string;
//   name: string;
//   address: string;
//   contact: string;
//   lat: number;
//   lng: number;
// };

// // HEADER 1 START: Functions that identify locations that are nearest to the user
// // Function to calculate the distance between two coordinates using the Haversine formula
// function calculateDistance(
//   lat1: number,
//   lon1: number,
//   lat2: number,
//   lon2: number
// ): number {
//   const earthRadius = 6371; // Earth's radius in kilometers

//   const dLat = toRadians(lat2 - lat1);
//   const dLon = toRadians(lon2 - lon1);

//   const a =
//     Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//     Math.cos(toRadians(lat1)) *
//       Math.cos(toRadians(lat2)) *
//       Math.sin(dLon / 2) *
//       Math.sin(dLon / 2);
//   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

//   const distance = earthRadius * c;
//   return distance;
// }

// // Helper function to convert degrees to radians
// function toRadians(degrees: number): number {
//   return degrees * (Math.PI / 180);
// }

// // Function to find the location of the blue bin that is closest to the current location\
// // returns a LocationInfo object AND its index in the locationList
// function findNearestLocation(
//   currentLat: number,
//   currentLon: number,
//   locationList: LocationInfo[]
// ): { nearestLocationInfo: LocationInfo; nearestLocationIndex: number } {
//   let nearestDistance = Infinity;
//   let nearestLocationInfo: LocationInfo = locationList[0];

//   let nearestLocationIndex = 0;
//   for (let i = 0; i < locationList.length; i++) {
//     const distance = calculateDistance(
//       currentLat,
//       currentLon,
//       locationList[i].lat,
//       locationList[i].lng
//     );
//     if (distance < nearestDistance) {
//       nearestDistance = distance;
//       nearestLocationInfo = locationList[i];
//       nearestLocationIndex = i;
//     }
//   }

//   return {
//     nearestLocationInfo: nearestLocationInfo,
//     nearestLocationIndex: nearestLocationIndex,
//   };
// }

// // HEADER 1 END: End of set of functions that identify locations that are nearest to the user

// function MapLocations({
//   showBluebin,
//   showGDPins,
//   showRDPins,
//   showGEPins,
//   showREPins,
//   showEwastePins,
//   setShowBluebin,
//   setShowGDPins,
//   setShowRDPins,
//   setShowGEPins,
//   setShowREPins,
//   setShowEwastePins,
//   bluebinsData,
//   goodDonatablesResults,
//   repairDonatablesResults,
//   goodEwasteResults,
//   repairEwasteResults,
//   ebinEwasteResults,
// }: Props) {
//   let bluebinLocations: LocationInfo[] = [];
//   let GDLocations: LocationInfo[][] = [];
//   let RDLocations: LocationInfo[][] = [];
//   let GELocations: LocationInfo[][] = [];
//   let RELocations: LocationInfo[][] = [];
//   let EELocations: LocationInfo[][] = [];

//   function getLocations() {
//     bluebinLocations = bluebinsData.map((bluebin: Bluebin) => {
//       const locationInfo: LocationInfo = {
//         locationType: "recycle",
//         name: "Blue Bin",
//         address: bluebin["address"],
//         contact: "No contact available",
//         lat: bluebin["latitude"],
//         lng: bluebin["longitude"],
//       };
//       return locationInfo;
//     });
//     GDLocations = goodDonatablesResults.map(
//       // For each selected good donatable item, create a list of LocationInfo
//       (item: DonateOrganisationLocations[]) => {
//         // For each organisation that accepts the selected good donatable item, transform it to a flat list of LocationInfo
//         return item.flatMap((organisation: DonateOrganisationLocations) => {
//           const locations: DonateLocation[] = organisation["donateLocations"];
//           return locations.map((location: DonateLocation) => {
//             const locationInfo: LocationInfo = {
//               locationType: "donate",
//               name: location["location_name"],
//               address: location["address"],
//               contact: location["contact"],
//               lat: location["latitude"],
//               lng: location["longitude"],
//             };
//             return locationInfo;
//           });
//         });
//       }
//     );
//     RDLocations = repairDonatablesResults.map(
//       // For each selected repairable donatable item, create a list of LocationInfo
//       (item: RepairLocation[]) => {
//         // For each repair location that accepts the selected repairable donatable item, transform it to data of type LocationInfo
//         return item.map((location: RepairLocation) => {
//           const locationInfo: LocationInfo = {
//             locationType: "repair",
//             name: location["center_name"],
//             address: location["stall_number"],
//             contact: "No contact available",
//             lat: location["latitude"],
//             lng: location["longitude"],
//           };
//           return locationInfo;
//         });
//       }
//     );
//     GELocations = goodEwasteResults.map(
//       // For each selected good donatable item, create a list of donateLocations
//       (item: DonateOrganisationLocations[]) => {
//         // For each organisation that accepts the selected good donatable item, transform it to a flat list of LocationInfo
//         return item.flatMap((organisation: DonateOrganisationLocations) => {
//           const locations: DonateLocation[] = organisation["donateLocations"];
//           return locations.map((location: DonateLocation) => {
//             const locationInfo: LocationInfo = {
//               locationType: "donate",
//               name: location["location_name"],
//               address: location["address"],
//               contact: location["contact"],
//               lat: location["latitude"],
//               lng: location["longitude"],
//             };
//             return locationInfo;
//           });
//         });
//       }
//     );
//     RELocations = repairEwasteResults.map(
//       // For each selected repairable donatable item, create a list of LocationInfo
//       (item: RepairLocation[]) => {
//         // For each repair location that accepts the selected repairable donatable item, transform it to data of type LocationInfo
//         return item.map((location: RepairLocation) => {
//           const locationInfo: LocationInfo = {
//             locationType: "repair",
//             name: location["center_name"],
//             address: location["stall_number"],
//             contact: "No contact available",
//             lat: location["latitude"],
//             lng: location["longitude"],
//           };
//           return locationInfo;
//         });
//       }
//     );
//     EELocations = ebinEwasteResults.map(
//       // For each selected ewaste item, create a list of LocationInfo
//       (item: EbinLocations[]) => {
//         // For each ebin type that accepts the selected eWaste item, transform it to a flat list of LocationInfo
//         return item.flatMap((ebinInfo: EbinLocations) => {
//           const ebin: Ebin = ebinInfo["ebin"];
//           const locations: EbinLocation[] = ebinInfo["ebinLocations"];
//           return locations.map((location: EbinLocation) => {
//             const locationInfo: LocationInfo = {
//               locationType: "ebin",
//               name: ebin["ebin_name"],
//               address: location["address"],
//               contact: "No contact available",
//               lat: location["latitude"],
//               lng: location["longitude"],
//             };
//             return locationInfo;
//           });
//         });
//       }
//     );
//   }

//   getLocations();

//   const [activeMarker, setActiveMarker] = useState<LocationInfo | null>(null);

//   const [userLocation, setUserLocation] = useState<number[]>([
//     1.3334437417296838, 103.81069629836223,
//   ]);

//   const [nearestBluebinLocation, setNearestBluebinLocation] =
//     useState<LocationInfo>();

//   // Arrays to store the Location Info of each nearest location
//   // const [nearestGDLocations, setNearestGDLocations] = useState<LocationInfo[]>(
//   //   Array<LocationInfo>(goodDonatablesResults.length)
//   // );
//   // const [nearestRDLocations, setNearestRDLocations] = useState<LocationInfo[]>(
//   //   Array<LocationInfo>(repairDonatablesResults.length)
//   // );
//   // const [nearestGELocations, setNearestGELocations] = useState<LocationInfo[]>(
//   //   Array<LocationInfo>(goodEwasteResults.length)
//   // );
//   // const [nearestRELocations, setNearestRELocations] = useState<LocationInfo[]>(
//   //   Array<LocationInfo>(repairEwasteResults.length)
//   // );
//   // const [nearestEELocations, setNearestEELocations] = useState<LocationInfo[]>(
//   //   Array<LocationInfo>(ebinEwasteResults.length)
//   // );

//   /*
//   dummy locationinfo
//   {
//     locationType: "dummy",
//     name: "dummy",
//     address: "dummy",
//     contact: "dummy",
//     lat: 1.33,
//     lng: 108,
//   } */

//   // Update the user's location and the recycling locations nearest to the user
//   function updateNearestLocations(newUserLocation: number[]) {
//     setUserLocation(newUserLocation);
//     console.log("current userLocation: ", userLocation);
//     // Update nearest bluebin
//     setNearestBluebinLocation(
//       findNearestLocation(
//         newUserLocation[0],
//         newUserLocation[1],
//         bluebinLocations
//       )["nearestLocationInfo"]
//     );
//     setShowBluebin(true);
//     // Update nearest DonateLocation for each good donatable item
//     for (let i = 0; i < goodDonatablesResults.length; i++) {
//       const nearestLocation = findNearestLocation(
//         newUserLocation[0],
//         newUserLocation[1],
//         GDLocations[i]
//       );
//       // No need to store Location Info. We can just conditionally render the nearestLocations
//       // using the showGDPins array.

//       // setNearestGDLocations([
//       //   ...nearestGDLocations.slice(0, i),
//       //   nearestLocation["nearestLocationInfo"],
//       //   ...nearestGDLocations.slice(i + 1),
//       // ]);

//       setShowGDPins([
//         ...showGDPins.slice(0, i),
//         [
//           ...showGDPins[i].slice(0, nearestLocation["nearestLocationIndex"]),
//           true,
//           ...showGDPins[i].slice(nearestLocation["nearestLocationIndex"] + 1),
//         ],
//         ...showGDPins.slice(i + 1),
//       ]);
//     }
//     // Update nearest RepairLocation for each repairable donatable item
//     for (let i = 0; i < repairDonatablesResults.length; i++) {
//       const nearestLocation = findNearestLocation(
//         newUserLocation[0],
//         newUserLocation[1],
//         RDLocations[i]
//       );
//       // setNearestRDLocations([
//       //   ...nearestRDLocations.slice(0, i),
//       //   nearestLocation["nearestLocationInfo"],
//       //   ...nearestRDLocations.slice(i + 1),
//       // ]);
//       setShowRDPins([
//         ...showRDPins.slice(0, i),
//         showRDPins[i].map((_show, j) =>
//           j === nearestLocation["nearestLocationIndex"] ? true : false
//         ),
//         ...showRDPins.slice(i + 1),
//       ]);
//     }
//     // Update nearest DonateLocation for each good ewaste item
//     for (let i = 0; i < goodEwasteResults.length; i++) {
//       const nearestLocation = findNearestLocation(
//         newUserLocation[0],
//         newUserLocation[1],
//         GELocations[i]
//       );
//       // setNearestGELocations([
//       //   ...nearestGELocations.slice(0, i),
//       //   nearestLocation["nearestLocationInfo"],
//       //   ...nearestGELocations.slice(i + 1),
//       // ]);
//       setShowGEPins([
//         ...showGEPins.slice(0, i),
//         showGEPins[i].map((_show, j) =>
//           j === nearestLocation["nearestLocationIndex"] ? true : false
//         ),
//         ...showGEPins.slice(i + 1),
//       ]);
//     }
//     // Update nearest repair Location for each repairable ewaste item
//     for (let i = 0; i < repairEwasteResults.length; i++) {
//       const nearestLocation = findNearestLocation(
//         newUserLocation[0],
//         newUserLocation[1],
//         RELocations[i]
//       );
//       // setNearestRELocations([
//       //   ...nearestRELocations.slice(0, i),
//       //   nearestLocation["nearestLocationInfo"],
//       //   ...nearestRELocations.slice(i + 1),
//       // ]);
//       setShowREPins([
//         ...showREPins.slice(0, i),
//         showREPins[i].map((_show, j) =>
//           j === nearestLocation["nearestLocationIndex"] ? true : false
//         ),
//         ...showREPins.slice(i + 1),
//       ]);
//     }
//     // Update nearest ebin Location for each ewaste item
//     for (let i = 0; i < ebinEwasteResults.length; i++) {
//       const nearestLocation = findNearestLocation(
//         newUserLocation[0],
//         newUserLocation[1],
//         EELocations[i]
//       );
//       // setNearestEELocations([
//       //   ...nearestEELocations.slice(0, i),
//       //   nearestLocation["nearestLocationInfo"],
//       //   ...nearestEELocations.slice(i + 1),
//       // ]);
//       setShowEwastePins([
//         ...showEwastePins.slice(0, i),
//         showEwastePins[i].map((_show, j) =>
//           j === nearestLocation["nearestLocationIndex"] ? true : false
//         ),
//         ...showEwastePins.slice(i + 1),
//       ]);
//     }
//   }

//   return (
//     <Map
//       initialViewState={{
//         latitude: 1.36,
//         longitude: 103.803,
//         zoom: 10.5,
//       }}
//       style={{ position: "relative", width: "90%", height: "60%" }}
//       mapStyle="mapbox://styles/mapbox/streets-v9"
//       mapboxAccessToken={MAPBOX_TOKEN}
//     >
//       {/* Code that displays search box */}
//       <GeocoderControl
//         mapboxAccessToken={MAPBOX_TOKEN}
//         position="top-left"
//         updateNearestLocations={updateNearestLocations}
//       />
//       {showBluebin && nearestBluebinLocation != null && (
//         <Marker
//           latitude={nearestBluebinLocation.lat}
//           longitude={nearestBluebinLocation.lng}
//           color={recyclableColor}
//           onClick={() => setActiveMarker(nearestBluebinLocation)}
//         />
//       )}

//       {showGDPins
//         // Show all locations of an item only if ALL of the item's individual locations are to be shown
//         .map((showItemLocations, i) =>
//           showItemLocations.filter((showMarker) => showMarker).length >= 1
//             ? i
//             : -1
//         )
//         .filter((i) => i != -1)
//         .map((i) => {
//           const locations: LocationInfo[] = GDLocations[i];
//           return (
//             <>
//               {locations
//                 .filter(
//                   (_location, locationIndex) => showGDPins[i][locationIndex]
//                 )
//                 .map((location: LocationInfo) => {
//                   return (
//                     <Marker
//                       latitude={location.lat}
//                       longitude={location.lng}
//                       color={donatableColor}
//                       onClick={() => setActiveMarker(location)}
//                     />
//                   );
//                 })}
//             </>
//           );
//         })}
//       {showRDPins
//         .map((showItemLocations, i) =>
//           showItemLocations.filter((showMarker) => showMarker).length >= 1
//             ? i
//             : -1
//         )
//         .filter((i) => i != -1)
//         .map((i) => {
//           const locations: LocationInfo[] = RDLocations[i];
//           return (
//             <>
//               {locations
//                 .filter(
//                   (_location, locationIndex) => showRDPins[i][locationIndex]
//                 )
//                 .map((location: LocationInfo) => {
//                   return (
//                     <Marker
//                       latitude={location.lat}
//                       longitude={location.lng}
//                       children={<BuildIcon sx={{ color: donatableColor }} />}
//                       onClick={() => setActiveMarker(location)}
//                     />
//                   );
//                 })}
//             </>
//           );
//         })}
//       {showGEPins
//         .map((showItemLocations, i) =>
//           showItemLocations.filter((showMarker) => showMarker).length >= 1
//             ? i
//             : -1
//         )
//         .filter((i) => i != -1)
//         .map((i) => {
//           const locations: LocationInfo[] = GELocations[i];
//           return (
//             <>
//               {locations
//                 .filter(
//                   (_location, locationIndex) => showGEPins[i][locationIndex]
//                 )
//                 .map((location: LocationInfo) => {
//                   return (
//                     <Marker
//                       latitude={location.lat}
//                       longitude={location.lng}
//                       color={ewasteColor}
//                       onClick={() => setActiveMarker(location)}
//                     />
//                   );
//                 })}
//             </>
//           );
//         })}
//       {showREPins
//         .map((showItemLocations, i) =>
//           showItemLocations.filter((showMarker) => showMarker).length >= 1
//             ? i
//             : -1
//         )
//         .filter((i) => i != -1)
//         .map((i) => {
//           const locations: LocationInfo[] = RELocations[i];
//           return (
//             <>
//               {locations
//                 .filter(
//                   (_location, locationIndex) => showREPins[i][locationIndex]
//                 )
//                 .map((location: LocationInfo) => {
//                   return (
//                     <Marker
//                       latitude={location.lat}
//                       longitude={location.lng}
//                       children={<BuildIcon sx={{ color: ewasteColor }} />}
//                       onClick={() => setActiveMarker(location)}
//                     />
//                   );
//                 })}
//             </>
//           );
//         })}
//       {showEwastePins
//         .map((showItemLocations, i) =>
//           showItemLocations.filter((showMarker) => showMarker).length >= 1
//             ? i
//             : -1
//         )
//         .filter((i) => i != -1)
//         .map((i) => {
//           const locations: LocationInfo[] = EELocations[i];
//           return (
//             <>
//               {locations
//                 .filter(
//                   (_location, locationIndex) => showEwastePins[i][locationIndex]
//                 )
//                 .map((location: LocationInfo) => {
//                   return (
//                     <Marker
//                       latitude={location.lat}
//                       longitude={location.lng}
//                       onClick={() => setActiveMarker(location)}
//                     >
//                       <RecyclingIcon
//                         style={{
//                           backgroundColor: ewasteColor,
//                           color: "white",
//                           border: "1px solid white",
//                           borderRadius: 10,
//                         }}
//                       />
//                     </Marker>
//                   );
//                 })}
//             </>
//           );
//         })}
//       {activeMarker != null && (
//         <Popup
//           latitude={activeMarker.lat}
//           longitude={activeMarker.lng}
//           onClose={() => setActiveMarker(null)}
//           closeButton={true}
//           closeOnClick={false}
//           anchor="top"
//           style={{ color: "green" }}
//         >
//           <div>
//             <h3>{activeMarker?.name}</h3>
//             <p>{activeMarker?.address}</p>
//             <p>{activeMarker?.contact}</p>
//           </div>
//         </Popup>
//       )}
//     </Map>
//   );
// }

// export default MapLocations;

export default function MapLocationsOld() {
  return <></>;
}

// Code befor refactoring
{
  /* {renderPins(
          showGDPins,
          closestGDLoc,
          GDLocations,
          donatableColor,
          null
        )}
        {renderPins(
          showRDPins,
          closestRDLoc,
          RDLocations,
          donatableColor,
          <BuildIcon sx={{ color: donatableColor }} />
        )}
        {renderPins(showGEPins, closestGELoc, GELocations, ewasteColor, null)}
        {renderPins(
          showREPins,
          closestRELoc,
          RELocations,
          ewasteColor,
          <BuildIcon sx={{ color: ewasteColor }} />
        )}
        {renderPins(
          showEwastePins,
          closestEELoc,
          EELocations,
          ewasteColor,
          <RecyclingIcon
            style={{
              backgroundColor: ewasteColor,
              color: "white",
              border: "1px solid white",
              borderRadius: 10,
            }}
          />
        )} */
}

// Oldest code before renderPins
{
  /* {showGDPins
          .map((sel, i) => (sel ? i : -1))
          .filter((i) => i != -1)
          .map((i) => {
            if (onlyShowClosest) {
              const closestLoc: LocationInfo = closestGDLoc[i];
              return (
                <Marker
                  latitude={closestLoc.lat}
                  longitude={closestLoc.lng}
                  color={donatableColor}
                  onClick={() => setActiveMarker(closestLoc)}
                />
              );
            } else {
              const locations: LocationInfo[] = GDLocations[i];
              return (
                <>
                  {locations.map((location: LocationInfo) => {
                    return (
                      <Marker
                        latitude={location.lat}
                        longitude={location.lng}
                        color={donatableColor}
                        onClick={() => setActiveMarker(location)}
                      />
                    );
                  })}
                </>
              );
            }
          })}
        {showRDPins
          .map((sel, i) => (sel ? i : -1))
          .filter((i) => i != -1)
          .map((i) => {
            if (onlyShowClosest) {
              const closestLoc: LocationInfo = closestRDLoc[i];
              return (
                <Marker
                  latitude={closestLoc.lat}
                  longitude={closestLoc.lng}
                  onClick={() => setActiveMarker(closestLoc)}
                >
                  <BuildIcon sx={{ color: donatableColor }} />
                </Marker>
              );
            } else {
              const locations: LocationInfo[] = RDLocations[i];
              return (
                <>
                  {locations.map((location: LocationInfo) => {
                    return (
                      <Marker
                        latitude={location.lat}
                        longitude={location.lng}
                        onClick={() => setActiveMarker(location)}
                      >
                        <BuildIcon sx={{ color: donatableColor }} />
                      </Marker>
                    );
                  })}
                </>
              );
            }
          })}
        {showGEPins
          .map((sel, i) => (sel ? i : -1))
          .filter((i) => i != -1)
          .map((i) => {
            if (onlyShowClosest) {
              const closestLoc: LocationInfo = closestGELoc[i];
              return (
                <Marker
                  latitude={closestLoc.lat}
                  longitude={closestLoc.lng}
                  color={ewasteColor}
                  onClick={() => setActiveMarker(closestLoc)}
                />
              );
            } else {
              const locations: LocationInfo[] = GELocations[i];
              return (
                <>
                  {locations.map((location: LocationInfo) => {
                    return (
                      <Marker
                        latitude={location.lat}
                        longitude={location.lng}
                        color={ewasteColor}
                        onClick={() => setActiveMarker(location)}
                      />
                    );
                  })}
                </>
              );
            }
          })}
        {showREPins
          .map((sel, i) => (sel ? i : -1))
          .filter((i) => i != -1)
          .map((i) => {
            if (onlyShowClosest) {
              const closestLoc: LocationInfo = closestRELoc[i];
              return (
                <Marker
                  latitude={closestLoc.lat}
                  longitude={closestLoc.lng}
                  onClick={() => setActiveMarker(closestLoc)}
                >
                  <BuildIcon sx={{ color: ewasteColor }} />
                </Marker>
              );
            } else {
              const locations: LocationInfo[] = RELocations[i];
              return (
                <>
                  {locations.map((location: LocationInfo) => {
                    return (
                      <Marker
                        latitude={location.lat}
                        longitude={location.lng}
                        onClick={() => setActiveMarker(location)}
                      >
                        <BuildIcon sx={{ color: ewasteColor }} />
                      </Marker>
                    );
                  })}
                </>
              );
            }
          })}
        {showEwastePins
          .map((sel, i) => (sel ? i : -1))
          .filter((i) => i != -1)
          .map((i) => {
            if (onlyShowClosest) {
              const closestLoc: LocationInfo = closestEELoc[i];
              return (
                <Marker
                  latitude={closestLoc.lat}
                  longitude={closestLoc.lng}
                  onClick={() => setActiveMarker(closestLoc)}
                >
                  <RecyclingIcon
                    style={{
                      backgroundColor: ewasteColor,
                      color: "white",
                      border: "1px solid white",
                      borderRadius: 10,
                    }}
                  />
                </Marker>
              );
            } else {
              const locations: LocationInfo[] = EELocations[i];
              return (
                <>
                  {locations.map((location: LocationInfo) => {
                    return (
                      <Marker
                        latitude={location.lat}
                        longitude={location.lng}
                        onClick={() => setActiveMarker(location)}
                      >
                        <RecyclingIcon
                          style={{
                            backgroundColor: ewasteColor,
                            color: "white",
                            border: "1px solid white",
                            borderRadius: 10,
                          }}
                        />
                      </Marker>
                    );
                  })}
                </>
              );
            }
          })} */
}
