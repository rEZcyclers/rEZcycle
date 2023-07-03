import { useEffect, useState } from "react";
import Map, { Marker, Popup } from "react-map-gl";
import {
  DonatableItem,
  DonateLocation,
  DonateOrganisation,
  EWasteItem,
  RepairLocation,
  item,
} from "../DataTypes";

interface LocationCoordinates {
  latitude: number;
  longitude: number;
}
interface LocationInfo {
  address: string;
  organisationName: string;
  contact: string;
  coords: LocationCoordinates;
}

type DonateOrganisationLocations = {
  donateOrg: DonateOrganisation;
  donateLocations: DonateLocation[];
};

interface Props {
  goodDonatables: DonatableItem[]; // Selected donatables in good condition
  repairDonatables: DonatableItem[]; // Selected donatables in repairable condition
  spoiltDonatables: DonatableItem[]; // Selected donatables in spoilt condition
  goodDonatablesResults: DonateOrganisationLocations[][]; // List of donateOrganisations & their locations for every selected good donatable
  repairDonatablesResults: RepairLocation[][]; // List of repairLocations for every selected repairable donatable

  goodEWaste: EWasteItem[]; // Selected EWaste in good condition
  repairEWaste: EWasteItem[]; // Selected EWaste in repairable condition
  spoiltEWaste: EWasteItem[]; // Selected EWaste in spoilt condition
  goodEWasteResults: DonateOrganisationLocations[][]; // List of donateLocations & their locations for every selected good EWaste
  repairEWasteResults: RepairLocation[][]; // List of repairLocations for every selected repairable EWaste

  selectedItem: item;
}

const MAPBOX_TOKEN =
  "pk.eyJ1IjoiaWFuNDQ0NCIsImEiOiJjbGhpeTVrMjcwY253M2RwNThlY2wzMWJ6In0.f3cyuNBJ5dmOBt-JTI6iCw"; // Set your mapbox token here

const sampleLocInfo: LocationInfo[] = [
  {
    address: "1 North Bridge Road, Singapore 179094",
    organisationName: "The Food Bank Singapore",
    contact: "12345678",
    coords: { latitude: 1.36, longitude: 103.803 },
  },
  {
    address: "111 Compassvale Bow, Singapore 544998",
    organisationName: "111 Compassvale Bow, Singapore 544998",
    contact: "12345678",
    coords: { latitude: 1.382, longitude: 103.891 },
  },
];

const DEFAULT_COORDINATES = {
  latitude: 1.2,
  longitude: 103.803,
};

const geocodeAddress = async (address: string) => {
  const response = await fetch(
    `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
      address
    )}.json?access_token=${MAPBOX_TOKEN}`
  );
  const data = await response.json();
  return data.features[0];
};

