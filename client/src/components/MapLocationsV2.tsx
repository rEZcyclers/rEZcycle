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
import GeocoderControlV2 from "./GeocoderControlV2";

interface Props {
  // 'Show on Map' button states for every result item
  showBluebin: boolean;
  showGDPins: boolean[];
  showRDPins: boolean[];
  showGEPins: boolean[];
  showREPins: boolean[];
  showEwastePins: boolean[];

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

function MapLocationsV2({
  showBluebin,
  showGDPins,
  showRDPins,
  showGEPins,
  showREPins,
  showEwastePins,
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
  const [BBLocations, setBBLocations] = useState<LocationInfo[]>([]);
  const [GDLocations, setGDLocations] = useState<LocationInfo[][]>([]);
  const [RDLocations, setRDLocations] = useState<LocationInfo[][]>([]);
  const [GELocations, setGELocations] = useState<LocationInfo[][]>([]);
  const [RELocations, setRELocations] = useState<LocationInfo[][]>([]);
  const [EELocations, setEELocations] = useState<LocationInfo[][]>([]);

  const [closestBluebinLoc, setClosestBluebinLoc] =
    useState<LocationInfo | null>(null);
  const [closestGDLoc, setClosestGDLoc] = useState<LocationInfo[]>([]);
  const [closestRDLoc, setClosestRDLoc] = useState<LocationInfo[]>([]);
  const [closestGELoc, setClosestGELoc] = useState<LocationInfo[]>([]);
  const [closestRELoc, setClosestRELoc] = useState<LocationInfo[]>([]);
  const [closestEELoc, setClosestEELoc] = useState<LocationInfo[]>([]);

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

  function getLocations() {
    setBBLocations(
      // Convert to LocationInfo for compatibility in finding nearest location
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
    setGDLocations(
      goodDonatablesResults.map(
        // For each selected good donatable item, create a list of LocationInfo
        (item: DonateOrganisationLocations[]) => {
          // For each organisation that accepts the selected good donatable item, transform it to a flat list of LocationInfo
          return item.flatMap((organisation: DonateOrganisationLocations) => {
            const locations: DonateLocation[] = organisation["donateLocations"];
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
          });
        }
      )
    );
    setRDLocations(
      repairDonatablesResults.map(
        // For each selected repairable donatable item, create a list of LocationInfo
        (item: RepairLocation[]) => {
          // For each repair location that accepts the selected repairable donatable item, transform it to data of type LocationInfo
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
        }
      )
    );
    setGELocations(
      goodEwasteResults.map(
        // For each selected good donatable item, create a list of donateLocations
        (item: DonateOrganisationLocations[]) => {
          // For each organisation that accepts the selected good donatable item, transform it to a flat list of LocationInfo
          return item.flatMap((organisation: DonateOrganisationLocations) => {
            const locations: DonateLocation[] = organisation["donateLocations"];
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
          });
        }
      )
    );
    setRELocations(
      repairEwasteResults.map(
        // For each selected repairable donatable item, create a list of LocationInfo
        (item: RepairLocation[]) => {
          // For each repair location that accepts the selected repairable donatable item, transform it to data of type LocationInfo
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
        }
      )
    );
    setEELocations(
      ebinEwasteResults.map(
        // For each selected ewaste item, create a list of LocationInfo
        (item: EbinLocations[]) => {
          // For each ebin type that accepts the selected eWaste item, transform it to a flat list of LocationInfo
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

  useEffect(getLocations, []);

  function getClosestLocations(userLocation: number[]) {
    console.log("getClosesetLocations() called!");
    setUserLocation(userLocation); // This line will pass too quickly such that
    // the userLocation state hasn't been set by the time we call closestLocation(),
    // hence just pass in userLocation into closestLocation() instead of using the
    // state which is not yet available
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
    setClosestBluebinLoc(closestBluebinLoc);
    setClosestGDLoc(closestGDLoc);
    setClosestRDLoc(closestRDLoc);
    setClosestGELoc(closestGELoc);
    setClosestRELoc(closestRELoc);
    setClosestEELoc(closestEELoc);
    setPreferredGDLocations(closestGDLoc);
    setPreferredRDLocations(closestRDLoc);
    setPreferredGELocations(closestGELoc);
    setPreferredRELocations(closestRELoc);
    setPreferredEELocations(closestEELoc);
  }

  function closestLocation(
    itemLocations: LocationInfo[],
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
        <GeocoderControlV2
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
        {showGDPins
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
          })}
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

export default MapLocationsV2;
