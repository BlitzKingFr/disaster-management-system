import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/lib/models/User";
import { auth } from "@/app/auth";

export async function GET() {
    try {
        const session = await auth();

        // Only admins can view all users
        if (!session?.user?.role?.toLowerCase().includes("admin")) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        await connectDB();
        const users = await User.find({}).select("-password").sort({ createdAt: -1 });

        return NextResponse.json(users);
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