const Locations = (props: Props) => {
  //

  // From this array, get any Location Info you want about any selected item
  // How do you get the location that you want? Use allLocationInfo[category][condition][itemIndex][locationIndex]
  //   category: 0 for recyclables, 1 for donatables, 2 for ewaste
  //   condition: 0 for good, 1 for repairable, 2 for spoilt (exception: for recyclables, use 0 to access all recyclable locations)
  // For example, use allLocationInfo[1][0][0][0] to get the first location(0) of the first item(0) in the good condition(0) of the donatables(1) category
  const [allLocationInfo, setAllLocationInfo] = useState<LocationInfo[][][][]>([
    [[]],
    [[], [], []],
    [[], [], []],
  ]);

  // Make a list of LocationInfo for every selected good donatable item
  useEffect(() => {
    setAllLocationInfo([
      allLocationInfo[0],
      [
        props.goodDonatablesResults.map(
          // For each selected good donatable item, create a list of LocationInfo
          (item: DonateOrganisationLocations[]) => {
            // For each organisation that accepts the selected good donatable item, transform it to a flat list of LocationInfo
            return item.flatMap((organisation: DonateOrganisationLocations) => {
              const org: DonateOrganisation = organisation["donateOrg"];
              const locations: DonateLocation[] =
                organisation["donateLocations"];
              return locations.map((location: DonateLocation) => {
                // For each location of an organisation, transform it to a LocationInfo
                const locationInfo: LocationInfo = {
                  address: location["address"],
                  organisationName: org["organisation_name"],
                  contact: location["contact"],
                  coords: {
                    latitude: DEFAULT_COORDINATES.latitude,
                    longitude: DEFAULT_COORDINATES.longitude,
                  },
                };
                return locationInfo;
              });
            });
          }
        ),
        allLocationInfo[1][1],
        allLocationInfo[1][2],
      ],
      allLocationInfo[2],
    ]);
  }, []);

  // Geocodes the address of every Location Info in a Location Info list
  const geocodeLocationInfoList = (locInfoList: LocationInfo[]) => {
    // Asynchronously request to geocode all addresses in the list
    const promises = locInfoList.map((locInfo: LocationInfo) =>
      geocodeAddress(locInfo["address"])
    );
    // Process all responses
    Promise.all(promises)
      .then((results) => {
        // create new LocatioInfo list with coordinates
        const newLocInfoList: LocationInfo[] = new Array(locInfoList.length);
        for (let i = 0; i < results.length; i++) {
          const newLocInfo = locInfoList[i];
          newLocInfo["coords"] = {
            latitude: results[i].center[1],
            longitude: results[i].center[0],
          };
          newLocInfoList[i] = newLocInfo;
        }
        // Update allLocationInfo with a new list of LocationInfo to trigger a re-render of the map markers
        setAllLocationInfo([
          allLocationInfo[0],
          [
            [newLocInfoList, ...allLocationInfo[1][0].slice(1)],
            allLocationInfo[1][1],
            allLocationInfo[1][2],
          ],
          allLocationInfo[2],
        ]);
      })
      .catch((error) => {
        console.error("Geocoding request failed:", error);
      });
  };

  // // Make a list of LocationInfo for every selected donatable item that is in repairable condition
  // const [repairableDonatablesLocationInfoList, setRepairableDonatablesLocationInfoList] =
  // useState<LocationInfo[]>(
  //   props.repairDonatablesResults.flatMap(
  //     // For each donatable item
  //     (locationList: RepairLocation[]) => {
  //       // Convert the location list into a LocationInfo list
  //       return locationList.flatMap((location: RepairLocation) => {
  //         const locInfo: LocationInfo = {
  //           address: location["center_name"],
  //           organisationName: location["center_name"],
  //           contact: "Not Applicable",
  //           coords: { latitude: 1.36, longitude: 103.803 },
  //         };
  //         return locInfo;
  //       });
  //     }
  //   )
  // );

  const [activeMarker, setActiveMarker] = useState<number>(-1);

  const handleMarkerClick = (marker: number) => {
    setActiveMarker(marker);
  };

  const handlePopupClose = () => {
    setActiveMarker(-1);
  };

  // Whenever the selected item changes, geocode the LocationInfo list of the selected category
  useEffect(() => {
    if (props.selectedItem.category != -1) {
      geocodeLocationInfoList(
        allLocationInfo[props.selectedItem.category][
          props.selectedItem.condition
        ][props.selectedItem.index]
      );
    }
  }, [props.selectedItem]);

  return (
    <>
      <Map
        initialViewState={{
          latitude: 1.36,
          longitude: 103.803,
          zoom: 10.5,
        }}
        style={{ position: "relative", width: "90%", height: 600 }}
        mapStyle="mapbox://styles/mapbox/streets-v9"
        mapboxAccessToken={MAPBOX_TOKEN}
      >
        {/* Only show markers if 
              (1) there is a selected item i.e. props.selectedItem.category != -1
              (2) if the selected item's addresses have been geocoded i.e. The coordinates are not default */}
        {props.selectedItem.category != -1 &&
          allLocationInfo[props.selectedItem.category][
            props.selectedItem.condition
          ][props.selectedItem.index][0].coords.latitude !=
            DEFAULT_COORDINATES.latitude &&
          allLocationInfo[props.selectedItem.category][
            props.selectedItem.condition
          ][props.selectedItem.index].map((location, index) => (
            <Marker
              latitude={location.coords.latitude}
              longitude={location.coords.longitude}
              color="black"
              onClick={() => handleMarkerClick(index)}
            />
          ))}

        {activeMarker != -1 && (
          <Popup
            longitude={
              allLocationInfo[props.selectedItem.category][
                props.selectedItem.condition
              ][props.selectedItem.index][activeMarker].coords.longitude
            }
            latitude={
              allLocationInfo[props.selectedItem.category][
                props.selectedItem.condition
              ][props.selectedItem.index][activeMarker].coords.latitude
            }
            onClose={handlePopupClose}
            closeButton={true}
            closeOnClick={false}
            anchor="top"
          >
            <div>
              <h3>
                {
                  allLocationInfo[props.selectedItem.category][
                    props.selectedItem.condition
                  ][props.selectedItem.index][activeMarker]["organisationName"]
                }
              </h3>
              <p>
                {
                  allLocationInfo[props.selectedItem.category][
                    props.selectedItem.condition
                  ][props.selectedItem.index][activeMarker]["address"]
                }
              </p>
              <p>
                Contact:{" "}
                {
                  allLocationInfo[props.selectedItem.category][
                    props.selectedItem.condition
                  ][props.selectedItem.index][activeMarker]["contact"]
                }
              </p>
              <p>
                Latitude:{" "}
                {
                  allLocationInfo[props.selectedItem.category][
                    props.selectedItem.condition
                  ][props.selectedItem.index][activeMarker].coords.latitude
                }
              </p>
              <p>
                Longitude:{" "}
                {
                  allLocationInfo[props.selectedItem.category][
                    props.selectedItem.condition
                  ][props.selectedItem.index][activeMarker].coords.longitude
                }
              </p>
            </div>
          </Popup>
        )}
      </Map>
    </>
  );
};

export default Locations;
