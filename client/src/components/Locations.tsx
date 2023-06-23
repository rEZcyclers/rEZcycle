import { Button } from "@mui/material";
import { useState } from "react";
import Map, { Marker, Popup } from "react-map-gl";

interface Location {
  latitude: number;
  longitude: number;
  name: string;
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
const Locations = () => {
  const addresses: string[] = [
    "136 Joo Seng Road, #01-01",
    "710A Ang Mo Kio Avenue 8, #01-2625",
    "133 New Bridge Road, Chinatown Point #B1-07",
    "135 Jurong Gateway Road, #01-315",
  ];

  const [locations, setLocations] = useState<Location[]>([]);
  const [selectedMarker, setSelectedMarker] = useState<Location | null>(null);

  const handleMarkerClick = (marker: Location) => {
    setSelectedMarker(marker);
  };

  const handlePopupClose = () => {
    setSelectedMarker(null);
  };

  const handleButtonClick = () => {
    const promises = addresses.map((address) => geocodeAddress(address));

    Promise.all(promises)
      .then((results) => {
        const newLocations = results.map((data) => ({
          latitude: data.center[1],
          longitude: data.center[0],
          name: data.place_name,
        }));
        setLocations(newLocations);
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
        {locations.map((marker) => (
          <Marker
            longitude={marker.longitude}
            latitude={marker.latitude}
            color="black"
            onClick={() => handleMarkerClick(marker)}
          >
            {/* <button
              className="marker-button"
              onClick={() => handleMarkerClick(marker)}
            ></button> */}
          </Marker>
        ))}

        {selectedMarker && (
          <Popup
            longitude={selectedMarker.longitude}
            latitude={selectedMarker.latitude}
            onClose={handlePopupClose}
            closeButton={true}
            closeOnClick={false}
            anchor="top"
          >
            <div>
              <h3>{selectedMarker.name}</h3>
              <p>Latitude: {selectedMarker.latitude}</p>
              <p>Longitude: {selectedMarker.longitude}</p>
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
