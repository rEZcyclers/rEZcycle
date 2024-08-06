import { useEffect, useState } from "react";
import { Map as MainMap, Marker, Popup } from "react-map-gl";
import ContactEmailButton from "./MapComponents/ContactEmailButton";
import {
  DonateLocation,
  RepairLocation,
  DonateOrganisationLocations,
  EbinLocations,
  EbinLocation,
  Ebin,
  Bluebin,
  LocationInfo,
  DonatableItem,
  EwasteItem,
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

interface Props {
  // Selected Items
  goodDonatables: DonatableItem[];
  repairDonatables: DonatableItem[];
  goodEwaste: EwasteItem[];
  repairEwaste: EwasteItem[];
  ebinEwaste: EwasteItem[];

  // 'Show on Map' button states for every selected item
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

  // User location
  userLocation: number[] | null;
  setUserLocation: (userLocation: number[] | null) => void;

  // User's preferred location for every item
  closestBBLoc: LocationInfo | null;
  setClosestBBLoc: (bluebin: LocationInfo | null) => void;
  setPreferredGDLoc: (newArray: LocationInfo[]) => void;
  setPreferredRDLoc: (newArray: (LocationInfo | null)[]) => void;
  setPreferredGELoc: (newArray: LocationInfo[]) => void;
  setPreferredRELoc: (newArray: (LocationInfo | null)[]) => void;
  setPreferredEELoc: (newArray: LocationInfo[]) => void;

  showClosest: boolean;
  setShowClosest: (toggle: boolean) => void;

  isRecyclableSelected: boolean;
}

const recyclableColor = "#00FF00";
const donatableColor = "#FC2BA1";
const ewasteColor = "#FFC300";

const MAPBOX_TOKEN = process.env.MAPBOX_TOKEN;

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

export default function MapLocations({
  goodDonatables,
  repairDonatables,
  goodEwaste,
  repairEwaste,
  ebinEwaste,
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
  userLocation,
  setUserLocation,
  closestBBLoc,
  setClosestBBLoc,
  setPreferredGDLoc,
  setPreferredRDLoc,
  setPreferredGELoc,
  setPreferredRELoc,
  setPreferredEELoc,
  showClosest,
  setShowClosest,
  isRecyclableSelected,
}: Props) {
  ////////// States to save the location information for every result item
  const [BBLocations, setBBLocations] = useState<LocationInfo[]>([]);
  const [GDLocations, setGDLocations] = useState<LocationInfo[][]>([]);
  const [RDLocations, setRDLocations] = useState<LocationInfo[][]>([]);
  const [GELocations, setGELocations] = useState<LocationInfo[][]>([]);
  const [RELocations, setRELocations] = useState<LocationInfo[][]>([]);
  const [EELocations, setEELocations] = useState<LocationInfo[][]>([]);

  ////////// States the save the closest location for every result item
  const [closestGDLoc, setClosestGDLoc] = useState<LocationInfo[]>([]);
  const [closestRDLoc, setClosestRDLoc] = useState<(LocationInfo | null)[]>([]);
  const [closestGELoc, setClosestGELoc] = useState<LocationInfo[]>([]);
  const [closestRELoc, setClosestRELoc] = useState<(LocationInfo | null)[]>([]);
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
                    key: `donateLoc${location["donateLoc_id"]}`,
                    locationType: "donate",
                    item: isEwasteItem
                      ? goodEwaste[i]["ewaste_type"]
                      : goodDonatables[i]["donatable_type"],
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
              key: `repairLoc${location["repair_id"]}`,
              locationType: "repair",
              item: isEwasteItem
                ? repairEwaste[i]["ewaste_type"]
                : repairDonatables[i]["donatable_type"],
              name: location["center_name"],
              address: location["stall_number"],
              contact: "No contact available",
              lat: location["latitude"],
              lng: location["longitude"],
            };
            return locationInfo;
          });
        })
        // .filter((result: LocationInfo[]) => result.length != 0)
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
          key: bluebin["bluebin_id"].toString(),
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
                key: `ebin${location["ebinLoc_id"]}`,
                locationType: "ebin",
                item: ebinEwaste[i]["ewaste_type"],
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
     * Helper function to get the 1 closest location to the user given a non-empty list
     * of locations.
     * @param itemLocations - Non-empty list of locations
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

    /**
     * HashMap for keeping track of all closest locations with merged item names.
     * Allows for merging to be done in O(n) time & space instead of O(n^2) time
     * & O(n) space.
     */
    let mergedLocs: Map<string, LocationInfo> = new Map<string, LocationInfo>();

    /**
     * Helper function to get all closest locations for every item type, such that
     * locations with the same coordinates but different items are merged into a
     * single LocationInfo object with concatenated item names.
     * Item types accepted here are GD/GE/EE items, because they all have at least 1
     * result location and hence a non-null closest location.
     * @param allItemLocations - Result locations for GE/GE/EE
     * @returns {LocationInfo[]} - Closest merged locations for GE/GE/EE
     */
    function getClosestWithMerge(allItemLocations: LocationInfo[][]) {
      return allItemLocations.map((itemLocations: LocationInfo[]) => {
        return merge(closestLocation(itemLocations, userLocation));
      });
    }

    /**
     * Same as getClosestWithMerge() but allows for null closest locations, in
     * particular for RD/RE items which may have 0 result locations and hence
     * no closest locations.
     * @param allItemLocations - Result locations for RD/RE
     * @returns {(LocationInfo | null)[]} - Nullable closest merged locations for RD/RE
     */
    function getClosestWithMergeNullable(allItemLocations: LocationInfo[][]) {
      return allItemLocations.map((itemLocations: LocationInfo[]) => {
        if (itemLocations.length === 0) return null;
        return merge(closestLocation(itemLocations, userLocation));
      });
    }

    /**
     * Helper function to merge the different items accepted by the same
     * closest location.
     * @param loc - LocationInfo object to be merged if another LocationInfo
     *      object with the same coordinates already exists
     * @returns {LocationInfo} - Merged LocationInfo object
     */
    function merge(loc: LocationInfo) {
      if (!mergedLocs.has(loc["key"])) {
        // If same closest location doesn't
        mergedLocs.set(loc["key"], loc); // exist yet, don't need to merge
        return loc;
      } // Else if same location already exists, merge the item names
      const mergedLoc = mergedLocs.get(loc["key"]);
      if (mergedLoc === undefined) return loc; // guard for get()'s | undefined
      mergedLoc.item = mergedLoc.item + ", " + loc["item"];
      return mergedLoc;
    }

    const closestBluebinLoc = closestLocation(BBLocations, userLocation);
    const closestGDLoc = getClosestWithMerge(GDLocations);
    const closestRDLoc = getClosestWithMergeNullable(RDLocations);
    const closestGELoc = getClosestWithMerge(GELocations);
    const closestRELoc = getClosestWithMergeNullable(RELocations);
    const closestEELoc = getClosestWithMerge(EELocations);

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

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "75%",
      }}
    >
      <MainMap
        initialViewState={{
          latitude: 1.36,
          longitude: 103.803,
          zoom: 10.5,
        }}
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
        }}
        mapStyle="mapbox://styles/mapbox/streets-v9"
        mapboxAccessToken={MAPBOX_TOKEN}
      >
        <GeocoderControl
          mapboxAccessToken={MAPBOX_TOKEN}
          position="top-left"
          getClosestLocations={getClosestLocations}
        />
        {isRecyclableSelected && showClosest && closestBBLoc != null && (
          <Marker
            latitude={closestBBLoc.lat}
            longitude={closestBBLoc.lng}
            onClick={() => setActiveMarker(closestBBLoc)}
          >
            <div style={{ position: "relative" }}>
              <RecyclingIcon
                sx={{
                  backgroundColor: recyclableColor,
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
                bluebin
              </Typography>
            </div>
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
              <h3 style={{ margin: 0 }}>{activeMarker.name}</h3>
              <p>For {activeMarker.item}</p>
              <p>{activeMarker.address}</p>
              <p>{activeMarker.contact}</p>
              {activeMarker.contact.includes("@") && (
                <ContactEmailButton activeMarker={activeMarker} />
              )}
            </div>
          </Popup>
        )}
      </MainMap>
      <div
        style={{
          margin: 0,
          width: "15%",
          minWidth: 80,
          maxWidth: 100,
          position: "absolute",
          top: "3rem",
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
