// import { useEffect, useState } from "react";
// import Map, { Marker, Popup } from "react-map-gl";
// import {
//   DonatableItem,
//   DonateLocation,
//   DonateOrganisation,
//   EwasteItem,
//   RepairLocation,
//   SelectedResultItem,
//   DonateOrganisationLocations,
//   EbinLocations,
// } from "../DataTypes";

// type LocationCoordinates = {
//   latitude: number;
//   longitude: number;
// };

// type LocationInfo = {
//   address: string;
//   name: string;
//   contact: string;
//   coords: LocationCoordinates;
// };

// interface Props {
//   goodDonatables: DonatableItem[]; // Selected donatables in good condition
//   repairDonatables: DonatableItem[]; // Selected donatables in repairable condition
//   spoiltDonatables: DonatableItem[]; // Selected donatables in spoilt condition
//   goodDonatablesResults: DonateOrganisationLocations[][]; // List of donateOrganisations & their locations for every selected good donatable
//   repairDonatablesResults: RepairLocation[][]; // List of repairLocations for every selected repairable donatable

//   goodEwaste: EwasteItem[]; // Selected Ewaste in good condition
//   repairEwaste: EwasteItem[]; // Selected Ewaste in repairable condition
//   spoiltEwaste: EwasteItem[]; // Selected Ewaste in spoilt condition
//   goodEwasteResults: DonateOrganisationLocations[][]; // List of donateLocations & their locations for every selected good Ewaste
//   repairEwasteResults: RepairLocation[][]; // List of repairLocations for every selected repairable Ewaste
//   ewasteEbinResults: EbinLocations[][]; // List of ebinLocations for every selected Ewaste item

//   selectedResultItem: SelectedResultItem;
// }

// const MAPBOX_TOKEN =
//   "pk.eyJ1IjoiaWFuNDQ0NCIsImEiOiJjbGhpeTVrMjcwY253M2RwNThlY2wzMWJ6In0.f3cyuNBJ5dmOBt-JTI6iCw"; // Set your mapbox token here

// const DEFAULT_COORDINATES = {
//   latitude: 1.7436446564238546,
//   longitude: 103.89657957314985,
// };

// const geocodeAddress = async (address: string) => {
//   const response = await fetch(
//     `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
//       address
//     )}.json?access_token=${MAPBOX_TOKEN}`
//   );
//   const data = await response.json();
//   return data.features[0];
// };

// const Locations = (props: Props) => {
//   // destructure object
//   const { category, condition, index } = props.selectedResultItem;

//   // From this array, get any Location Info you want for any result item
//   // How do you get the location that you want? Use allLocationInfo[category][condition][itemIndex][locationIndex]
//   //   category: 0 for recyclables, 1 for donatables, 2 for Ewaste
//   //   condition: 0 for good, 1 for repairable, 2 for spoilt (exception: for recyclables, use 0 to access all recyclable locations)
//   // For example, use allLocationInfo[1][0][0][0] to get the first location(0) of the first item(0) in the good condition(0) of the donatables(1) category
//   const [allLocationInfo, setAllLocationInfo] = useState<LocationInfo[][][][]>([
//     [[]], // bluebin locations for recyclables
//     [[], []], // donate, repair locations for donatables
//     [[], []], // donate, repair locations for ewaste
//   ]);

