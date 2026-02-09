import { NextResponse } from "next/server";

// Simple proxy endpoint that calls a road-routing service (e.g. OpenRouteService)
// using the incident + base coordinates and returns a road-following polyline.
//
// This keeps your API key server-side and lets the frontend just
// POST { from: { lat, lng }, to: { lat, lng } } and get back coordinates.

interface Coord {
  lat: number;
  lng: number;
}

interface RouteRequestBody {
  from: Coord;
  to: Coord;
}

export async function POST(req: Request) {
  try {
    const apiKey = process.env.OPENROUTESERVICE_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        {
          error:
            "Routing service not configured. Set OPENROUTESERVICE_API_KEY in your environment.",
        },
        { status: 501 }
      );
    }

    const body = (await req.json()) as RouteRequestBody;
    if (
      !body?.from ||
      !body?.to ||
      typeof body.from.lat !== "number" ||
      typeof body.from.lng !== "number" ||
      typeof body.to.lat !== "number" ||
      typeof body.to.lng !== "number"
    ) {
      return NextResponse.json(
        { error: "Invalid payload. Expected { from: { lat, lng }, to: { lat, lng } }" },
        { status: 400 }
      );
    }

    // OpenRouteService expects coordinates as [lng, lat]
    const orsRes = await fetch("https://api.openrouteservice.org/v2/directions/driving-car", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: apiKey,
      },
      body: JSON.stringify({
        coordinates: [
          [body.from.lng, body.from.lat],
          [body.to.lng, body.to.lat],
        ],
      }),
    });

    if (!orsRes.ok) {
      const text = await orsRes.text();
      console.error("OpenRouteService error:", orsRes.status, text);
      return NextResponse.json(
        { error: "Failed to fetch road route from routing service." },
        { status: 502 }
      );
    }

    const data = await orsRes.json();

    const coords: [number, number][] =
      data?.features?.[0]?.geometry?.coordinates ?? [];

    let pathLatLng: [number, number][];

    if (!coords.length) {
      // Fallback: no road route found (e.g., unreachable by car).
      // Return a simple straight line so the frontend still renders a path.
      pathLatLng = [
        [body.from.lat, body.from.lng],
        [body.to.lat, body.to.lng],
      ];
    } else {
      // Convert [lng, lat] -> [lat, lng] for Leaflet
      pathLatLng = coords.map(
        ([lng, lat]: [number, number]) => [lat, lng]
      );
    }

    return NextResponse.json({ path: pathLatLng });
  } catch (err: any) {
    console.error("Road routing API error:", err);
    return NextResponse.json(
      { error: "Unexpected error while computing road route." },
      { status: 500 }
    );
  }
}

