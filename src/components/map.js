import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import L from "leaflet";
import { fetchMarker, themMarker, xoaMarker } from "../store/markerslice";

function DropHandler({ onDrop }) {
  const dispatch = useDispatch();
  const map = useMapEvents({});

  useEffect(() => {
    const container = map.getContainer();

    const handleDragOver = (e) => e.preventDefault();

    const handleDrop = (e) => {
      e.preventDefault();
      const data = e.dataTransfer.getData("icon");
      if (!data) return;

      try {
        const icon = JSON.parse(data);
        if (!icon.src) icon.src = "/img/marker-icon.png";

        const rect = container.getBoundingClientRect();
        const point = L.point(e.clientX - rect.left, e.clientY - rect.top);
        const latlng = map.containerPointToLatLng(point);
        onDrop?.(latlng, icon);
      } catch (err) {
        console.error("DropHandler parse error:", err);
      }
    };

    container.addEventListener("dragover", handleDragOver);
    container.addEventListener("drop", handleDrop);

    return () => {
      container.removeEventListener("dragover", handleDragOver);
      container.removeEventListener("drop", handleDrop);
    };
  }, [map, dispatch, onDrop]);

  return null;
}

export default function Hienthi({ onDrop }) {
  const dispatch = useDispatch();
  const markers = useSelector((state) => state.markers.list || []);

  return (
    <MapContainer
      center={[21.028511, 105.804817]}
      zoom={13}
      style={{ height: "100vh", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <DropHandler onDrop={onDrop} />

      {markers.map((m) => {
        const iconUrl = m.iconSrc || "/img/marker-icon.png";
        const markerIcon = new L.Icon({
          iconUrl,
          iconSize: [40, 40],
          iconAnchor: [20, 40],
          popupAnchor: [0, -40],
          shadowUrl: "/img/marker-shadow.png",
          shadowSize: [41, 41],
        });

        return (
          <Marker key={m.id} position={m.geocode} icon={markerIcon}>
            <Popup>
              <div>
              <b>{m.popup}</b>
              <br />
              <button
                onClick={() => {console.log("Xoá marker id:", m.id);
                  dispatch(xoaMarker(m.id))}}
                style={{
                  marginTop:"5px",
                  padding: "3px 6px",
                  background: "red",
                  color: "white",
                  border: "none",
                  borderRadius:"4px ",
                  cursor: "pointer",
                }}
                >
                Xóa
              </button>
              </div>
              </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
