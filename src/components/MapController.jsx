import { useMap } from "react-leaflet";
import { useEffect } from "react";
function MapController({ onMapReady }) {
  const map = useMap();

  useEffect(() => {
    if (map) {
      console.log("MapController: Bản đồ sẵn sàng!");
      onMapReady(map);
    }
  }, [map, onMapReady]);

  return null;
}
export default MapController; 