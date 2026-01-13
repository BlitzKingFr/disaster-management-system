"use client";

import { useEffect } from "react";
import "leaflet/dist/leaflet.css";

export default function Map() {
  useEffect(() => {
    let L: any;

    
    import("leaflet").then((leaflet) => {
      L = leaflet;

      const container = document.getElementById("map");
      if (!container) return;
      if ((container as any)._leaflet_id) return; 

      const map = L.map(container).setView([27.7172, 85.3240], 13);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
      }).addTo(map);

      
      return () => map.remove();
    });
  }, []);

  return (
    <div
      id="map"
      
    />
  );
}