//   // Make a list of LocationInfo for every selected good donatable item
//   useEffect(() => {
//     setAllLocationInfo([
//       allLocationInfo[0],
//       [
//         props.goodDonatablesResults.map(
//           // For each selected good donatable item, create a list of LocationInfo
//           (item: DonateOrganisationLocations[]) => {
//             // For each organisation that accepts the selected good donatable item, transform it to a flat list of LocationInfo
//             return item.flatMap((organisation: DonateOrganisationLocations) => {
//               const org: DonateOrganisation = organisation["donateOrg"];
//               const locations: DonateLocation[] =
//                 organisation["donateLocations"];
//               return locations.map((location: DonateLocation) => {
//                 // For each location of an organisation, transform it to a LocationInfo
//                 const locationInfo: LocationInfo = {
//                   address: location["address"],
//                   name: org["organisation_name"],
//                   contact: location["contact"],
//                   coords: {
//                     latitude: DEFAULT_COORDINATES.latitude,
//                     longitude: DEFAULT_COORDINATES.longitude,
//                   },
//                 };
//                 return locationInfo;
//               });
//             });
//           }
//         ),
//         props.repairDonatablesResults.map(
//           // For each selected repairable donatable item, create a list of LocationInfo
//           (item: RepairLocation[]) => {
//             // For each repair location that accepts the selected repairable donatable item, transform it to data of type LocationInfo
//             return item.map((location: RepairLocation) => {
//               const locationInfo: LocationInfo = {
//                 address:
//                   location["center_name"] + " " + location["stall_number"],
//                 name: "HDB block",
//                 contact: "No contact available",
//                 coords: {
//                   latitude: DEFAULT_COORDINATES.latitude,
//                   longitude: DEFAULT_COORDINATES.longitude,
//                 },
//               };
//               return locationInfo;
//             });
//           }
//         ),
//         allLocationInfo[1][2],
//       ],
//       [
//         props.goodEwasteResults.map(
//           // For each selected good donatable item, create a list of LocationInfo
//           (item: DonateOrganisationLocations[]) => {
//             // For each organisation that accepts the selected good donatable item, transform it to a flat list of LocationInfo
//             return item.flatMap((organisation: DonateOrganisationLocations) => {
//               const org: DonateOrganisation = organisation["donateOrg"];
//               const locations: DonateLocation[] =
//                 organisation["donateLocations"];
//               return locations.map((location: DonateLocation) => {
//                 // For each location of an organisation, transform it to a LocationInfo
//                 const locationInfo: LocationInfo = {
//                   address: location["address"],
//                   name: org["organisation_name"],
//                   contact: location["contact"],
//                   coords: {
//                     latitude: DEFAULT_COORDINATES.latitude,
//                     longitude: DEFAULT_COORDINATES.longitude,
//                   },
//                 };
//                 return locationInfo;
//               });
//             });
//           }
//         ),
//         props.repairEwasteResults.map(
//           // For each selected repairable donatable item, create a list of LocationInfo
//           (item: RepairLocation[]) => {
//             // For each repair location that accepts the selected repairable donatable item, transform it to data of type LocationInfo
//             return item.map((location: RepairLocation) => {
//               const locationInfo: LocationInfo = {
//                 address:
//                   location["center_name"] + " " + location["stall_number"],
//                 name: "HDB block",
//                 contact: "No contact available",
//                 coords: {
//                   latitude: DEFAULT_COORDINATES.latitude,
//                   longitude: DEFAULT_COORDINATES.longitude,
//                 },
//               };
//               return locationInfo;
//             });
//           }
//         ),
//         allLocationInfo[1][2],
//       ],
//     ]);
//   }, []);

//   // Geocodes the address of every Location Info in a Location Info list
//   const geocodeLocationInfoList = (locInfoList: LocationInfo[]) => {
//     // Asynchronously request to geocode all addresses in the list
//     const promises = locInfoList.map((locInfo: LocationInfo) =>
//       geocodeAddress(locInfo["address"])
//     );
//     // Process all responses
//     Promise.all(promises)
//       .then((results) => {
//         // create new LocationInfo list with coordinates
//         const newLocInfoList: LocationInfo[] = new Array(locInfoList.length);
//         for (let i = 0; i < results.length; i++) {
//           const newLocInfo = locInfoList[i];
//           newLocInfo["coords"] = {
//             latitude: results[i].center[1],
//             longitude: results[i].center[0],
//           };
//           newLocInfoList[i] = newLocInfo;
//         }
//         // Update allLocationInfo with a new list of LocationInfo to trigger a re-render of the map markers
//         setAllLocationInfo([
//           ...allLocationInfo.slice(0, category),
//           [
//             ...allLocationInfo[category].slice(0, condition),
//             [
//               ...allLocationInfo[category][condition].slice(0, index),
//               newLocInfoList,
//               ...allLocationInfo[category][condition].slice(index + 1),
//             ],
//             ...allLocationInfo[category].slice(condition + 1),
//           ],
//           ...allLocationInfo.slice(category + 1),
//         ]);
//       })
//       .catch((error) => {
//         console.error("Geocoding request failed:", error);
//       });
//     console.log("geocode ran");
//   };

