import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Login from "./components/login";
import Hienthi from "./components/map";
import Sidebar from "./components/sidebar";
import MarkerForm from "./components/markerForm";
import { fetchMarker, themMarker } from "./store/markerslice";  
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export default function App() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth ?? {});
  const markersFromRedux = useSelector((state) => state.markers.list ?? []);

  const [newMarker, setNewMarkers] = useState(null);
  const [formData, setFormData] = useState({ name: "", desc: "", iconSrc: "" });

  useEffect(() => {
    if (user) {
      dispatch(fetchMarker());
    }
  }, [dispatch, user]);

  const Xuly = async (e) => {
    e.preventDefault();
    if (!newMarker) return;

    const markerData = {
      geocode: [newMarker.lat, newMarker.lng],
      popup: `${formData.name}: ${formData.desc}`,
      amount: parseInt(formData.amount) || 0,
      iconSrc: formData.iconSrc || "/img/marker-icon.png",
      name: formData.name,
      desc: formData.desc,
    };

    dispatch(themMarker(markerData));
    setNewMarkers(null);
    setFormData({ name: "", desc: "", iconSrc: "" });
  };

  const handleDrop = (latlng, icon) => {
    const { lat, lng } = latlng;

    (async () => {
      try {
        const response = await fetch(
          `https://router.project-osrm.org/nearest/v1/driving/${lng},${lat}`
        );
        let snappedLatLng = latlng;

        if (response.ok) {
          const data = await response.json();
          if (data.code === "Ok" && data.waypoints?.length > 0) {
            const [snappedLng, snappedLat] = data.waypoints[0].location;
            snappedLatLng = L.latLng(snappedLat, snappedLng);
          }
        }

        setNewMarkers({ lat: snappedLatLng.lat, lng: snappedLatLng.lng });
        setFormData({
          name: "",
          desc: "",
          iconSrc: icon.src || "/img/marker-icon.png",
        });
      } catch (err) {
        console.error("Error snapping to road:", err);
        setNewMarkers({ lat: latlng.lat, lng: latlng.lng });
        setFormData({
          name: "",
          desc: "",
          iconSrc: icon.src || "/img/marker-icon.png",
        });
      }
    })();
  };

  if (!user) return <Login />;

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <Sidebar />
      <div style={{ flex: 1, position: "relative" }}>
        <Hienthi onDrop={handleDrop} currentUser={user} />
        {newMarker && (
          <MarkerForm
            key={`${newMarker.lat}-${newMarker.lng}`}
            newMarker={newMarker}
            formData={formData}
            setFormData={setFormData}
            Xuly={Xuly}
            onCancel={() => setNewMarkers(null)}
          />
        )}
      </div>
    </div>
  );
}