"use client";

import { useEffect } from "react";
import "leaflet/dist/leaflet.css";

export default function Map() {
  useEffect(() => {
    import("leaflet").then((L) => {
      const container = document.getElementById("map");
      if (!container) return;
      if ((container as any)._leaflet_id) return;

      const map = L.map(container).setView([27.7172, 85.3240], 13);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
      }).addTo(map);

      let marker: any = null;
      function onMapClick(e: any) {
        if (marker) {
          map.removeLayer(marker);
        }
         marker = L.marker(e.latlng)
          .addTo(map)
          .openPopup();
      }

      map.on("click", onMapClick);

      // Cleanup
      return () => {
        map.off("click", onMapClick);
        map.remove();
      };
    });
  }, []);

  return (
    <div
      id="map"
      
    />
  );
}
