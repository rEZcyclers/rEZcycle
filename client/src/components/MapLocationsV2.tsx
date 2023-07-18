import { useContext, useEffect, useState } from "react";
import Map, { Marker, Popup } from "react-map-gl";
import {
  DonateLocation,
  RepairLocation,
  DonateOrganisationLocations,
  EbinLocations,
  EbinLocation,
  Ebin,
  Bluebin,
  LocationInfo,
} from "../DataTypes";
import BuildIcon from "@mui/icons-material/Build";
import RecyclingIcon from "@mui/icons-material/Recycling";
import WhereToVoteOutlinedIcon from "@mui/icons-material/WhereToVoteOutlined";

import {
  Alert,
  FormControlLabel,
  Snackbar,
  Switch,
  Typography,
} from "@mui/material";
import GeocoderControl from "./MapComponents/GeocoderControl";
import MarkerRenderer from "./MapComponents/MarkerRenderer";
import { backendContext } from "../App";

interface Props {
  // 'Show on Map' button states for every selected item
  showBluebin: boolean;
  showGDMarkers: boolean[]; // Good Donatables (GD)
  showRDMarkers: boolean[]; // Repairable Donatables (RD)
  showGEMarkers: boolean[]; // Good Ewaste (GE)
  showREMarkers: boolean[]; // Repairable Ewaste (RE)
  showEEMarkers: boolean[]; // Ebin Ewaste (EE)

  // Results for every item (i.e. a list of list of locations)
  bluebinsData: Bluebin[]; // Any recyclable can go any bluebin, hence don't need 2D array
  goodDonatablesResults: DonateOrganisationLocations[][]; // GD results
  repairDonatablesResults: RepairLocation[][]; // RD results
  goodEwasteResults: DonateOrganisationLocations[][]; // GE results
  repairEwasteResults: RepairLocation[][]; // RE results
  ebinEwasteResults: EbinLocations[][]; // EE results

  // User's preferred location for every item
  closestBBLoc: LocationInfo | null;
  setClosestBBLoc: (bluebin: LocationInfo) => void;
  setPreferredGDLoc: (newArray: LocationInfo[]) => void;
  setPreferredRDLoc: (newArray: LocationInfo[]) => void;
  setPreferredGELoc: (newArray: LocationInfo[]) => void;
  setPreferredRELoc: (newArray: LocationInfo[]) => void;
  setPreferredEELoc: (newArray: LocationInfo[]) => void;

  showClosest: boolean;
  setShowClosest: (toggle: boolean) => void;
  setShowBluebin: (show: boolean) => void;

  isRecyclableSelected: boolean;
}

const recyclableColor = "#00FF00";
const donatableColor = "#FC2BA1";
const ewasteColor = "#FFC300";

const MAPBOX_TOKEN =
  "pk.eyJ1IjoiaWFuNDQ0NCIsImEiOiJjbGhpeTVrMjcwY253M2RwNThlY2wzMWJ6In0.f3cyuNBJ5dmOBt-JTI6iCw";

/**
 * Calculates the distance between two locations using the Haversine formula. Credits to
 * https://stackoverflow.com/questions/14560999/using-the-haversine-formula-in-javascript.
 * @param lat1 - Latitude of first location
 * @param lon1 - Longitude of first location
 * @param lat2 - Latitude of second location
 * @param lon2 - Longitude of second location
 * @returns {number} - Distance in km
 */
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const earthRadius = 6371; // Earth's radius in km

  function toRadians(degrees: number): number {
    return degrees * (Math.PI / 180); // Helper to convert degrees to radians
  }

  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = earthRadius * c;
  return distance;
}

