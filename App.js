import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import MarkerForm from "./components/markerForm";
import Sidebar from "./components/sidebar";
import "leaflet/dist/leaflet.css";
import Hienthi from "./components/map";
import { themMarker, fetchMarker  } from "./store/markerslice";

export default function App() {
  const dispatch = useDispatch();
  const markersFromRedux = useSelector((state) => state.markers.list);


  useEffect(() => {
    dispatch(fetchMarker()); 
  }, [dispatch]);
  const [newMarker, setNewMarkers] = useState(null);
  const [formData, setFormData] = useState({ name: "", desc: "", iconSrc: "" });

  const Xuly = async (e) => {
    e.preventDefault();
    if (!newMarker) return;

    const markerData = {
      geocode: [newMarker.lat, newMarker.lng],
      popup: `${formData.name}: ${formData.desc}`, 
      iconSrc: formData.iconSrc || "/img/marker-icon.png",
      name: formData.name,
      desc: formData.desc,
    };

    
      dispatch(themMarker(markerData));
   

    setNewMarkers(null);
    setFormData({ name: "", desc: "", iconSrc: "" });
  };

  const handleDrop = (latlng, icon) => {
    setNewMarkers({ lat: latlng.lat, lng: latlng.lng });
    setFormData({ name: "", desc: "", iconSrc: icon.src });
  };

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <div style={{ flex: 1 }}>
        <Hienthi onDrop={handleDrop} />
      </div>
      {newMarker && (
        <MarkerForm
          newMarker={newMarker}
          formData={formData}
          setFormData={setFormData}
          Xuly={Xuly}
        />
      )}
    </div>
  );
}
