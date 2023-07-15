import { useEffect, useState } from "react";
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
  // 'Show on Map' button states for every result item
  showBluebin: boolean;
  showGDMarkers: boolean[];
  showRDMarkers: boolean[];
  showGEMarkers: boolean[];
  showREMarkers: boolean[];
  showEEMarkers: boolean[];

  bluebinsData: Bluebin[]; // List of bluebin locations
  goodDonatablesResults: DonateOrganisationLocations[][]; // List of donateOrganisations & their locations for every selected good donatable
  repairDonatablesResults: RepairLocation[][]; // List of repairLocations for every selected repairable donatable
  goodEwasteResults: DonateOrganisationLocations[][]; // List of donateLocations & their locations for every selected good Ewaste
  repairEwasteResults: RepairLocation[][]; // List of repairLocations for every selected repairable Ewaste
  ebinEwasteResults: EbinLocations[][]; // List of ebins & their locations for every selected ebin Ewaste

  setPreferredGDLocations: (newArray: LocationInfo[]) => void;
  setPreferredRDLocations: (newArray: LocationInfo[]) => void;
  setPreferredGELocations: (newArray: LocationInfo[]) => void;
  setPreferredRELocations: (newArray: LocationInfo[]) => void;
  setPreferredEELocations: (newArray: LocationInfo[]) => void;

  onlyShowClosest: boolean;
  setOnlyShowClosest: (toggle: boolean) => void;
}

const recyclableColor = "#00FF00";
const donatableColor = "#FC2BA1";
const ewasteColor = "#FFC300";

const MAPBOX_TOKEN =
  "pk.eyJ1IjoiaWFuNDQ0NCIsImEiOiJjbGhpeTVrMjcwY253M2RwNThlY2wzMWJ6In0.f3cyuNBJ5dmOBt-JTI6iCw";