export default function MapLocationsV2({
  showBluebin,
  showGDMarkers,
  showRDMarkers,
  showGEMarkers,
  showREMarkers,
  showEEMarkers,
  bluebinsData,
  goodDonatablesResults,
  repairDonatablesResults,
  goodEwasteResults,
  repairEwasteResults,
  ebinEwasteResults,
  closestBBLoc,
  setClosestBBLoc,
  setPreferredGDLoc,
  setPreferredRDLoc,
  setPreferredGELoc,
  setPreferredRELoc,
  setPreferredEELoc,
  showClosest,
  setShowClosest,
  setShowBluebin,
  isRecyclableSelected,
}: Props) {
  ////////// Data needed to display result items on the map
  const { donatablesData, ewasteData } = useContext(backendContext);

  ////////// States to save the location information for every result item
  const [BBLocations, setBBLocations] = useState<LocationInfo[]>([]);
  const [GDLocations, setGDLocations] = useState<LocationInfo[][]>([]);
  const [RDLocations, setRDLocations] = useState<LocationInfo[][]>([]);
  const [GELocations, setGELocations] = useState<LocationInfo[][]>([]);
  const [RELocations, setRELocations] = useState<LocationInfo[][]>([]);
  const [EELocations, setEELocations] = useState<LocationInfo[][]>([]);

  ////////// States the save the closest location for every result item
  const [closestGDLoc, setClosestGDLoc] = useState<LocationInfo[]>([]);
  const [closestRDLoc, setClosestRDLoc] = useState<LocationInfo[]>([]);
  const [closestGELoc, setClosestGELoc] = useState<LocationInfo[]>([]);
  const [closestRELoc, setClosestRELoc] = useState<LocationInfo[]>([]);
  const [closestEELoc, setClosestEELoc] = useState<LocationInfo[]>([]);

  ////////// User States for marker popup, user location & error alert
  const [activeMarker, setActiveMarker] = useState<LocationInfo | null>(null);
  const [showAlert, setShowAlert] = useState(false);
  const closeAlert = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      console.log(event);
      return;
    }
    setShowAlert(false);
  };

  /** ////////// Start of getLocations() //////////
   * Gets all the location information needed for each result item, so as to be able
   * to render all of their associated location markers on the map. () => void.
   */
  function getLocations() {
    /**
     * Helper function to get the location info specific to good condition items.
     * @param goodResults - Results for good condition items
     * @param setDonateLocations - Sets the donate location info for these items
     *  @param isEwasteItem - Check whether the item is an Ewaste or Donatable
     */
    function getDonateLocations(
      goodResults: DonateOrganisationLocations[][],
      setDonateLocations: (newArray: LocationInfo[][]) => void,
      isEwasteItem: boolean
    ) {
      setDonateLocations(
        goodResults.map(
          // For each good condition item's result, map it to a LocationInfo[]
          (itemResult: DonateOrganisationLocations[], i: number) => {
            // For each result, flatmap all organisations into a single LocationInfo[]
            return itemResult.flatMap(
              (organisation: DonateOrganisationLocations) => {
                const locations: DonateLocation[] =
                  organisation["donateLocations"];
                return locations.map((location: DonateLocation) => {
                  const locationInfo: LocationInfo = {
                    locationType: "donate",
                    item: isEwasteItem
                      ? ewasteData[i]["ewaste_type"]
                      : donatablesData[i]["donatable_type"],
                    name: location["location_name"],
                    address: location["address"],
                    contact: location["contact"],
                    lat: location["latitude"],
                    lng: location["longitude"],
                  };
                  return locationInfo;
                });
              }
            );
          }
        )
      );
    }
    /**
     * Helper function to get the location info specific to repairable items.
     * @param repairResults - Results for repairable items
     * @param setRepairLocations - Sets the repair location info for these items
     * @param isEwasteItem - Check whether the item is an Ewaste or Donatable
     */
    function getRepairLocations(
      repairResults: RepairLocation[][],
      setRepairLocations: (newArray: LocationInfo[][]) => void,
      isEwasteItem: boolean
    ) {
      setRepairLocations(
        repairResults.map((item: RepairLocation[], i: number) => {
          // For each repairable item's result, map it to a LocationInfo[]
          return item.map((location: RepairLocation) => {
            const locationInfo: LocationInfo = {
              locationType: "repair",
              item: isEwasteItem
                ? ewasteData[i]["ewaste_type"]
                : donatablesData[i]["donatable_type"],
              name: location["center_name"],
              address: location["stall_number"],
              contact: "No contact available",
              lat: location["latitude"],
              lng: location["longitude"],
            };
            return locationInfo;
          });
        })
      );
    }
    // Get LocationInfo[][] for good & repairable items
    getDonateLocations(goodDonatablesResults, setGDLocations, false);
    getDonateLocations(goodEwasteResults, setGELocations, true);
    getRepairLocations(repairDonatablesResults, setRDLocations, false);
    getRepairLocations(repairEwasteResults, setRELocations, true);

    // Special case: Bluebins
    setBBLocations(
      // Map each Bluebin to a LocationInfo for finding nearest bluebin later on
      bluebinsData.map((bluebin: Bluebin) => {
        const locationInfo: LocationInfo = {
          locationType: "bluebin",
          name: "bluebin",
          item: "checked recyclable items",
          address: bluebin["address"],
          contact: "No contact available",
          lat: bluebin["latitude"],
          lng: bluebin["longitude"],
        };
        return locationInfo;
      })
    );

    // Special case: Ebins
    setEELocations(
      ebinEwasteResults.map(
        // For each ebin-eligible Ewaste item's result, map it to a LocationInfo[]
        (item: EbinLocations[], i: number) => {
          // For each result, flatmap all ebins into a single LocationInfo[]
          return item.flatMap((ebinInfo: EbinLocations) => {
            const ebin: Ebin = ebinInfo["ebin"];
            const locations: EbinLocation[] = ebinInfo["ebinLocations"];
            return locations.map((location: EbinLocation) => {
              const locationInfo: LocationInfo = {
                locationType: "ebin",
                item: ewasteData[i]["ewaste_type"],
                name: ebin["ebin_name"],
                address: location["address"],
                contact: "No contact available",
                lat: location["latitude"],
                lng: location["longitude"],
              };
              return locationInfo;
            });
          });
        }
      )
    );
  }
  ////////// End of getLocations() //////////

  useEffect(getLocations, []); // Only get all locations info once (upon initialisation )

  /** ////////// Start of getClosestLocations() //////////
   * Gets the closest location for every result item relative to the user's location.
   * @param userLocation - Coordinates of the user's input address
   * @returns {void}
   */
  function getClosestLocations(userLocation: number[]) {
    console.log("getClosestLocations() called!");
    setUserLocation(userLocation); // This line will pass too quickly such that
    // the userLocation state hasn't been set by the time closestLocation() is called,
    // hence just pass userLocation in as another param into closestLocation() since
    // we're unable to use the state which is not yet available

    /**
     * Helper function to get the 1 closest location to the user given a list of locations.
     * @param itemLocations - List of locations
     * @param userLocation - User's location coordinates
     * @returns {LocationInfo} - The closest location
     */
    function closestLocation(
      itemLocations: LocationInfo[],
      userLocation: number[]
    ) {
      let closestDistToUser = Infinity;
      let closestLocation = itemLocations[0];
      for (const location of itemLocations) {
        const distToUser = calculateDistance(
          // calculateDistance() defined at the start
          userLocation[0],
          userLocation[1],
          location["lat"],
          location["lng"]
        );
        if (distToUser < closestDistToUser) {
          closestDistToUser = distToUser;
          closestLocation = location;
        }
      }
      return closestLocation;
    }
    // Calculate all closest locations for every item using the helper function
    const closestBluebinLoc = closestLocation(BBLocations, userLocation);
    const closestGDLoc = GDLocations.map((itemLocations: LocationInfo[]) => {
      return closestLocation(itemLocations, userLocation);
    });
    const closestRDLoc = RDLocations.map((itemLocations: LocationInfo[]) => {
      return closestLocation(itemLocations, userLocation);
    });
    const closestGELoc = GELocations.map((itemLocations: LocationInfo[]) => {
      return closestLocation(itemLocations, userLocation);
    });

    const closestRELoc = RELocations.map((itemLocations: LocationInfo[]) => {
      return closestLocation(itemLocations, userLocation);
    });
    const closestEELoc = EELocations.map((itemLocations: LocationInfo[]) => {
      return closestLocation(itemLocations, userLocation);
    });
    // Then save all closest locations in this component's state as defined earlier
    setClosestBBLoc(closestBluebinLoc);
    setClosestGDLoc(closestGDLoc);
    setClosestRDLoc(closestRDLoc);
    setClosestGELoc(closestGELoc);
    setClosestRELoc(closestRELoc);
    setClosestEELoc(closestEELoc);
    // Also set the closest locations as user's initial preferred locations
    setPreferredGDLoc(closestGDLoc);
    setPreferredRDLoc(closestRDLoc);
    setPreferredGELoc(closestGELoc);
    setPreferredRELoc(closestRELoc);
    setPreferredEELoc(closestEELoc);
    // Lastly, show all closest locations to user by default once they are available
    setShowClosest(true);
  }
  ////////// End of getClosestLocations() //////////

  /* Markers to render, for different types of result items as mentioned earlier: 
   - Good Donatables (GD)
   - Repairable Donatables (RD)
   - Good Ewaste (GE)
   - Repairable Ewaste (RE)
   - Ebin Ewaste (EE)
   */
  const markersToRender = [
    {
      itemMarkersToShow: showGDMarkers, // GD
      closestLocList: closestGDLoc,
      allLocations: GDLocations,
      markerColor: donatableColor,
      markerStyle: (
        <WhereToVoteOutlinedIcon
          sx={{
            backgroundColor: donatableColor,
            color: "white",
            border: "2px solid white",
            width: 25,
            height: 25,
            borderRadius: 12,
          }}
        />
      ),
    },
    {
      itemMarkersToShow: showRDMarkers, // RD
      closestLocList: closestRDLoc,
      allLocations: RDLocations,
      markerColor: donatableColor,
      markerStyle: (
        <BuildIcon
          sx={{
            backgroundColor: donatableColor,
            color: "white",
            border: "2px solid white",
            width: 25,
            height: 25,
            borderRadius: 12,
          }}
        />
      ),
    },
    {
      itemMarkersToShow: showGEMarkers, // GE
      closestLocList: closestGELoc,
      allLocations: GELocations,
      markerColor: ewasteColor,
      markerStyle: (
        <WhereToVoteOutlinedIcon
          sx={{
            backgroundColor: ewasteColor,
            color: "white",
            border: "2px solid white",
            width: 25,
            height: 25,
            borderRadius: 12,
          }}
        />
      ),
    },
    {
      itemMarkersToShow: showREMarkers, // RE
      closestLocList: closestRELoc,
      allLocations: RELocations,
      markerColor: ewasteColor,
      markerStyle: (
        <BuildIcon
          sx={{
            backgroundColor: ewasteColor,
            color: "white",
            border: "2px solid white",
            width: 25,
            height: 25,
            borderRadius: 12,
          }}
        />
      ),
    },
    {
      itemMarkersToShow: showEEMarkers, // EE
      closestLocList: closestEELoc,
      allLocations: EELocations,
      markerColor: ewasteColor,
      markerStyle: (
        <RecyclingIcon
          sx={{
            backgroundColor: ewasteColor,
            color: "white",
            border: "1px solid white",
            width: 25,
            height: 25,
            borderRadius: 12,
          }}
        />
      ),
    },
  ];

  const [userLocation, setUserLocation] = useState<number[] | null>(null);

  return (
    <div style={{ position: "relative", width: "95%", height: "60%" }}>
      <Map
        initialViewState={{
          latitude: 1.36,
          longitude: 103.803,
          zoom: 10.5,
        }}
        style={{ position: "relative", width: "100%", height: "100%" }}
        mapStyle="mapbox://styles/mapbox/streets-v9"
        mapboxAccessToken={MAPBOX_TOKEN}
      >
        <GeocoderControl
          mapboxAccessToken={MAPBOX_TOKEN}
          position="top-left"
          getClosestLocations={getClosestLocations}
        />
        {isRecyclableSelected && showBluebin && closestBBLoc != null && (
          <Marker
            latitude={closestBBLoc.lat}
            longitude={closestBBLoc.lng}
            onClick={() => setActiveMarker(closestBBLoc)}
          >
            <RecyclingIcon
              sx={{
                backgroundColor: recyclableColor,
                color: "white",
                border: "2px solid white",
                width: 27,
                height: 27,
                borderRadius: 14,
              }}
            />
          </Marker>
        )}
        {markersToRender.map((params, i) => (
          <MarkerRenderer
            itemMarkersToShow={params.itemMarkersToShow}
            closestLocList={params.closestLocList}
            allLocations={params.allLocations}
            markerColor={params.markerColor}
            markerStyle={params.markerStyle}
            showClosest={showClosest}
            setActiveMarker={setActiveMarker}
            itemType={i}
          />
        ))}
        {activeMarker != null && (
          <Popup
            latitude={activeMarker.lat}
            longitude={activeMarker.lng}
            onClose={() => setActiveMarker(null)}
            closeButton={true}
            closeOnClick={false}
            anchor="top"
            style={{ color: "green" }}
          >
            <div>
              <h3>{activeMarker.name}</h3>
              <p>For {activeMarker.item}</p>
              <p>{activeMarker.address}</p>
              <p>{activeMarker.contact}</p>
            </div>
          </Popup>
        )}
      </Map>
      <div
        style={{
          margin: 0,
          width: "15%",
          minWidth: 70,
          maxWidth: 100,
          position: "absolute",
          top: "1rem",
          right: "1rem",
          zIndex: 1,
          borderRadius: "2rem",
          backgroundColor: userLocation === null ? "lightgray" : "turquoise",
        }}
      >
        <FormControlLabel
          control={
            <Switch
              checked={showClosest}
              onChange={() => {
                if (userLocation === null) {
                  setShowAlert(true);
                  return;
                }
                setShowAlert(false);
                setShowClosest(!showClosest);
                if (!showClosest) setShowBluebin(true);
              }}
              color="secondary"
              size="medium"
            />
          }
          label={
            <Typography fontSize={14} color={"black"}>
              {showClosest ? "Showing closest places" : "Show closest places"}
            </Typography>
          }
          labelPlacement="top"
          sx={{ paddingTop: 1 }}
        />
      </div>
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        open={showAlert}
        autoHideDuration={2500}
        onClose={closeAlert}
      >
        <Alert
          onClose={closeAlert}
          severity="error"
          sx={{ width: "100%", borderRadius: 7 }}
        >
          Please input an address to view the closest places.
        </Alert>
      </Snackbar>
    </div>
  );
}
