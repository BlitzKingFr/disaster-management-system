
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Incident from "@/lib/models/Incident";
import "@/lib/models/Resource"; // Register Resource model
import { auth } from "@/app/auth";
import { mergeSortIncidents, calculateUrgencyScore } from "@/lib/algorithms";

// ----------------------------------------------------------------------
// GET: Fetch Incidents (Uses MERGE SORT for Prioritization)
// ----------------------------------------------------------------------
export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const archive = searchParams.get("archive") === "true";

    // Filter: Active incidents vs Resolved/Completed
    const filter = archive
      ? { status: { $in: ["resolved", "completed"] } }
      : { status: { $ne: "completed" } }; // Show everything except completed in dashboard

    // 1. Fetch from DB (Unsorted or basic sort)
    const incidents = await Incident.find(filter)
      .populate("allocatedResources.resourceId", "name")
      .lean();

    // 2. Client-side mapping to ensure shape matches Algorithm (optional but good practice)
    // We need to ensure urgencyScore exists if not in DB yet
    const mappedIncidents = incidents.map((inc: any) => ({
      ...inc,
      _id: inc._id.toString(),
      urgencyScore: inc.urgencyScore || calculateUrgencyScore(inc.severity, inc.reportCount, inc.createdAt)
    }));

    // 3. ALGORITHM: Apply Merge Sort
    const sortedIncidents = mergeSortIncidents(mappedIncidents);

    return NextResponse.json(sortedIncidents);
  } catch (err: any) {
    console.error("Fetch incidents error:", err);
    return NextResponse.json(
      { error: "Failed to fetch incidents." },
      { status: 500 }
    );
  }
}

// ----------------------------------------------------------------------
// POST: Report Incident (Uses Verification Logic & Clustering)
// ----------------------------------------------------------------------
export async function POST(req: Request) {
  try {
    const session = await auth();
    // Allow API-based creating without session if it has a secret key (future improvement)
    // For now, require session for user reports
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { disasterType, severity, description, location, address } = body;

    // Basic Validation
    if (!disasterType || !description || !location) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await connectDB();

    // ---------------------------------------------------------
    // DETECTION MECHANISM: Crowd-Sourcing Verification Logic
    // ---------------------------------------------------------

    // Search for existing OPEN incidents within 500 meters (approx 0.0045 degrees)
    // This prevents duplicate spam and auto-verifies real events.
    const DUPLICATE_THRESHOLD_DEG = 0.0045;

    const existingIncident = await Incident.findOne({
      status: { $in: ["pending", "verified", "assigned"] },
      disasterType: disasterType, // Must match type (e.g. don't merge Fire with Flood)
      "location.lat": { $gt: location.lat - DUPLICATE_THRESHOLD_DEG, $lt: location.lat + DUPLICATE_THRESHOLD_DEG },
      "location.lng": { $gt: location.lng - DUPLICATE_THRESHOLD_DEG, $lt: location.lng + DUPLICATE_THRESHOLD_DEG }
    });

    if (existingIncident) {
      // CLUSTERING: Update existing instead of creating new
      existingIncident.reportCount = (existingIncident.reportCount || 1) + 1;

      // If more than 2 people report, mark as VERIFIED automatically
      if (existingIncident.reportCount >= 2 && existingIncident.status === "pending") {
        existingIncident.status = "verified";
        existingIncident.verified = true;
      }

      // Recalculate Urgency
      existingIncident.urgencyScore = calculateUrgencyScore(
        existingIncident.severity, // Keep original severity or take max? Let's keep original for now.
        existingIncident.reportCount,
        existingIncident.createdAt
      );

      await existingIncident.save();

      return NextResponse.json({
        success: true,
        message: "Incident report merged with existing nearby alert.",
        id: existingIncident._id
      });
    }

    // ---------------------------------------------------------
    // NEW INCIDENT CREATION
    // ---------------------------------------------------------
    const initialUrgency = calculateUrgencyScore(severity, 1, new Date());

    const incident = await Incident.create({
      disasterType,
      severity,
      description,
      location,
      address: address || "",
      reportedBy: session.user.id,
      status: "pending",
      reportCount: 1,
      urgencyScore: initialUrgency,
      verified: false // Requires admin or more reports
    });

    return NextResponse.json({ success: true, id: incident._id.toString() });

  } catch (err: any) {
    console.error("Report incident error:", err);
    return NextResponse.json(
      { error: "Failed to submit report. Please try again." },
      { status: 500 }
    );
  }
}
