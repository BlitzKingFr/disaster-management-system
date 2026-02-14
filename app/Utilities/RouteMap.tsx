"use client";

import { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";

interface RouteMapProps {
  from: { lat: number; lng: number; label?: string };
  to: { lat: number; lng: number; label?: string };
  /**
   * Optional road-following path. If provided, we draw this
   * polyline (generated via a routing service that internally
   * uses Dijkstra/A* on the road network). If not provided, we
   * fall back to a straight line between from and to.
   */
  roadPath?: [number, number][];
  zoom?: number;
}

/**
 * Leaflet map to visualize the Dijkstra route between Base and incident.
 * - If `roadPath` is passed in, it is drawn as the route (follows roads).
 * - Otherwise we show a straight line between from & to.
 */
export default function RouteMap({ from, to, zoom = 13, roadPath }: RouteMapProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let map: any;

    import("leaflet").then((L) => {
      if (!containerRef.current) return;
      if ((containerRef.current as any)._leaflet_id) return;

      // Compute a simple center between from & to
      const centerLat = (from.lat + to.lat) / 2;
      const centerLng = (from.lng + to.lng) / 2;

      map = L.map(containerRef.current).setView([centerLat, centerLng], zoom);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
      }).addTo(map);

      const baseMarker = L.marker([from.lat, from.lng]).addTo(map);
      baseMarker.bindPopup(from.label || "Base").openPopup();

      const incidentMarker = L.marker([to.lat, to.lng]).addTo(map);
      incidentMarker.bindPopup(to.label || "Incident");

      const latlngs: [number, number][] =
        roadPath && roadPath.length > 1
          ? roadPath
          : ([
            [from.lat, from.lng],
            [to.lat, to.lng],
          ] as [number, number][]);

      L.polyline(latlngs, {
        color: "#ef4444", // tailwind red-500
        weight: 4,
        opacity: 0.9,
      }).addTo(map);

      map.fitBounds(latlngs, { padding: [20, 20] });
    });

    return () => {
      if (map) {
        map.remove();
      }
    };
  }, [from.lat, from.lng, to.lat, to.lng, zoom, from.label, to.label, roadPath]);

  return (
    <div
      ref={containerRef}
      className="relative z-0"
      style={{
        width: "100%",
        height: "180px",
        borderRadius: "0.75rem",
        overflow: "hidden",
      }}
    />
  );
}
