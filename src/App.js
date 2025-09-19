import { useEffect, useState } from "react";
import "./App.css";
import "leaflet/dist/leaflet.css";
import { Icon } from "leaflet";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

export default function App() {
  const [markers, setMarkers] = useState([]);

  const customIcon = new Icon({
    iconUrl: require("./img/marker-icon.png"),
    iconSize: [38, 38],
  });

  useEffect(() => {
    fetch("http://localhost:5000/api/markers")
      .then((res) => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then((data) => {
        console.log("Markers data:", data); // Debug dữ liệu
        setMarkers(data);
      })
      .catch((err) => console.error("Fetch error:", err));
  }, []);

  return (
    <MapContainer
      center={[21.028511, 105.804817]}
      zoom={13}
      style={{ height: "100vh", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {markers.length > 0 ? (
        markers.map((marker, index) => (
          <Marker key={index} position={marker.geocode} icon={customIcon}>
            <Popup>{marker.popup || "No popup content"}</Popup>
          </Marker>
        ))
      ) : (
        <Marker position={[21.028511, 105.804817]} icon={customIcon}>
          <Popup>Test Popup</Popup>
        </Marker>
      )}
    </MapContainer>
  );
}