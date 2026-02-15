import { NextResponse } from "next/server";

// Using OSRM public API for free, keyless routing.
// Note: This is a demo server and should not be used for heavy production loads.

interface Coord {
  lat: number;
  lng: number;
}

interface RouteRequestBody {
  from: Coord;
  to: Coord;
}

function normalizeLng(lng: number): number {
  while (lng > 180) lng -= 360;
  while (lng < -180) lng += 360;
  return lng;
}

export async function POST(req: Request) {
  try {
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

    // Normalize coordinates to handle potential wrapping (e.g. lng 448 -> 88)
    const fromLng = normalizeLng(body.from.lng);
    const toLng = normalizeLng(body.to.lng);
    const fromLat = body.from.lat;
    const toLat = body.to.lat;

    // Use the OSRM instance provided by FOSSGIS e.V. (routing.openstreetmap.de) which is more reliable
    const baseUrl = "https://routing.openstreetmap.de/routed-car/route/v1/driving";
    const coordinates = `${fromLng},${fromLat};${toLng},${toLat}`;
    const url = `${baseUrl}/${coordinates}?overview=full&geometries=geojson`;

    console.log("Fetching route from OSRM:", url);

    const osrmRes = await fetch(url, {
      headers: {
        "User-Agent": "DisasterManagementSystem/1.0",
        "Accept": "application/json"
      }
    });

    if (!osrmRes.ok) {
      const text = await osrmRes.text();
      console.warn("OSRM error:", osrmRes.status, text);

      // Fallback to straight line
      return NextResponse.json({
        path: [
          [fromLat, fromLng],
          [toLat, toLng]
        ],
        warning: "Routing service failed. Using straight-line fallback."
      });
    }

    const data = await osrmRes.json();

    if (!data.routes || data.routes.length === 0) {
      // No route found (e.g. across ocean or separate islands without bridge)
      return NextResponse.json({
        path: [
          [fromLat, fromLng],
          [toLat, toLng]
        ],
        warning: "No driving route found. Using straight-line fallback."
      });
    }

    // OSRM returns [lng, lat]. Leaflet needs [lat, lng].
    const coords = data.routes[0].geometry.coordinates;
    const pathLatLng = coords.map((c: [number, number]) => [c[1], c[0]]);

    return NextResponse.json({ path: pathLatLng });

  } catch (err: any) {
    console.error("Road routing API error:", err);
    return NextResponse.json(
      { error: "Unexpected error while computing road route." },
      { status: 500 }
    );
  }
}
