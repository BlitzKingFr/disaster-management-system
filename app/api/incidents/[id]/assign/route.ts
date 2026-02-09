import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Incident from "@/lib/models/Incident";
import Resource from "@/lib/models/Resource";
import { auth } from "@/app/auth";
import User from "@/lib/models/User";
import mongoose from "mongoose";

export const PATCH = async (
    request: Request,
    { params }: { params: { id: string } }
) => {
    const { id } = params;

    try {
        const session = await auth();
        if (!session || !session.user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        await connectDB();
        const user = await User.findOne({ email: session.user.email });

        // Authorization check
        if (!user || user.role !== "Admin") {
            // Ideally restricted to Admin, but potentially Dispatchers too?
            // For now, let's stick to Admin as requested.
            return new NextResponse("Forbidden", { status: 403 });
        }

        const { assignedTo, allocatedResources } = await request.json();

        const incident = await Incident.findById(id);
        if (!incident) {
            return new NextResponse("Incident not found", { status: 404 });
        }

        // Start transaction session for atomicity (Resource alloc + Incident update)
        const dbSession = await mongoose.startSession();
        dbSession.startTransaction();

        try {
            // 1. Update Assignment
            if (assignedTo) {
                incident.assignedTo = assignedTo;
                incident.status = "assigned"; // Update status
            }

            // 2. Handle Resource Allocation
            if (allocatedResources && Array.isArray(allocatedResources)) {
                for (const alloc of allocatedResources) {
                    const resource = await Resource.findById(alloc.resourceId).session(dbSession);

                    if (!resource) {
                        throw new Error(`Resource ${alloc.resourceId} not found`);
                    }

                    if (resource.quantity < alloc.quantity) {
                        throw new Error(`Insufficient quantity for ${resource.name}. Available: ${resource.quantity}`);
                    }

                    // Deduct from inventory
                    resource.quantity -= alloc.quantity;
                    if (resource.quantity === 0) resource.status = "Depleted";
                    await resource.save({ session: dbSession });

                    // Add to incident
                    incident.allocatedResources.push({
                        resourceId: alloc.resourceId,
                        name: resource.name,
                        quantity: alloc.quantity
                    });
                }
            }

            await incident.save({ session: dbSession });
            await dbSession.commitTransaction();

            return new NextResponse(JSON.stringify(incident), { status: 200 });

        } catch (error: any) {
            await dbSession.abortTransaction();
            return new NextResponse(error.message, { status: 400 });
        } finally {
            dbSession.endSession();
        }

    } catch (err: any) {
        return new NextResponse("Error assigning incident: " + err.message, {
            status: 500,
        });
    }
};
