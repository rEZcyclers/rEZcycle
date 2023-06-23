import { Button } from "@mui/material";
import { useState } from "react";
import Map, { Marker, Popup } from "react-map-gl";
import {
  DonatableItem,
  DonateLocation,
  DonateOrganisation,
  EWasteItem,
  RepairLocation,
} from "../DataTypes";

interface LocationCoordinates {
  latitude: number;
  longitude: number;
}
interface LocationInfo {
  address: string;
  organisationName: string;
  contact: string;
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
}

const MAPBOX_TOKEN =
  "pk.eyJ1IjoiaWFuNDQ0NCIsImEiOiJjbGhpeTVrMjcwY253M2RwNThlY2wzMWJ6In0.f3cyuNBJ5dmOBt-JTI6iCw"; // Set your mapbox token here

const geocodeAddress = async (address: string) => {
  const response = await fetch(
    `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
      address
    )}.json?access_token=${MAPBOX_TOKEN}`
  );
  const data = await response.json();
  return data.features[0];
};

// const Locations = ({ locations }: { locations: Location[] }) => {
const Locations = (props: Props) => {
  // const addresses: string[] = [
  //   "136 Joo Seng Road, #01-01",
  //   "710A Ang Mo Kio Avenue 8, #01-2625",
  //   "133 New Bridge Road, Chinatown Point #B1-07",
  //   "135 Jurong Gateway Road, #01-315",
  // ];
  const locationInfoList: LocationInfo[] = props.goodDonatablesResults.flatMap(
    (itemRes: DonateOrganisationLocations[]) => {
      return itemRes.flatMap((entry: DonateOrganisationLocations) => {
        const org: DonateOrganisation = entry["donateOrg"];
        const locations: DonateLocation[] = entry["donateLocations"];
        return locations.flatMap((loc: DonateLocation) => {
          const locInfo: LocationInfo = {
            address: loc["address"],
            organisationName: org["organisation_name"],
            contact: loc["contact"],
          };
          return locInfo;
        });
      });
    }
  );

  const [locationCoordList, setLocationCoordList] = useState<
    LocationCoordinates[]
  >([]);
  const [activeMarker, setActiveMarker] = useState<number>(-1);

  const handleMarkerClick = (marker: number) => {
    setActiveMarker(marker);
  };

  const handlePopupClose = () => {
    setActiveMarker(-1);
  };

  const handleButtonClick = () => {
    const promises = locationInfoList.map((locInfo: LocationInfo) =>
      geocodeAddress(locInfo["address"])
    );

    Promise.all(promises)
      .then((results) => {
        const newLocations = results.map((data) => ({
          latitude: data.center[1],
          longitude: data.center[0],
        }));
        setLocationCoordList(newLocations);
        console.log(newLocations);
      })
      .catch((error) => {
        console.error("Geocoding request failed:", error);
      });
  };

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
        {locationCoordList.map((coord, index) => (
          <Marker
            longitude={coord.longitude}
            latitude={coord.latitude}
            color="black"
            onClick={() => handleMarkerClick(index)}
          >
            {/* <button
              className="marker-button"
              onClick={() => handleMarkerClick(marker)}
            ></button> */}
          </Marker>
        ))}

        {activeMarker != -1 && (
          <Popup
            longitude={locationCoordList[activeMarker].longitude}
            latitude={locationCoordList[activeMarker].latitude}
            onClose={handlePopupClose}
            closeButton={true}
            closeOnClick={false}
            anchor="top"
          >
            <div>
              <h3>{locationInfoList[activeMarker]["organisationName"]}</h3>
              <p>{locationInfoList[activeMarker]["address"]}</p>
              <p>Contact: {locationInfoList[activeMarker]["contact"]}</p>
              <p>Latitude: {locationCoordList[activeMarker].latitude}</p>
              <p>Longitude: {locationCoordList[activeMarker].longitude}</p>
            </div>
          </Popup>
        )}
      </Map>
      <Button variant="contained" color="primary" onClick={handleButtonClick}>
        Geocode
      </Button>
    </>
  );
};

export default Locations;
