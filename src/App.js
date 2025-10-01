import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import MarkerForm from "./components/markerForm";
import Sidebar from "./components/sidebar";
import "leaflet/dist/leaflet.css";
import Hienthi from "./components/map";
import { themMarker, fetchMarker, updateMarker  } from "./store/markerslice";

export default function App() {
  const dispatch = useDispatch();
  const markersFromRedux = useSelector((state) => state.markers.list);


//QAM add
const [editingMarker, setEditingMarker] = useState(null);
// 
  useEffect(() => {
    dispatch(fetchMarker()); 
  }, [dispatch]);
  const [newMarker, setNewMarkers] = useState(null);
  const [formData, setFormData] = useState({ name: "", desc: "", iconSrc: "" });

  // const Xuly = async (e) => {
  //   e.preventDefault();
  //   if (!newMarker) return;

  //   const markerData = {
  //     geocode: [newMarker.lat, newMarker.lng],
  //     popup: `${formData.name}: ${formData.desc}`, 
  //     iconSrc: formData.iconSrc || "/img/marker-icon.png",
  //     name: formData.name,
  //     desc: formData.desc,
  //   };

    
  //     dispatch(themMarker(markerData));
   

  //   setNewMarkers(null);
  //   setFormData({ name: "", desc: "", iconSrc: "" });
  // };
  const Xuly = async (e) => {
  e.preventDefault();

  if (editingMarker) {
    // nếu đang sửa
    const updatedData = {
      ...editingMarker,
      popup: `${formData.name}: ${formData.desc}`,
      name: formData.name,
      desc: formData.desc,
      iconSrc: formData.iconSrc || "/img/marker-icon.png",
    };
    dispatch(updateMarker(updatedData));   // gọi PUT
    setEditingMarker(null);
  } 
  else if (newMarker) {
    // nếu đang thêm mới
    const markerData = {
      geocode: [newMarker.lat, newMarker.lng],
      popup: `${formData.name}: ${formData.desc}`,
      iconSrc: formData.iconSrc || "/img/marker-icon.png",
      name: formData.name,
      desc: formData.desc,
    };
    dispatch(themMarker(markerData));
    setNewMarkers(null);
  }

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
        {/* <Hienthi onDrop={handleDrop} /> */}
        <Hienthi onDrop={handleDrop} onEdit={(m) => {
        setEditingMarker(m);
        setFormData({ name: m.name, desc: m.desc, iconSrc: m.iconSrc });
        }} />
      </div>
      {/* {newMarker && (
        <MarkerForm
          newMarker={newMarker}
          formData={formData}
          setFormData={setFormData}
          Xuly={Xuly}
        />
      )} */}
        {(newMarker || editingMarker) && (
        <MarkerForm
        newMarker={newMarker}
        formData={formData}
        setFormData={setFormData}
       Xuly={Xuly}
       editing={!!editingMarker}   // truyền props để biết là đang sửa
      />
    )}
      {editingMarker && (
  <MarkerForm
    newMarker={{ lat: editingMarker.geocode[0], lng: editingMarker.geocode[1] }}
    formData={formData}
    setFormData={setFormData}
    Xuly={(e) => {
      e.preventDefault();
      const updates = {
        name: formData.name,
        desc: formData.desc,
        iconSrc: formData.iconSrc || "/img/marker-icon.png",
        popup: `${formData.name}: ${formData.desc}`,
      };
      dispatch(updateMarker({ id: editingMarker.id, updates }));
      setEditingMarker(null); // đóng form
      setFormData({ name: "", desc: "", iconSrc: "" });
    }}
  />
)}
    </div>
  );
}
