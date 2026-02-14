import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Incident from "@/lib/models/Incident";
import { auth } from "@/app/auth";
import User from "@/lib/models/User";

export const PATCH = async (
    request: Request,
    { params }: { params: { id: string } }
) => {
    const { id } = await params;

    try {
        const session = await auth();
        if (!session || !session.user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        await connectDB();
        const user = await User.findOne({ email: session.user.email });

        if (!user) {
            return new NextResponse("User not found", { status: 404 });
        }

        const { fieldReport } = await request.json();

        // Basic validation
        if (!["controlled", "out_of_control"].includes(fieldReport)) {
            return new NextResponse("Invalid field report value", { status: 400 });
        }

        const incident = await Incident.findById(id);
        if (!incident) {
            return new NextResponse("Incident not found", { status: 404 });
        }

        // Check if the incident is assigned to this user (unless admin)
        const isAssignedAgent = incident.assignedTo?.toString() === user._id.toString();
        const isAdmin = user.role.toLowerCase().includes("admin");

        if (!isAssignedAgent && !isAdmin) {
            return new NextResponse("Forbidden: You are not assigned to this incident", { status: 403 });
        }

        incident.status = "completed";
        incident.fieldReport = fieldReport;

        await incident.save();

        return NextResponse.json(incident);
    } catch (error: any) {
        console.error("Error updating incident status:", error);
        return new NextResponse("Error: " + error.message, { status: 500 });
    }
};
