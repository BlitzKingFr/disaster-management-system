import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// -----------------------------
// Geospatial / Routing Helpers
// -----------------------------

export const BASE_COORDS = {
  lat: 26.629307,
  lng: 87.982475,
};

export type GraphNodeId = string;

export interface GraphEdge {
  to: GraphNodeId;
  weight: number;
}

export type Graph = Record<GraphNodeId, GraphEdge[]>;

/**
 * Compute the haversine distance between two coordinates in kilometers.
 */
export function haversineDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371; // Earth radius in km
  const toRad = (deg: number) => (deg * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

/**
 * Classic Dijkstra's algorithm on a weighted graph.
 * Returns the shortest path and total distance between two nodes.
 */
export function dijkstra(
  graph: Graph,
  start: GraphNodeId,
  target: GraphNodeId
): { distance: number; path: GraphNodeId[] } | null {
  const distances: Record<GraphNodeId, number> = {};
  const previous: Record<GraphNodeId, GraphNodeId | null> = {};
  const visited = new Set<GraphNodeId>();

  for (const node of Object.keys(graph)) {
    distances[node] = Infinity;
    previous[node] = null;
  }
  if (!(start in graph) || !(target in graph)) {
    return null;
  }

  distances[start] = 0;

  while (true) {
    let current: GraphNodeId | null = null;
    let minDistance = Infinity;

    for (const node of Object.keys(distances)) {
      if (!visited.has(node) && distances[node] < minDistance) {
        minDistance = distances[node];
        current = node;
      }
    }

    if (current === null || current === target) break;

    visited.add(current);

    const edges = graph[current] || [];
    for (const edge of edges) {
      const alt = distances[current] + edge.weight;
      if (alt < distances[edge.to]) {
        distances[edge.to] = alt;
        previous[edge.to] = current;
      }
    }
  }

  if (distances[target] === Infinity) {
    return null;
  }

  const path: GraphNodeId[] = [];
  let node: GraphNodeId | null = target;
  while (node) {
    path.unshift(node);
    node = previous[node];
  }

  return { distance: distances[target], path };
}

