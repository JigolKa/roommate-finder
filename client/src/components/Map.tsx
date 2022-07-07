import {
 MapContainer,
 Marker,
 Popup,
 TileLayer,
 MapContainerProps,
} from "react-leaflet";
import L from "leaflet";
import { useEffect } from "react";

export default function Map() {
 const MAP_TILE = L.tileLayer(
  `https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`,
  {
   attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }
 );
 const mapParams = {
  zoom: 3,
  zoomControl: false,
  maxBounds: L.latLngBounds(L.latLng(-150, -240), L.latLng(150, 240)),
  layers: [MAP_TILE],
 };

 // This useEffect hook runs when the component is first mounted,
 // similar to componentDidMount() lifecycle method of class-based
 // components:
 useEffect(() => {
  const map = L.map("map", mapParams);
 }, []);

 // Define the styles that are to be passed to the map instance:
 const mapStyles = {
  overflow: "hidden",
  width: "100%",
  height: "100vh",
 };

 return (
  <div>
   <div id="map" style={mapStyles} />
  </div>
 );
}