//   // // Make a list of LocationInfo for every selected donatable item that is in repairable condition
//   // const [repairableDonatablesLocationInfoList, setRepairableDonatablesLocationInfoList] =
//   // useState<LocationInfo[]>(
//   //   props.repairDonatablesResults.flatMap(
//   //     // For each donatable item
//   //     (locationList: RepairLocation[]) => {
//   //       // Convert the location list into a LocationInfo list
//   //       return locationList.flatMap((location: RepairLocation) => {
//   //         const locInfo: LocationInfo = {
//   //           address: location["center_name"],
//   //           name: location["center_name"],
//   //           contact: "Not Applicable",
//   //           coords: { latitude: 1.36, longitude: 103.803 },
//   //         };
//   //         return locInfo;
//   //       });
//   //     }
//   //   )
//   // );

//   const [activeMarker, setActiveMarker] = useState<number>(-1);

//   const handleMarkerClick = (marker: number) => {
//     setActiveMarker(marker);
//   };

//   const handlePopupClose = () => {
//     setActiveMarker(-1);
//   };

//   // Whenever the selected item changes, geocode the LocationInfo list of the selected item
//   useEffect(() => {
//     if (
//       category != -1 &&
//       allLocationInfo[category][condition][index][0].coords.latitude ==
//         DEFAULT_COORDINATES.latitude
//     ) {
//       geocodeLocationInfoList(allLocationInfo[category][condition][index]);
//       console.log("geocode ran");
//     }
//   }, [props.selectedResultItem]);

//   return (
//     <>
//       <Map
//         initialViewState={{
//           latitude: 1.36,
//           longitude: 103.803,
//           zoom: 10.5,
//         }}
//         style={{ position: "relative", width: "90%", height: 600 }}
//         mapStyle="mapbox://styles/mapbox/streets-v9"
//         mapboxAccessToken={MAPBOX_TOKEN}
//       >
//         {/* Only show markers if
//               (1) there is a selected item i.e. props.selectedResultItem.category != -1
//               (2) if the selected item's addresses have been geocoded i.e. The coordinates are not default */}
//         {category != -1 &&
//           allLocationInfo[category][condition][index][0].coords.latitude !=
//             DEFAULT_COORDINATES.latitude &&
//           allLocationInfo[category][condition][index].map((location, index) => (
//             <Marker
//               latitude={location.coords.latitude}
//               longitude={location.coords.longitude}
//               color="black"
//               onClick={() => handleMarkerClick(index)}
//             />
//           ))}

//         {activeMarker != -1 && (
//           <Popup
//             longitude={
//               allLocationInfo[category][condition][index][activeMarker].coords
//                 .longitude
//             }
//             latitude={
//               allLocationInfo[category][condition][index][activeMarker].coords
//                 .latitude
//             }
//             onClose={handlePopupClose}
//             closeButton={true}
//             closeOnClick={false}
//             anchor="top"
//           >
//             <div>
//               <h3>
//                 {
//                   allLocationInfo[category][condition][index][activeMarker][
//                     "name"
//                   ]
//                 }
//               </h3>
//               <p>
//                 {
//                   allLocationInfo[category][condition][index][activeMarker][
//                     "address"
//                   ]
//                 }
//               </p>
//               <p>
//                 Contact:{" "}
//                 {
//                   allLocationInfo[category][condition][index][activeMarker][
//                     "contact"
//                   ]
//                 }
//               </p>
//               <p>
//                 Latitude:{" "}
//                 {
//                   allLocationInfo[category][condition][index][activeMarker]
//                     .coords.latitude
//                 }
//               </p>
//               <p>
//                 Longitude:{" "}
//                 {
//                   allLocationInfo[props.selectedResultItem.category][condition][
//                     index
//                   ][activeMarker].coords.longitude
//                 }
//               </p>
//             </div>
//           </Popup>
//         )}
//       </Map>
//     </>
//   );
// };

// export default Locations;
export default function Locations() {
  return <></>;
}
