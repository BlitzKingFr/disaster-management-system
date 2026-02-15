import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/lib/models/User";
import { auth } from "@/app/auth";

export const GET = async () => {
    try {
        const session = await auth();
        if (!session) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        await connectDB();
        // Fetch users who are Field Dispatchers (or whatever role name is used for field agents)
        // Adjusting regex to be case-insensitive and inclusive of variations
        const agents = await User.find({
            role: {
                $in: [
                    "Field Dispatcher",
                    "Dispatcher",
                    "dispatcher",
                    "field dispatcher",
                    "Field Agent",
                    "field agent",
                    "field_agent"
                ]
            }
        }).select("_id name email role image");

        return new NextResponse(JSON.stringify(agents), { status: 200 });
    } catch (err: any) {
        return new NextResponse("Error fetching agents: " + err.message, {
            status: 500,
        });
    }
};
