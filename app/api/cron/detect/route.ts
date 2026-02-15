
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Incident from "@/lib/models/Incident";
import { calculateUrgencyScore } from "@/lib/algorithms";

// Helper to simulate external API calls (or real ones if keys existed)
async function fetchEarthquakeData() {
    // In a real production app, this would fetch from USGS API
    // const res = await fetch("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_hour.geojson");
    // return res.json();

    // SIMULATION FOR ACADEMIC DEMO:
    // Random chance of earthquake detection
    if (Math.random() > 0.7) {
        return {
            features: [
                {
                    properties: {
                        mag: 6.2,
                        place: "12km NW of Lamjung, Nepal",
                        time: Date.now(),
                        url: "https://earthquake.usgs.gov/earthquakes/eventpage/usgs2024abcd",
                        type: "earthquake"
                    },
                    geometry: {
                        coordinates: [84.4, 28.2, 10] // Longitude, Latitude, Depth
                    },
                    id: "usgs_" + Date.now()
                }
            ]
        };
    }
    return { features: [] };
}

export async function GET() {
    try {
        await connectDB();
        let newIncidents = [];

        // 1. EARTHQUAKE DETECTION (USGS API)
        const quakeData = await fetchEarthquakeData();

        for (const feature of quakeData.features) {
            const { mag, place, time, type } = feature.properties;
            const id = feature.id;
            const [lng, lat] = feature.geometry.coordinates; // GeoJSON is Lng, Lat

            // Basic dedup logic
            const exists = await Incident.findOne({ externalId: id });
            if (!exists) {
                const urgency = calculateUrgencyScore(Math.min(5, Math.floor(mag)), 1, new Date()); // Mag 6 -> Urgency 60+
                await Incident.create({
                    disasterType: "Earthquake",
                    severity: Math.min(5, Math.ceil(mag - 2)), // Scale roughly to 1-5
                    description: `Automated Alert: Magnitude ${mag} ${type} detected near ${place}.`,
                    location: { lat, lng },
                    address: place,
                    reportedBy: "SYSTEM_USGS_API",
                    status: "verified",
                    source: "api",
                    externalId: id,
                    verified: true,
                    urgencyScore: urgency,
                    reportCount: 1
                });
                newIncidents.push(`Earthquake: ${place}`);
            }
        }

        return NextResponse.json({
            success: true,
            detected: newIncidents.length,
            details: newIncidents
        });

    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
