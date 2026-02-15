import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/lib/models/User";
import { auth } from "@/app/auth";

export async function PATCH(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await auth();

        // Only admins can change roles
        if (!session?.user?.role?.toLowerCase().includes("admin")) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        const { role } = await req.json();

        if (!role) {
            return NextResponse.json({ error: "Role is required" }, { status: 400 });
        }

        await connectDB();

        const user = await User.findByIdAndUpdate(
            params.id,
            { role },
            { new: true }
        ).select("-password");

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, user });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
