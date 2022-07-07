import { useState, useCallback } from "react";
import Map, { Marker, NavigationControl } from "react-map-gl";

import Pin from "../components/Pin";

import type { MarkerDragEvent } from "react-map-gl";

const TOKEN =
 "pk.eyJ1Ijoiamlnb2xrYSIsImEiOiJjbDRvMXJsdWcwM2UwM2tuNXJteTZteWxiIn0.RrTZPBeUmMvYxLBe5L6wvg"; // Set your mapbox token here

const initialViewState = {
 latitude: 40,
 longitude: -100,
 zoom: 3.5,
};

export default function App() {
 const [marker, setMarker] = useState({
  latitude: 40,
  longitude: -100,
 });

 const onMarkerDrag = useCallback((event: MarkerDragEvent) => {
  setMarker({
   longitude: event.lngLat.lng,
   latitude: event.lngLat.lat,
  });
 }, []);

 return (
  <>
   <Map
    initialViewState={initialViewState}
    mapStyle="mapbox://styles/mapbox/dark-v9"
    mapboxAccessToken={TOKEN}
    style={{ height: "100vh" }}
   >
    <Marker
     longitude={marker.longitude}
     latitude={marker.latitude}
     anchor="bottom"
     draggable
     onDrag={onMarkerDrag}
    >
     <Pin size={20} />
    </Marker>

    <NavigationControl />
   </Map>
  </>
 );
}
