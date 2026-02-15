
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
// POST: Report Incident (Supports Anonymous + Authenticated Reporting)
// ----------------------------------------------------------------------
export async function POST(req: Request) {
  try {
    const session = await auth();
    const body = await req.json();
    const { disasterType, severity, description, location, address, reporterName, reporterContact } = body;

    // Basic Validation
    if (!disasterType || !description || !location) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Determine reporter
    let reportedBy = session?.user?.id || null;
    let anonymousReporter = null;

    // If no session, this is an anonymous report
    if (!session?.user?.id) {
      if (!reporterName || !reporterContact) {
        return NextResponse.json({
          error: "Anonymous reports require name and contact information"
        }, { status: 400 });
      }

      anonymousReporter = {
        name: reporterName,
        contact: reporterContact,
        timestamp: new Date()
      };
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
      disasterType: disasterType,
      "location.lat": {
        $gte: location.lat - DUPLICATE_THRESHOLD_DEG,
        $lte: location.lat + DUPLICATE_THRESHOLD_DEG,
      },
      "location.lng": {
        $gte: location.lng - DUPLICATE_THRESHOLD_DEG,
        $lte: location.lng + DUPLICATE_THRESHOLD_DEG,
      },
    });

    if (existingIncident) {
      // Merge: Increment reportCount and verify if threshold met
      existingIncident.reportCount = (existingIncident.reportCount || 1) + 1;

      // AUTO-VERIFY if 2+ independent reports
      if (existingIncident.reportCount >= 2 && existingIncident.status === "pending") {
        existingIncident.status = "verified";
        existingIncident.verified = true;
      }

      // Recalculate urgency score
      existingIncident.urgencyScore = calculateUrgencyScore(
        existingIncident.severity,
        existingIncident.reportCount,
        existingIncident.createdAt
      );

      // Add anonymous reporter to metadata if applicable
      if (anonymousReporter) {
        if (!existingIncident.metadata) {
          existingIncident.metadata = {};
        }
        if (!existingIncident.metadata.anonymousReporters) {
          existingIncident.metadata.anonymousReporters = [];
        }
        existingIncident.metadata.anonymousReporters.push(anonymousReporter);
      }

      await existingIncident.save();

      return NextResponse.json({
        message: "Duplicate incident detected. Report merged and verified.",
        incident: existingIncident,
        merged: true,
      });
    }

    // ---------------------------------------------------------
    // NEW INCIDENT: Create with appropriate status
    // ---------------------------------------------------------

    // Anonymous reports start as "pending" with lower priority
    // Authenticated reports can start as "verified" if user is trusted
    const initialStatus = anonymousReporter ? "pending" : "verified";
    const isVerified = !anonymousReporter;

    const urgencyScore = calculateUrgencyScore(severity, 1, new Date());

    const newIncident = await Incident.create({
      disasterType,
      severity,
      description,
      location,
      address: address || "",
      reportedBy,
      status: initialStatus,
      verified: isVerified,
      source: anonymousReporter ? "anonymous" : "user",
      reportCount: 1,
      urgencyScore,
      metadata: anonymousReporter ? {
        anonymousReporters: [anonymousReporter]
      } : undefined
    });

    return NextResponse.json({
      message: anonymousReporter
        ? "Anonymous report submitted. It will be reviewed by administrators."
        : "Incident reported successfully!",
      incident: newIncident,
      isAnonymous: !!anonymousReporter
    });
  } catch (err: any) {
    console.error("Report incident error:", err);
    return NextResponse.json(
      { error: "Failed to submit report." },
      { status: 500 }
    );
  }
}
