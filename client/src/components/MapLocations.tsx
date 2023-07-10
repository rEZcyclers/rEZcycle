import { useState } from "react";
import Map, { Marker, Popup } from "react-map-gl";
import {
  DonateLocation,
  RepairLocation,
  DonateOrganisationLocations,
  EbinLocations,
  EbinLocation,
  Ebin,
} from "../DataTypes";
import BuildIcon from "@mui/icons-material/Build";
import RecyclingIcon from "@mui/icons-material/Recycling";

interface Props {
  showGDPins: boolean[];
  showRDPins: boolean[];
  showGEPins: boolean[];
  showREPins: boolean[];
  showEwastePins: boolean[];

  goodDonatablesResults: DonateOrganisationLocations[][]; // List of donateOrganisations & their locations for every selected good donatable
  repairDonatablesResults: RepairLocation[][]; // List of repairLocations for every selected repairable donatable
  goodEwasteResults: DonateOrganisationLocations[][]; // List of donateLocations & their locations for every selected good Ewaste
  repairEwasteResults: RepairLocation[][]; // List of repairLocations for every selected repairable Ewaste
  ewasteEbinResults: EbinLocations[][];
}

const donatableColor = "#FC2BA1";
const ewasteColor = "#FFC300";

const MAPBOX_TOKEN =
  "pk.eyJ1IjoiaWFuNDQ0NCIsImEiOiJjbGhpeTVrMjcwY253M2RwNThlY2wzMWJ6In0.f3cyuNBJ5dmOBt-JTI6iCw";

type LocationInfo = {
  locationType: string;
  name: string;
  address: string;
  contact: string;
  lat: number;
  lng: number;
};

function MapLocations({
  showGDPins,
  showRDPins,
  showGEPins,
  showREPins,
  showEwastePins,
  goodDonatablesResults,
  repairDonatablesResults,
  goodEwasteResults,
  repairEwasteResults,
  ewasteEbinResults,
}: Props) {
  let GDLocations: LocationInfo[][] = [];
  let RDLocations: LocationInfo[][] = [];
  let GELocations: LocationInfo[][] = [];
  let RELocations: LocationInfo[][] = [];
  let EELocations: LocationInfo[][] = [];

  const [activeMarker, setActiveMarker] = useState<LocationInfo | null>(null);

  function getLocations() {
    GDLocations = goodDonatablesResults.map(
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
    );
    RDLocations = repairDonatablesResults.map(
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
    );
    GELocations = goodEwasteResults.map(
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
    );
    RELocations = repairEwasteResults.map(
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
    );
    EELocations = ewasteEbinResults.map(
      // For each selected ewaste item, create a list of LocationInfo
      (item: EbinLocations[]) => {
        // For each organisation that accepts the selected good donatable item, transform it to a flat list of LocationInfo
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
    );
  }

  getLocations();

  return (
    <Map
      initialViewState={{
        latitude: 1.36,
        longitude: 103.803,
        zoom: 10.5,
      }}
      style={{ position: "relative", width: "90%", height: "60%" }}
      mapStyle="mapbox://styles/mapbox/streets-v9"
      mapboxAccessToken={MAPBOX_TOKEN}
    >
      {showGDPins
        .map((sel, i) => (sel ? i : -1))
        .filter((i) => i != -1)
        .map((i) => {
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
        })}
      {showRDPins
        .map((sel, i) => (sel ? i : -1))
        .filter((i) => i != -1)
        .map((i) => {
          const locations: LocationInfo[] = RDLocations[i];
          return (
            <>
              {locations.map((location: LocationInfo) => {
                return (
                  <Marker
                    latitude={location.lat}
                    longitude={location.lng}
                    children={<BuildIcon sx={{ color: donatableColor }} />}
                    onClick={() => setActiveMarker(location)}
                  />
                );
              })}
            </>
          );
        })}
      {showGEPins
        .map((sel, i) => (sel ? i : -1))
        .filter((i) => i != -1)
        .map((i) => {
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
        })}
      {showREPins
        .map((sel, i) => (sel ? i : -1))
        .filter((i) => i != -1)
        .map((i) => {
          const locations: LocationInfo[] = RELocations[i];
          return (
            <>
              {locations.map((location: LocationInfo) => {
                return (
                  <Marker
                    latitude={location.lat}
                    longitude={location.lng}
                    children={<BuildIcon sx={{ color: ewasteColor }} />}
                    onClick={() => setActiveMarker(location)}
                  />
                );
              })}
            </>
          );
        })}
      {showEwastePins
        .map((sel, i) => (sel ? i : -1))
        .filter((i) => i != -1)
        .map((i) => {
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
  );
}

export default MapLocations;
