//app.js
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Login from "./components/login";
import Hienthi from "./components/map";
import Sidebar from "./components/sidebar";
import MarkerForm from "./components/markerForm";
import { fetchMarker, themMarker } from "./store/markerslice";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import AddItemModal from "./components/AddItemModal";

export default function App() {
  const dispatch = useDispatch();
  const markersFromRedux = useSelector((state) => state.markers.list ?? []);
  const { user, isAuthenticated } = useSelector((s) => s.auth);
  const [openAdd, setOpenAdd] = useState(false);
  const [newMarker, setNewMarkers] = useState(null);
  const [formData, setFormData] = useState({
    idUnit: "",
    name: "",
    desc: "",
    iconSrc: "",
    amount: 0,
    item: "",
  });
const [globalItems, setGlobalItems] = useState([]);

  useEffect(() => {
    if (user) {
      dispatch(fetchMarker());
    }
  }, [dispatch, user]);

  const Xuly = async (e) => {
    e.preventDefault();
    if (!newMarker) return;

      const markerData = {
        idUnit: formData.idUnit,
        geocode: [newMarker.lat, newMarker.lng],
        name: formData.name,
        desc: formData.desc,
        iconSrc: formData.iconSrc || "/img/marker-icon.png",
        // prefer items array if present
        items: Array.isArray(formData.items) ? formData.items.map(it => ({ name: it.name, qty: Number(it.qty) || 0 })) : undefined,
        // backward-compatible fields (server accepts them too)
        item: Array.isArray(formData.items) && formData.items[0] ? formData.items[0].name : (formData.item || null),
        amount: Array.isArray(formData.items) ? (formData.items.reduce((s, it) => s + (Number(it.qty)||0), 0)) : (parseInt(formData.amount) || 0),
      };



    try {
      await dispatch(themMarker(markerData)).unwrap();
      setNewMarkers(null);
      setFormData({ idUnit: "", name: "", desc: "", iconSrc: "", amount: 0, item: "" });
    } catch (err) {
      alert("Thêm marker thất bại: " + (err?.message || err));
    }
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
          idUnit: "",
          name: "",
          desc: "",
          iconSrc: icon.src || "/img/marker-icon.png",
          amount: 0,
          item: "",
        });
      } catch (err) {
        console.error("Error snapping to road:", err);
        setNewMarkers({ lat: latlng.lat, lng: latlng.lng });
        setFormData({
          idUnit: "",
          name: "",
          desc: "",
          iconSrc: icon.src || "/img/marker-icon.png",
          amount: 0,
          item: "",
        });
      }
    })();
  };

  if (!user) return <Login />;

  return (
    <div style={{ display: "flex", width: "100%", height: "100vh" }}>
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
            globalItems={globalItems}
          />
        )}

        <AddItemModal
  open={openAdd}
  onClose={() => setOpenAdd(false)}
  onAdded={(item) => setGlobalItems((prev) => [...prev, item])}
/>
      </div>
    </div>
  );
}