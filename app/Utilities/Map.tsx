"use client";

import { useEffect } from "react";
import "leaflet/dist/leaflet.css";

interface MapProps {
  onLocationSelect?: (lat: number, lng: number) => void;
  initialPosition?: [number, number];
  zoom?: number;
}

export default function Map({
  onLocationSelect,
  initialPosition = [52.5200, 13.4050],
  zoom = 13,
}: MapProps) {
  useEffect(() => {
    import("leaflet").then((L) => {
      const container = document.getElementById("map");
      if (!container) return;
      if ((container as any)._leaflet_id) return;

      const map = L.map(container).setView(initialPosition, zoom);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
      }).addTo(map);

      let marker: any = null;
      function onMapClick(e: any) {
        if (marker) {
          map.removeLayer(marker);
        }
        marker = L.marker(e.latlng).addTo(map).openPopup();

        // Send coordinates back to parent
        if (onLocationSelect) {
          onLocationSelect(e.latlng.lat, e.latlng.lng);
        }
      }

      map.on("click", onMapClick);

      // Cleanup
      return () => {
        map.off("click", onMapClick);
        map.remove();
      };
    });
  }, [initialPosition, zoom, onLocationSelect]);

  return (
    <div
      id="map"
      className="relative z-0"
      style={{ width: "100%", height: "16rem", borderRadius: "1rem" }}
    />
  );
}
