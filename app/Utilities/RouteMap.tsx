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
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Leaflet map to visualize the Dijkstra route between Base and incident.
 * - If `roadPath` is passed in, it is drawn as the route (follows roads).
 * - Otherwise we show a straight line between from & to.
 */
export default function RouteMap({ from, to, zoom = 13, roadPath, className, style }: RouteMapProps) {
  // ... (keep useEffect same, but dependency array might need update if I change props, but here props are just for div)
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // ... (Leaflet logic - no changes needed to logic itself, just map container size)
    // BUT map needs to invalidate size if container changes. Leaflet handles resize automatically often, but explicit invalidateSize is better.
    // For now, let's assume standard Leaflet behavior.

    // ... (copy of existing useEffect logic) ...
    let map: any;

    import("leaflet").then((L) => {
      // ... standard setup ...
      if (!containerRef.current) return;
      // Check if map is already initialized
      // We can't easily check _leaflet_id on the ref current in strict TS without casting, but existing code did it.
      // Let's just keep the existing logic.
      const element = containerRef.current as any;
      if (element._leaflet_id) return;

      // Compute a simple center between from & to
      const centerLat = (from.lat + to.lat) / 2;
      const centerLng = (from.lng + to.lng) / 2;

      map = L.map(containerRef.current, {
        maxBounds: [[26.0, 80.0], [30.6, 88.3]], // Restrict to Nepal
        maxBoundsViscosity: 1.0, // Solid bounce-back
        minZoom: 7 // Prevent zooming out too far
      }).setView([centerLat, centerLng], zoom);

      L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        maxZoom: 19
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

      const polyline = L.polyline(latlngs, {
        color: "#ef4444", // tailwind red-500
        weight: 4,
        opacity: 0.9,
      }).addTo(map);

      // Fit bounds to show the whole route
      try {
        map.fitBounds(polyline.getBounds(), { padding: [50, 50] });
      } catch (e) {
        console.error("Leaflet fitBounds error", e);
      }
    });

    return () => {
      // We are not removing the map to avoid re-init issues in strict mode, 
      // but existing code had cleanup. Let's keep it.
      if (map) {
        map.remove();
        // Clear the _leaflet_id to allow re-initialization if needed
        if (containerRef.current) {
          (containerRef.current as any)._leaflet_id = null;
        }
      }
    };
  }, [from.lat, from.lng, to.lat, to.lng, zoom, from.label, to.label, roadPath]);

  return (
    <div
      ref={containerRef}
      className={`relative z-0 ${className || ''}`}
      style={{
        width: "100%",
        borderRadius: "0.75rem",
        overflow: "hidden",
        height: style?.height || "180px", // fallback
        ...style,
      }}
    />
  );
}