// Function to calculate the distance between two coordinates using the Haversine formula
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const earthRadius = 6371; // Earth's radius in kilometers

  // Helper function to convert degrees to radians
  function toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
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
  setPreferredGDLocations,
  setPreferredRDLocations,
  setPreferredGELocations,
  setPreferredRELocations,
  setPreferredEELocations,
  onlyShowClosest,
  setOnlyShowClosest,
}: Props) {
  ////////// States to save the location information for every result item
  const [BBLocations, setBBLocations] = useState<LocationInfo[]>([]);
  const [GDLocations, setGDLocations] = useState<LocationInfo[][]>([]);
  const [RDLocations, setRDLocations] = useState<LocationInfo[][]>([]);
  const [GELocations, setGELocations] = useState<LocationInfo[][]>([]);
  const [RELocations, setRELocations] = useState<LocationInfo[][]>([]);
  const [EELocations, setEELocations] = useState<LocationInfo[][]>([]);

  ////////// States the save the closest location for every result item
  const [closestBluebinLoc, setClosestBluebinLoc] =
    useState<LocationInfo | null>(null);
  const [closestGDLoc, setClosestGDLoc] = useState<LocationInfo[]>([]);
  const [closestRDLoc, setClosestRDLoc] = useState<LocationInfo[]>([]);
  const [closestGELoc, setClosestGELoc] = useState<LocationInfo[]>([]);
  const [closestRELoc, setClosestRELoc] = useState<LocationInfo[]>([]);
  const [closestEELoc, setClosestEELoc] = useState<LocationInfo[]>([]);

  ////////// User States for marker popup, user location & error alert
  const [activeMarker, setActiveMarker] = useState<LocationInfo | null>(null);
  const [userLocation, setUserLocation] = useState<number[] | null>(null);
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
   * to render all of their associated location markers on the map.
   */
  function getLocations() {
    /**
     * Helper function to get the location info specific to good condition items.
     * @param goodResults - Results for good condition items
     * @param setDonateLocations - Sets the donate location info for these items
     */
    function getDonateLocations(
      goodResults: DonateOrganisationLocations[][],
      setDonateLocations: (newArray: LocationInfo[][]) => void
    ) {
      setDonateLocations(
        goodResults.map(
          // For each good condition item's result, map it to a LocationInfo[]
          (itemResult: DonateOrganisationLocations[]) => {
            // For each result, flatmap all organisations into a single LocationInfo[]
            return itemResult.flatMap(
              (organisation: DonateOrganisationLocations) => {
                const locations: DonateLocation[] =
                  organisation["donateLocations"];
                return locations.map((location: DonateLocation) => {
                  const locationInfo: LocationInfo = {
                    locationType: "donate",
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
     */
    function getRepairLocations(
      repairResults: RepairLocation[][],
      setRepairLocations: (newArray: LocationInfo[][]) => void
    ) {
      setRepairLocations(
        repairResults.map((item: RepairLocation[]) => {
          // For each repairable item's result, map it to a LocationInfo[]
          return item.map((location: RepairLocation) => {
            const locationInfo: LocationInfo = {
              locationType: "repair",
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
    getDonateLocations(goodDonatablesResults, setGDLocations);
    getDonateLocations(goodEwasteResults, setGELocations);
    getRepairLocations(repairDonatablesResults, setRDLocations);
    getRepairLocations(repairEwasteResults, setRELocations);

    // Special case: Bluebins
    setBBLocations(
      // Map each Bluebin to a LocationInfo for finding nearest bluebin later on
      bluebinsData.map((bluebin: Bluebin) => {
        const locationInfo: LocationInfo = {
          locationType: "bluebin",
          name: "bluebin",
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
        (item: EbinLocations[]) => {
          // For each result, flatmap all ebins into a single LocationInfo[]
          return item.flatMap((ebinInfo: EbinLocations) => {
            const ebin: Ebin = ebinInfo["ebin"];
            const locations: EbinLocation[] = ebinInfo["ebinLocations"];
            return locations.map((location: EbinLocation) => {
              const locationInfo: LocationInfo = {
                locationType: "ebin",
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

  useEffect(getLocations, []); // Only getLocations() once (upon initialisation)

  /** ////////// Start of getClosestLocations() //////////
   * Gets the closest location for every result item relative to the user's location.
   * @param userLocation - Coordinates of the user's input address
   */
  function getClosestLocations(userLocation: number[]) {
    console.log("getClosesetLocations() called!");
    setUserLocation(userLocation); // This line will pass too quickly such that
    // the userLocation state hasn't been set by the time closestLocation() is called,
    // hence just pass userLocation in as another param into closestLocation() since
    // we're unable to use the state which is not yet available

    /**
     * Helper function to get the 1 closest location given a list of locations
     * @param itemLocations - List of locations
     * @param userLocation - Distance is relative to user location
     * @returns {LocationInfo}
     */
    function closestLocation( // Helper function to get the 1 closest location from
      itemLocations: LocationInfo[], // a list of locations
      userLocation: number[]
    ) {
      let closestDistToUser = Infinity;
      let closestLocation = itemLocations[0];
      for (const location of itemLocations) {
        const distToUser = calculateDistance(
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
    // Then save all closest locations in this component's state
    setClosestBluebinLoc(closestBluebinLoc);
    setClosestGDLoc(closestGDLoc);
    setClosestRDLoc(closestRDLoc);
    setClosestGELoc(closestGELoc);
    setClosestRELoc(closestRELoc);
    setClosestEELoc(closestEELoc);
    // Also set the closest locations as user's preferred locations initially
    setPreferredGDLocations(closestGDLoc);
    setPreferredRDLocations(closestRDLoc);
    setPreferredGELocations(closestGELoc);
    setPreferredRELocations(closestRELoc);
    setPreferredEELocations(closestEELoc);
  }
  ////////// End of getClosestLocations() //////////

  /* Markers to render for different types of result items: 
   - Good Donatables (GD)
   - Repair Donatables (RD)
   - Good Ewaste (GE)
   - Repair Ewaste (RE)
   - Ebin Ewaste (EE)
   */
  const markersToRender = [
    {
      itemMarkersToShow: showGDMarkers, // GD
      closestLocList: closestGDLoc,
      allLocations: GDLocations,
      markerColor: donatableColor,
      markerStyle: null,
    },
    {
      itemMarkersToShow: showRDMarkers, // RD
      closestLocList: closestRDLoc,
      allLocations: RDLocations,
      markerColor: donatableColor,
      markerStyle: <BuildIcon sx={{ color: donatableColor }} />,
    },
    {
      itemMarkersToShow: showGEMarkers, // GE
      closestLocList: closestGELoc,
      allLocations: GELocations,
      markerColor: ewasteColor,
      markerStyle: null,
    },
    {
      itemMarkersToShow: showREMarkers, // RE
      closestLocList: closestRELoc,
      allLocations: RELocations,
      markerColor: ewasteColor,
      markerStyle: <BuildIcon sx={{ color: ewasteColor }} />,
    },
    {
      itemMarkersToShow: showEEMarkers, // EE
      closestLocList: closestEELoc,
      allLocations: EELocations,
      markerColor: ewasteColor,
      markerStyle: (
        <RecyclingIcon
          style={{
            backgroundColor: ewasteColor,
            color: "white",
            border: "1px solid white",
            borderRadius: 10,
          }}
        />
      ),
    },
  ];

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
        {showBluebin && closestBluebinLoc != null && (
          <Marker
            latitude={closestBluebinLoc.lat}
            longitude={closestBluebinLoc.lng}
            color={recyclableColor}
            onClick={() => setActiveMarker(closestBluebinLoc)}
          />
        )}
        {markersToRender.map((params) => (
          <MarkerRenderer
            itemMarkersToShow={params.itemMarkersToShow}
            closestLocList={params.closestLocList}
            allLocations={params.allLocations}
            markerColor={params.markerColor}
            markerStyle={params.markerStyle}
            onlyShowClosest={onlyShowClosest}
            setActiveMarker={setActiveMarker}
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
              <h3>{activeMarker?.name}</h3>
              <p>{activeMarker?.address}</p>
              <p>{activeMarker?.contact}</p>
            </div>
          </Popup>
        )}
      </Map>
      <div
        style={{
          margin: 0,
          width: "15%",
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
              checked={onlyShowClosest}
              onChange={() => {
                if (userLocation === null) {
                  setShowAlert(true);
                  return;
                }
                setShowAlert(false);
                setOnlyShowClosest(!onlyShowClosest);
              }}
              color="secondary"
              size="medium"
            />
          }
          label={
            <Typography fontSize={14} color={"black"}>
              {onlyShowClosest
                ? "Showing only closest places"
                : "Show only closest places"}
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