import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MapContainer, TileLayer, Marker, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import MapController from "./MapController";
import { fetchMarker, xoaMarker, suaMarker } from "../store/markerslice";
import "./popup.css";


function DropHandler({ onDrop }) {
  const map = useMap();

  useEffect(() => {
    const container = map?.getContainer?.();
    if (!container) return;

    const handleDragOver = (e) => e.preventDefault();

    const handleDrop = (e) => {
      e.preventDefault();
      e.stopPropagation();

      const data = e.dataTransfer.getData("icon");
      if (!data) return;

      let icon;
      try {
        icon = JSON.parse(data);
      } catch (err) {
        console.warn("JSON parse error:", err);
        return;
      }

      if (!icon.src) icon.src = "/img/marker-icon.png";

      const rect = container.getBoundingClientRect();
      const point = L.point(e.clientX - rect.left, e.clientY - rect.top);
      const latlng = map.containerPointToLatLng(point);

      onDrop?.(latlng, icon);
    };

    container.addEventListener("dragover", handleDragOver);
    container.addEventListener("drop", handleDrop);

    return () => {
      container.removeEventListener("dragover", handleDragOver);
      container.removeEventListener("drop", handleDrop);
    };
  }, [map, onDrop]);

  return null;
}

export default function Hienthi({ onDrop, currentUser }) {
  const dispatch = useDispatch();
  const markers = useSelector((s) => s.markers.list || []);

  const [mapObj, setMapObj] = useState(null);
  const [mapReady, setMapReady] = useState(false);

  const [routeOptions, setRouteOptions] = useState([]);
  const [selectedRouteId, setSelectedRouteId] = useState(null);

  const [handDrawnPath, setHandDrawnPath] = useState([]);
  const [routingMode, setRoutingMode] = useState({ waitingFrom: null });

  const [selectedMarker, setSelectedMarker] = useState(null);
  const [editingMarker, setEditingMarker] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", amount: "", desc: "" });

  useEffect(() => {
    dispatch(fetchMarker());
  }, [dispatch]);

  
  const createIcon = (url) =>
    new L.Icon({
      iconUrl: url || "/img/marker-icon.png",
      shadowUrl: "/img/marker-shadow.png",
      iconSize: [40, 40],
      iconAnchor: [20, 40],
      popupAnchor: [0, -35],
    });

  const createVertexIcon = () =>
    new L.DivIcon({
      className: "vertex-icon",
      html: `<div style="width:10px;height:10px;border-radius:50%;background:#000;border:2px solid #fff"></div>`,
      iconSize: [14, 14],
      iconAnchor: [7, 7],
    });

  const ensureRoutePane = (map) => {
    if (!map.getPane("routePane")) {
      const pane = map.createPane("routePane");
      pane.style.zIndex = 650;
      pane.style.pointerEvents = "none";
    }
  };

  const handleMapReady = (map) => {
    console.log("Map đã sẵn sàng (từ MapController)");
    setMapObj(map);
    ensureRoutePane(map);
    setMapReady(true);
  };

  const fmtDistance = (m) => {
    if (m == null) return "-";
    if (m >= 1000) return (m / 1000).toFixed(1) + " km";
    return Math.round(m) + " m";
  };
  const fmtDuration = (s) => {
    if (s == null) return "-";
    const mins = Math.round(s / 60);
    if (mins < 60) return mins + " min";
    const h = Math.floor(mins / 60);
    const rem = mins % 60;
    return `${h}h ${rem}m`;
  };


  const createRouteBetween = async (fromMarker, toMarker) => {
    console.log("Tìm route alternatives:", fromMarker.id, "→", toMarker.id);
    setRouteOptions([]);
    setSelectedRouteId(null);

    if (!mapObj || !mapReady) {
      console.warn("Map chưa sẵn sàng");
      return;
    }

    const from = Array.isArray(fromMarker.geocode) ? fromMarker.geocode : [fromMarker.lat, fromMarker.lng];
    const to = Array.isArray(toMarker.geocode) ? toMarker.geocode : [toMarker.lat, toMarker.lng];

    if (!from || !to) return;

    const [lat1, lng1] = from;
    const [lat2, lng2] = to;

    try {
      const url = `https://router.project-osrm.org/route/v1/driving/${lng1},${lat1};${lng2},${lat2}?overview=full&geometries=geojson&alternatives=true`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("OSRM response not ok");
      const data = await res.json();

      const options = (data.routes || []).map((r, idx) => {
        const coords = (r.geometry?.coordinates || []).map((c) => [c[1], c[0]]);
        return {
          id: `${Date.now()}-${idx}`,
          coords,
          distance: r.distance,
          duration: r.duration,
          summary: r.legs?.map((l) => l.summary).filter(Boolean).join(", ") || r.summary || "",
        };
      });

      if (options.length === 0 && data.routes && data.routes[0]) {
        const r = data.routes[0];
        const coords = (r.geometry?.coordinates || []).map((c) => [c[1], c[0]]);
        options.push({
          id: `${Date.now()}-0`,
          coords,
          distance: r.distance,
          duration: r.duration,
          summary: r.summary || "",
        });
      }

      if (options.length === 0) {
        const straight = [[lat1, lng1], [lat2, lng2]];
        options.push({
          id: `${Date.now()}-fallback`,
          coords: straight,
          distance: null,
          duration: null,
          summary: "Thẳng",
        });
      }

      setRouteOptions(options);

      if (options[0]?.coords?.length) {
        const firstBounds = L.latLngBounds(options[0].coords);
        mapObj.fitBounds(firstBounds, { padding: [50, 50] });
      }
    } catch (err) {
      console.warn("OSRM lỗi → fallback thẳng", err);
      const straight = [[lat1, lng1], [lat2, lng2]];
      setRouteOptions([
        {
          id: `${Date.now()}-fallback`,
          coords: straight,
          distance: null,
          duration: null,
          summary: "Thẳng",
        },
      ]);
      mapObj.fitBounds(L.latLngBounds(straight), { padding: [50, 50] });
    }
  };

  const selectRoute = (routeId) => {
    const opt = routeOptions.find((r) => r.id === routeId);
    if (!opt) return;
    setSelectedRouteId(routeId);
    if (mapObj && opt.coords && opt.coords.length > 0) {
      mapObj.fitBounds(L.latLngBounds(opt.coords), { padding: [50, 50] });
    }
  };

  const handleMarkerClick = (marker) => {
    if (routingMode.waitingFrom) {
      const fromId = routingMode.waitingFrom;
      if (String(fromId) === String(marker.id)) {
        setRoutingMode({ waitingFrom: null });
        setSelectedMarker(marker);
        return;
      }

      const fromMarker = markers.find((m) => String(m.id) === String(fromId));
      if (!fromMarker) {
        alert("Không tìm thấy điểm xuất phát!");
        setRoutingMode({ waitingFrom: null });
        return;
      }

      createRouteBetween(fromMarker, marker);
      setRoutingMode({ waitingFrom: null });
    }
    setSelectedMarker(marker);
  };

  const onStartRoutingFromThis = useCallback(
    (marker) => {
      if (!mapReady) {
        alert("Bản đồ chưa sẵn sàng!");
        return;
      }
      console.log("Bắt đầu chỉ đường từ:", marker.id);
      setRoutingMode({ waitingFrom: marker.id });
    },
    [mapReady]
  );

  const handleMapClick = useCallback(
    (e) => {
      if (routingMode.waitingFrom) return;
      const { lat, lng } = e.latlng;
      setHandDrawnPath((prev) => [...prev, [lat, lng]]);
    },
    [routingMode.waitingFrom]
  );

  const startEdit = (marker) => {
    setEditingMarker(marker.id);
    setEditForm({
      name: marker.name || "",
      amount: marker.amount || "",
      desc: marker.desc || "",
    });
  };

  const saveEdit = async () => {
    try {
      const payload = {
        id: selectedMarker.id,
        name: editForm.name,
        desc: editForm.desc,
        amount: editForm.amount,
      };
      await dispatch(suaMarker(payload)).unwrap();
      setSelectedMarker((prev) => ({ ...prev, ...editForm }));
      setEditingMarker(null);
    } catch {
      alert("Lưu thất bại");
    }
  };

  const handleDeleteMarker = async (id) => {
    if (!window.confirm("Xóa marker này?")) return;
    try {
      await dispatch(xoaMarker(id)).unwrap();
      if (selectedMarker?.id === id) setSelectedMarker(null);
      setRouteOptions([]);
      setSelectedRouteId(null);
    } catch {
      alert("Xóa thất bại");
    }
  };

  return (
    <div className="map-root" style={{ height: "100vh", position: "relative" }}>
      {/* Controls */}
      <div style={{ position: "absolute", left: 12, bottom: 12, zIndex: 1200, display: "flex", gap: 8 }}>
        <button
          onClick={() => {
            setHandDrawnPath([]);
          }}
          style={{
            background: "#fff",
            padding: "8px 12px",
            borderRadius: 8,
            boxShadow: "0 6px 18px rgba(0,0,0,0.12)",
            cursor: "pointer",
            fontSize: 14,
            fontWeight: 600,
          }}
        >
          Xóa đường vẽ
        </button>

        <button
          onClick={() => {
            setRouteOptions([]);
            setSelectedRouteId(null);
          }}
          style={{
            background: "#fff",
            padding: "8px 12px",
            borderRadius: 8,
            boxShadow: "0 6px 18px rgba(0,0,0,0.12)",
            cursor: "pointer",
            fontSize: 14,
            fontWeight: 600,
          }}
        >
          Xóa đường chỉ đường
        </button>
      </div>

      {routingMode.waitingFrom && (
        <div
          style={{
            position: "absolute",
            top: 12,
            right: 12,
            zIndex: 2000,
            background: "#fff",
            padding: "8px 12px",
            borderRadius: 8,
            boxShadow: "0 2px 10px rgba(0,0,0,.15)",
            fontSize: 14,
            fontWeight: 600,
          }}
        >
          Chọn điểm đích...
        </div>
      )}

      <MapContainer
        center={[21.028511, 105.804817]}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
        onClick={handleMapClick}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <DropHandler onDrop={onDrop} />
        <MapController onMapReady={handleMapReady} />

        {mapReady &&
          routeOptions.map((opt) => {
            const isSelected = selectedRouteId === opt.id;
            return (
              <Polyline
                key={opt.id}
                positions={opt.coords}
                pathOptions={{
                  color: isSelected ? "#007bff" : "#666",
                  weight: isSelected ? 8 : 4,
                  opacity: isSelected ? 0.95 : 0.45,
                  dashArray: isSelected ? null : "8,6",
                }}
                eventHandlers={{
                  click: () => selectRoute(opt.id),
                }}
                pane="routePane"
              />
            );
          })}

        {mapReady && handDrawnPath.length > 0 && (
          <Polyline positions={handDrawnPath} pathOptions={{ color: "#000", weight: 3 }} pane="routePane" />
        )}

        {mapReady &&
          handDrawnPath.map((pos, i) => (
            <Marker key={`vertex-${i}`} position={pos} icon={createVertexIcon()} interactive={false} />
          ))}

        {mapReady &&
          markers.map((m) => {
            const pos = Array.isArray(m.geocode) ? [Number(m.geocode[0]), Number(m.geocode[1])] : m.lat != null ? [Number(m.lat), Number(m.lng)] : null;
            if (!pos) return null;
            return (
              <Marker
                key={m.id}
                position={pos}
                icon={createIcon(m.iconSrc)}
                eventHandlers={{
                  click: () => handleMarkerClick(m),
                }}
              />
            );
          })}
      </MapContainer>

      {routeOptions.length > 0 && (
        <div
          style={{
            position: "absolute",
            top: 12,
            left: 12,
            zIndex: 2200,
            background: "#fff",
            padding: 10,
            borderRadius: 8,
            boxShadow: "0 6px 24px rgba(0,0,0,0.12)",
            minWidth: 220,
            maxHeight: "50vh",
            overflow: "auto",
          }}
        >
          <div style={{ fontWeight: 700, marginBottom: 8 }}>Phương án đường ({routeOptions.length})</div>
          {routeOptions.map((opt, idx) => {
            const isSelected = selectedRouteId === opt.id;
            return (
              <div key={opt.id} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600 }}>{isSelected ? `✓ Phương án ${idx + 1}` : `Phương án ${idx + 1}`}</div>
                  <div style={{ fontSize: 12, color: "#444" }}>{opt.summary || "Không có tóm tắt"}</div>
                  <div style={{ fontSize: 12, color: "#666" }}>
                    {fmtDistance(opt.distance)} • {fmtDuration(opt.duration)}
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <button
                    onClick={() => selectRoute(opt.id)}
                    style={{
                      padding: "6px 8px",
                      borderRadius: 6,
                      background: isSelected ? "#007bff" : "#e6e6e6",
                      color: isSelected ? "#fff" : "#000",
                      border: "none",
                      cursor: "pointer",
                      fontSize: 12,
                    }}
                  >
                    {isSelected ? "Đã chọn" : "Chọn"}
                  </button>
                </div>
              </div>
            );
          })}
          <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
            <button
              onClick={() => {
                if (!selectedRouteId) {
                  alert("Hãy chọn 1 phương án trước khi áp dụng");
                  return;
                }
                alert("Đã áp dụng phương án đường đã chọn");
              }}
              style={{ padding: "6px 8px", borderRadius: 6, border: "none", cursor: "pointer" }}
            >
              Áp dụng
            </button>

            <button
              onClick={() => {
                setRouteOptions([]);
                setSelectedRouteId(null);
              }}
              style={{ padding: "6px 8px", borderRadius: 6, border: "none", cursor: "pointer", background: "#f3f3f3" }}
            >
              Bỏ
            </button>
          </div>
        </div>
      )}

      {selectedMarker && (
        <div className="side-popup-container">
          <div className="popup-scroll">
            <div className="popup-card">
              <div className="popup-header">
                <div className="title">{editingMarker === selectedMarker.id ? "Đang sửa..." : selectedMarker.name || "Marker"}</div>
                <div className="actions">
                  {currentUser?.role === "admin" && editingMarker !== selectedMarker.id && (
                    <>
                      <button className="btn-edit" onClick={() => startEdit(selectedMarker)}>
                        Sửa
                      </button>
                      <button className="btn-delete" onClick={() => handleDeleteMarker(selectedMarker.id)}>
                        Xóa
                      </button>
                    </>
                  )}
                  <button
                    className="btn-edit"
                    onClick={() => onStartRoutingFromThis(selectedMarker)}
                    disabled={!mapReady}
                    style={{
                      cursor: mapReady ? "pointer" : "not-allowed",
                      opacity: mapReady ? 1 : 0.6,
                    }}
                  >
                    Chỉ đường
                  </button>
                  <button className="btn-close" onClick={() => setSelectedMarker(null)}>
                    ×
                  </button>
                </div>
              </div>

              <div className="popup-body">
                {routingMode.waitingFrom && String(routingMode.waitingFrom) === String(selectedMarker.id) && (
                  <div
                    style={{
                      background: "#e3f2fd",
                      color: "#0b57d0",
                      padding: "8px 12px",
                      borderRadius: 6,
                      fontWeight: 600,
                      marginBottom: 12,
                      fontSize: 14,
                    }}
                  >
                    Đang chờ chọn điểm đích
                  </div>
                )}

                {editingMarker === selectedMarker.id ? (
                  <>
                    <div className="pb-row">
                      <label>Tên:</label>
                      <input value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} name="edit-name" placeholder="Tên marker" />
                    </div>
                    <div className="pb-row">
                      <label>Số lượng:</label>
                      <input value={editForm.amount} onChange={(e) => setEditForm({ ...editForm, amount: e.target.value })} name="edit-amount" placeholder="Số lượng" />
                    </div>
                    <div className="pb-row">
                      <label>Mô tả:</label>
                      <textarea value={editForm.desc} onChange={(e) => setEditForm({ ...editForm, desc: e.target.value })} name="edit-desc" placeholder="Mô tả chi tiết" rows={3} />
                    </div>
                    <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                      <button onClick={saveEdit} className="btn-edit">
                        Lưu
                      </button>
                      <button onClick={() => setEditingMarker(null)} className="btn-delete" style={{ background: "#9ca3af" }}>
                        Hủy
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="pb-row">
                      <label>Địa chỉ:</label>
                      <div className="value">{selectedMarker.geocode ? `${Number(selectedMarker.geocode[0]).toFixed(6)}, ${Number(selectedMarker.geocode[1]).toFixed(6)}` : "-"}</div>
                    </div>
                    <div className="pb-row">
                      <label>Số lượng:</label>
                      <div className="value">{selectedMarker.amount || "-"}</div>
                    </div>
                    <div className="pb-row">
                      <label>Mô tả:</label>
                      <div className="value">{selectedMarker.desc || "-"}</div>
                    </div>
                  </>
                )}

                <hr style={{ border: "none", borderTop: "1px solid rgba(0,0,0,0.06)", margin: "12px 0" }} />
                <div className="popup-meta">
                  <b>ID:</b> {selectedMarker.id}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
