import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Resource from "@/lib/models/Resource";
import { auth } from "@/app/auth";
import User from "@/lib/models/User";

export const GET = async () => {
    try {
        await connectDB();
        const resources = await Resource.find();
        return new NextResponse(JSON.stringify(resources), { status: 200 });
    } catch (err: any) {
        return new NextResponse("Error in fetching resources " + err.message, {
            status: 500,
        });
    }
};

export const POST = async (request: Request) => {
    try {
        const session = await auth();
        if (!session || !session.user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        await connectDB();
        const user = await User.findOne({ email: session.user.email });
        if (!user || user.role !== "Admin") {
            return new NextResponse("Forbidden: Admins only", { status: 403 });
        }

        const { name, type, quantity, unit } = await request.json();
        const newResource = new Resource({ name, type, quantity, unit });
        await newResource.save();

        return new NextResponse(JSON.stringify(newResource), { status: 201 });
    } catch (err: any) {
        return new NextResponse("Error in creating resource " + err.message, {
            status: 500,
        });
    }
};
