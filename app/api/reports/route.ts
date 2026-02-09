import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Incident from "@/lib/models/Incident";
// Import Resource model for its side‑effects so Mongoose registers the schema
import "@/lib/models/Resource";
import { auth } from "@/app/auth";

export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const archive = searchParams.get("archive") === "true";
    const filter = archive ? {} : { status: { $ne: "resolved" } };
    const incidents = await Incident.find(filter)
      .populate("allocatedResources.resourceId", "name")
      .lean()
      .sort({ createdAt: -1 });
    return NextResponse.json(incidents);
  } catch (err) {
    console.error("Fetch incidents error:", err);
    return NextResponse.json(
      { error: "Failed to fetch incidents." },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "You must be logged in to report an incident." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { disasterType, severity, description, location, address } = body;

    if (!disasterType?.trim()) {
      return NextResponse.json(
        { error: "Disaster type is required" },
        { status: 400 }
      );
    }

    if (typeof severity !== "number" || severity < 1 || severity > 5) {
      return NextResponse.json(
        { error: "Severity must be between 1 and 5" },
        { status: 400 }
      );
    }

    if (!description?.trim()) {
      return NextResponse.json(
        { error: "Description is required" },
        { status: 400 }
      );
    }

    // Location from map click is required - lat and lng
    if (
      !location ||
      typeof location.lat !== "number" ||
      typeof location.lng !== "number"
    ) {
      return NextResponse.json(
        { error: "Please click on the map to select the incident location" },
        { status: 400 }
      );
    }

    await connectDB();

    const incident = await Incident.create({
      disasterType: disasterType.trim(),
      severity,
      description: description.trim(),
      location: {
        lat: location.lat,
        lng: location.lng,
      },
      address: address?.trim() || "",
      reportedBy: session.user.id,
    });

    return NextResponse.json({
      success: true,
      id: incident._id.toString(),
    });
  } catch (err) {
    console.error("Report incident error:", err);
    return NextResponse.json(
      { error: "Failed to submit report. Please try again." },
      { status: 500 }
    );
  }
}
