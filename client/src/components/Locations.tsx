import Map, { Marker } from "react-map-gl";

interface Location {
  latitude: number;
  longitude: number;
  name: string;
}

const MAPBOX_TOKEN =
  "pk.eyJ1IjoiaWFuNDQ0NCIsImEiOiJjbGhpeTVrMjcwY253M2RwNThlY2wzMWJ6In0.f3cyuNBJ5dmOBt-JTI6iCw"; // Set your mapbox token here

const Locations = ({ locations }: { locations: Location[] }) => {
  const markers = locations.map((location) => ({
    lat: location.latitude,
    lng: location.longitude,
    title: location.name,
  }));
  // 1.3604579037801638, 103.80362783702498
  return (
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
      {markers.map((marker) => (
        <Marker longitude={marker.lng} latitude={marker.lat} />
      ))}
    </Map>
  );
};

export default Locations;
